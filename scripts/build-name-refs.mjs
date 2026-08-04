/**
 * Regenerates lib/name-refs.json — where each of the 99 names actually
 * occurs in the Quran.
 *
 * This is NOT part of the build, and it is not prose: it is derived by
 * searching the Uthmani text the site already ships. That distinction is the
 * whole point. A page that claims "Al-Fattah appears in 34:26" should be able
 * to prove it, and a reference nobody computed is a reference nobody checked.
 *
 * Two details decide whether the output is trustworthy:
 *
 *   The basmala. Outside Al-Fatiha this edition prefixes it to each surah's
 *   first verse, so a naive search reports Ar-Rahman and Ar-Rahim in 112 of
 *   the 114 opening verses. It is stripped first.
 *
 *   The dagger alef. The mushaf writes السلام as ٱلسَّلَٰمُ, with a superscript
 *   alef that vanishes when harakat are stripped. Matching therefore treats
 *   a written alef as optional.
 *
 * Names with zero occurrences are expected and are kept: As-Sabur and
 * Al-Muqaddim reach the famous list through at-Tirmidhi's narration, not
 * through the Quran, and the pages say so rather than hiding it.
 *
 *   node scripts/build-name-refs.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CACHE = join(process.cwd(), ".quran-cache", "quran-uthmani.json");
const OUT = join(process.cwd(), "lib", "name-refs.json");

/** How many occurrences a page shows. Beyond about half a dozen the list
 * stops being evidence and starts being a concordance. */
const SHOWN = 6;

// ------------------------------------------------------------- normalizing

// Spelled out in escapes, not glyphs: written as a literal range the class
// swallows the Arabic letters too. Same trap lib/arabic.ts documents.
const HARAKAT = /[ؐ-ًؚ-ٰٟۖ-ۭ࣓-ࣿ]/g;
const NOISE = /[﻿ـ]/g;

/** Undecorated Arabic with the alef and ya variants folded together. */
function normalize(text) {
  return text
    .replace(NOISE, "")
    .replace(HARAKAT, "")
    .replace(/[آأإٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

/** The basmala is four words; Al-Fatiha counts it as its own verse. */
function stripBasmala(text, surah, ayah) {
  if (ayah !== 1 || surah === 1) return text;
  const words = text.replace(NOISE, "").trim().split(/\s+/);
  return normalize(words[0] ?? "") === "بسم" ? words.slice(4).join(" ") : text;
}

/** Particles that attach to the front of a word and are not part of it.
 * Order matters: the article goes last, so وبالحق reduces to حق. */
function stripPrefixes(word) {
  let w = word;
  for (const p of ["و", "ف", "ب", "ك", "ل"]) {
    if (w.startsWith(p) && w.length > p.length + 2) w = w.slice(p.length);
  }
  if (w.startsWith("ال") && w.length > 4) w = w.slice(2);
  return w;
}

/** A matcher for one name's core word, with every written alef optional so
 * the dagger-alef spellings in the mushaf still match. */
function matcher(core) {
  const pattern = core
    .split("")
    .map((c) => (c === "ا" ? "ا?" : c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
    .join("");
  return new RegExp(`^${pattern}$`);
}

// ------------------------------------------------------------------ build

const raw = await readFile(CACHE, "utf8").catch(() => {
  throw new Error("Run `node scripts/fetch-quran.mjs` first — this reads .quran-cache/.");
});
const quran = JSON.parse(raw);

const verses = quran.data.surahs.flatMap((s) =>
  s.ayahs.map((a) => {
    const text = stripBasmala(a.text, s.number, a.numberInSurah);
    return {
      surah: s.number,
      ayah: a.numberInSurah,
      normalized: normalize(text),
      words: normalize(text).split(" ").map(stripPrefixes),
    };
  }),
);

const src = await readFile(join(process.cwd(), "lib", "names.ts"), "utf8");
const entries = [...src.matchAll(/arabic: "([^"]+)", transliteration: "([^"]+)", slug: "([^"]+)"/g)];
if (entries.length !== 99) {
  throw new Error(`expected 99 names in lib/names.ts, matched ${entries.length}`);
}

const out = {};
let attested = 0;

for (const [, arabic, translit, slug] of entries) {
  const full = normalize(arabic);
  const words = full.split(" ");
  let hits;

  if (words.length > 1) {
    // "مالك الملك", "ذو الجلال والإكرام" — a phrase only means the name when
    // it appears whole, so no prefix stripping and no word-level matching.
    const phrase = matcherPhrase(full);
    hits = verses.filter((v) => phrase.test(v.normalized));
  } else {
    const core = stripPrefixes(full);
    const test = matcher(core);
    // Word-level, so الرحمن matches رحمن and بالرحمن but never رحمة.
    hits = verses.filter((v) => v.words.some((w) => test.test(w)));
  }

  if (hits.length) attested++;
  out[slug] = {
    translit,
    total: hits.length,
    refs: hits.slice(0, SHOWN).map((h) => [h.surah, h.ayah]),
  };
}

function matcherPhrase(full) {
  const pattern = full
    .split("")
    .map((c) =>
      c === "ا" ? "ا?" : c === " " ? "\\s+" : c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    )
    .join("");
  return new RegExp(pattern);
}

// Sorted by slug so re-running produces a byte-identical file and the diff
// only ever shows references that genuinely moved.
const sorted = Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]));
await writeFile(OUT, `${JSON.stringify(sorted, null, 0)}\n`);

console.log(
  `name-refs: ${attested}/99 names attested in the Quran, ` +
    `${Object.values(out).reduce((n, v) => n + v.total, 0)} occurrences → lib/name-refs.json`,
);
console.log(
  "  not attested verbatim:",
  Object.entries(out).filter(([, v]) => v.total === 0).map(([k]) => k).join(", ") || "none",
);
