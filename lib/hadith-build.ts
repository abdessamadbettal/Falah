/** Reads the hadith cache that `npm run prebuild` writes.
 *
 * The site is a static export, so every collection, chapter and hadith route
 * is rendered to HTML during `next build`. scripts/fetch-hadith.mjs has
 * already split the ten collections into one file per chapter, which is what
 * makes that affordable: a route parses its own 20 KB–600 KB chapter instead
 * of an 11 MB collection, and the ~11 build workers stay small.
 *
 * Server-only — it touches node:fs. Anything the reader needs in the browser
 * lives in lib/hadith-view.ts instead. */

import { readFile } from "node:fs/promises";
import { join } from "node:path";

const CACHE_DIR = join(process.cwd(), ".hadith-cache");

export type Grade = { grader: string; grade: string };

export type Hadith = {
  /** Number within the collection — what a citation means by "Bukhari 6018".
   * Not always an integer: a few are split as 402.2. */
  n: number;
  /** Number in the Arabic printed edition, which often differs from the one
   * English translations cite. */
  arabicNumber: number;
  arabic: string;
  /** Empty when the collection has no English translation for this hadith. */
  translation: string;
  /** Only the sunan are graded, and only in the English edition. */
  grades: Grade[];
};

export type ChapterEntry = {
  n: number;
  count: number;
  /** Hadith number this chapter opens and closes on — shown as a range, and
   * the reason a chapter index is useful without opening a chapter. */
  first: number;
  last: number;
  graded: boolean;
};

export type CollectionIndex = {
  key: string;
  total: number;
  chapters: ChapterEntry[];
};

const MISSING = (what: string) =>
  new Error(
    `Hadith build data: ${what} is not in .hadith-cache/. The /hadith routes are ` +
      `prerendered, so the build needs the cache populated — run ` +
      `"node scripts/fetch-hadith.mjs" (npm does this for you as prebuild).`,
  );

async function readJson<T>(...segments: string[]): Promise<T | null> {
  try {
    return JSON.parse(await readFile(join(CACHE_DIR, ...segments), "utf8")) as T;
  } catch {
    return null;
  }
}

/** Memoized per key: `generateMetadata` and the page body both want the same
 * file, and a chapter index is read once per chapter route. */
const indexes = new Map<string, Promise<CollectionIndex>>();

export function collectionIndex(key: string): Promise<CollectionIndex> {
  const hit = indexes.get(key);
  if (hit) return hit;
  const pending = readJson<CollectionIndex>(key, "index.json").then((json) => {
    if (!json) throw MISSING(`collection "${key}"`);
    return json;
  });
  indexes.set(key, pending);
  return pending;
}

type CachedChapter = {
  n: number;
  hadiths: { n: number; an: number; ar: string; en: string; g?: [string, string][] }[];
};

const chapters = new Map<string, Promise<Hadith[]>>();

/** Every hadith of one kitab, in collection order. */
export function chapterHadiths(key: string, chapter: number): Promise<Hadith[]> {
  const id = `${key}/${chapter}`;
  const hit = chapters.get(id);
  if (hit) return hit;
  const pending = readJson<CachedChapter>(key, `${chapter}.json`).then((json) => {
    if (!json) throw MISSING(`chapter ${chapter} of "${key}"`);
    return json.hadiths.map((h) => ({
      n: h.n,
      arabicNumber: h.an,
      arabic: h.ar,
      translation: h.en,
      grades: (h.g ?? []).map(([grader, grade]) => ({ grader, grade })),
    }));
  });
  chapters.set(id, pending);
  return pending;
}

/** How many hadiths each collection actually holds. The counts are read from
 * the cache rather than hardcoded, so they can never claim more than the site
 * really publishes — upstream is missing the Arabic text for ~1% of hadiths,
 * and those are not cached at all. */
export type Roster = { key: string; total: number; chapters: number }[];

let roster: Promise<Roster> | null = null;

export function hadithRoster(): Promise<Roster> {
  roster ??= readJson<{ collections: Roster }>("index.json").then((json) => {
    if (!json) throw MISSING("the collection roster");
    return json.collections;
  });
  return roster;
}

/** Total across every collection — the headline figure on the hub. */
export async function hadithTotal(): Promise<number> {
  return (await hadithRoster()).reduce((n, c) => n + c.total, 0);
}
