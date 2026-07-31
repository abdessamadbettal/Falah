/** The whole Quran, loaded once at build time.
 *
 * The site is a static export, so every surah / juz / hizb / page route is
 * rendered to HTML during `next build`. Fetching per route would mean ~1,600
 * API calls; instead the complete text comes down in one request per edition
 * and every route slices the same in-memory copy. */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cleanAyah } from "./arabic";
import { getDict, type Locale } from "./i18n";
import { TOTAL_AYAHS } from "./quran-meta";

const API = "https://api.alquran.cloud/v1";
const ARABIC_EDITION = "quran-uthmani";
/** Filled by `npm run prebuild` (scripts/fetch-quran.mjs). */
const CACHE_DIR = join(process.cwd(), ".quran-cache");

export type BuiltAyah = {
  /** Global ayah number, 1–6236 — also the recitation file name. */
  n: number;
  /** Surah number, 1–114. */
  surah: number;
  /** Ayah number within its surah. */
  ayah: number;
  page: number;
  juz: number;
  /** Hizb, 1–60 (the API reports quarters, 1–240). */
  hizb: number;
  arabic: string;
  translation: string;
};

export type QuranText = {
  ayahs: BuiltAyah[];
  /** Which translation edition the `translation` field holds. */
  edition: string;
  bySurah: Map<number, BuiltAyah[]>;
  byJuz: Map<number, BuiltAyah[]>;
  byHizb: Map<number, BuiltAyah[]>;
  byPage: Map<number, BuiltAyah[]>;
};

type ApiAyah = {
  number: number;
  numberInSurah: number;
  text: string;
  page: number;
  juz: number;
  hizbQuarter: number;
};
type ApiQuran = { data: { surahs: { number: number; ayahs: ApiAyah[] }[] } };

function flatten(json: ApiQuran): ApiAyah[] {
  return json.data.surahs.flatMap((s) =>
    s.ayahs.map((a) => ({ ...a, surahNumber: s.number })),
  ) as ApiAyah[];
}

/** Prefer the on-disk cache: `next build` runs ~11 worker processes, and
 * having each of them pull 14 MB over the network is both slow and enough
 * concurrent load to get the build refused. The network path stays as a
 * fallback so a bare `next build` still works. */
async function loadEdition(edition: string): Promise<ApiAyah[] | null> {
  try {
    const raw = await readFile(join(CACHE_DIR, `${edition}.json`), "utf8");
    return flatten(JSON.parse(raw) as ApiQuran);
  } catch {
    // not cached — fall through to the API
  }
  try {
    const res = await fetch(`${API}/quran/${edition}`, { cache: "force-cache" });
    if (!res.ok) return null;
    return flatten((await res.json()) as ApiQuran);
  } catch {
    return null;
  }
}

function group<K>(ayahs: BuiltAyah[], key: (a: BuiltAyah) => K): Map<K, BuiltAyah[]> {
  const map = new Map<K, BuiltAyah[]>();
  for (const a of ayahs) {
    const k = key(a);
    const bucket = map.get(k);
    if (bucket) bucket.push(a);
    else map.set(k, [a]);
  }
  return map;
}

const cache = new Map<Locale, Promise<QuranText>>();

async function build(locale: Locale): Promise<QuranText> {
  const edition = getDict(locale).tools.quran.translationEdition;
  const [arabic, translated] = await Promise.all([
    loadEdition(ARABIC_EDITION),
    loadEdition(edition),
  ]);

  // The Arabic text is the page. Without it there is nothing worth publishing,
  // and shipping ~1,600 empty pages would be far worse than a failed build.
  if (!arabic || arabic.length !== TOTAL_AYAHS) {
    throw new Error(
      `Quran build data: could not load "${ARABIC_EDITION}". The Quran routes are ` +
        `prerendered, so the build needs .quran-cache/ populated — run ` +
        `"node scripts/fetch-quran.mjs" (npm does this for you as prebuild).`,
    );
  }
  // A missing translation is survivable — the Arabic still stands on its own.
  const trans = translated?.length === TOTAL_AYAHS ? translated : null;

  const ayahs: BuiltAyah[] = arabic.map((a, i) => ({
    n: a.number,
    surah: (a as ApiAyah & { surahNumber: number }).surahNumber,
    ayah: a.numberInSurah,
    page: a.page,
    juz: a.juz,
    hizb: Math.floor((a.hizbQuarter - 1) / 4) + 1,
    arabic: cleanAyah(a.text),
    translation: cleanAyah(trans?.[i]?.text ?? ""),
  }));

  return {
    ayahs,
    edition,
    bySurah: group(ayahs, (a) => a.surah),
    byJuz: group(ayahs, (a) => a.juz),
    byHizb: group(ayahs, (a) => a.hizb),
    byPage: group(ayahs, (a) => a.page),
  };
}

/** Memoized per locale — one network round trip per edition, per build. */
export function quranText(locale: Locale): Promise<QuranText> {
  const hit = cache.get(locale);
  if (hit) return hit;
  const pending = build(locale);
  cache.set(locale, pending);
  return pending;
}

