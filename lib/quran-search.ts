/** Search over the full Quran for the Ayah Finder tool.
 *
 * Plain client-safe module: no JSX, no hooks, no "use client" — it is only
 * imported by the tool's client component, and the index fetch only ever runs
 * from effects after mount. The scoring is deliberately simple: fold query and
 * ayah text to the same bare Arabic, count how many query tokens appear, and
 * nudge exact phrases up. Good enough to rank "بسم الله" over a scattered
 * match, and cheap enough to run on every keystroke because the 6,236 rows
 * are normalized once at first load.
 *
 * The index rows come from scripts/build-quran-search-index.mjs and keep the
 * raw Uthmani text — BOM, tatweel and harakat are stripped here at match
 * time, so display code can keep showing the decorated text.
 *
 * Each hit also carries its surah's SurahMeta — resolved once at load from
 * lib/quran-meta.ts (a pure-data module, so this stays client-safe) — letting
 * the client render card labels (translit + Arabic) and the
 * /quran/surah/<slug>#ayah-<a-1> deep link straight from the result. */

import { HARAKAT, NOISE } from "./arabic";
import { surahByNumber, type SurahMeta } from "./quran-meta";

export type SearchRow = {
  /** Global ayah number, 1–6236. */
  n: number;
  /** Surah number, 1–114. */
  s: number;
  /** Ayah number within the surah. */
  a: number;
  /** Raw Uthmani text, exactly as written to the index. */
  t: string;
};

export type SearchHit = {
  row: SearchRow;
  /** 0–1: fraction of query tokens matched, plus a capped phrase bonus. */
  confidence: number;
  /** The surah this ayah belongs to — for card labels (translit/arabic) and
   * the /quran/surah/<slug>#ayah-<a-1> deep link. Resolved once at load. */
  surah: SurahMeta;
};

/** Uthmani spellings that a person typing won't use. ٱ (U+0671, alef wasla)
 * is NOT in HARAKAT, so the fold — not the harakat strip — is what catches
 * it. Applied after the strip so marks are gone before we merge letters. */
const FOLD: Array<[RegExp, string]> = [
  [/[\u0623\u0625\u0622\u0671]/g, "ا"],
  [/ة/g, "ه"],
  [/ى/g, "ي"],
];

/** Bump for rows containing the whole query as a phrase. Capped at 1.0 so it
 * never outranks an all-tokens match, only separates it from a scattered one. */
const PHRASE_BONUS = 0.15;

type PreparedRow = {
  row: SearchRow;
  /** searchArabic(t) — what query text is compared against. */
  text: string;
  /** The words of `text`, for O(1) containment checks. */
  tokens: Set<string>;
};

/** One fetch, shared by every caller. Rebuilt if it rejects so a transient
 * network error doesn't poison the module for the tab's whole lifetime. */
let indexCache: Promise<PreparedRow[]> | null = null;

/** The same folding a reader would apply: no BOM/tatweel/harakat, أإآٱ→ا,
 * ة→ه, ى→ي, whitespace collapsed. Mirrors bareArabic's semantics. */
function searchArabic(text: string): string {
  let t = text.replace(NOISE, "").replace(HARAKAT, "");
  for (const [re, to] of FOLD) t = t.replace(re, to);
  return t.replace(/\s+/g, " ").trim();
}

function loadIndex(): Promise<PreparedRow[]> {
  return (indexCache ??= fetch("/quran-search-index.json")
    .then((res) => {
      if (!res.ok) throw new Error(`quran-search: HTTP ${res.status}`);
      return res.json() as Promise<SearchRow[]>;
    })
    .then((rows) =>
      rows.map((row) => {
        const text = searchArabic(row.t);
        return { row, text, tokens: new Set(text.split(" ")) };
      }),
    )
    .catch((err) => {
      indexCache = null;
      throw err;
    }));
}

/** Rank the top `k` ayahs for a query. Async only because the index may still
 * be loading; the client component debounces keystrokes and awaits this. */
export async function searchAyahs(query: string, k = 8): Promise<SearchHit[]> {
  const normalized = searchArabic(query);
  if (!normalized) return [];

  const queryTokens = normalized.split(" ");
  const total = queryTokens.length;

  const hits: SearchHit[] = [];
  for (const { row, text, tokens } of await loadIndex()) {
    let matched = 0;
    for (const token of queryTokens) {
      if (tokens.has(token)) matched += 1;
    }
    if (!matched) continue;

    let confidence = matched / total;
    if (text.includes(normalized)) confidence = Math.min(1, confidence + PHRASE_BONUS);
    const surah = surahByNumber(row.s);
    if (!surah) throw new Error(`quran-search: no surah ${row.s}`);
    hits.push({ row, confidence, surah });
  }

  hits.sort((a, b) => b.confidence - a.confidence || a.row.n - b.row.n);
  return hits.slice(0, k);
}
