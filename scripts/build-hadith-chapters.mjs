/**
 * Regenerates lib/hadith-chapters.ts — the Arabic and English titles of every
 * kitab in every collection Falah publishes.
 *
 * This is NOT part of the build. Chapter titles are structural data: "كتاب
 * الإيمان" has been the second book of Sahih al-Bukhari for eleven centuries
 * and is not going to change, so the titles are committed to the repo for the
 * same reason lib/quran-meta.ts is — routes, headings and <title> tags must
 * not depend on a third-party CDN being reachable, and a build must never be
 * able to silently renumber a chapter.
 *
 * Two sources are cross-checked:
 *   fawazahmed0/hadith-api  — the texts (and English section names)
 *   AhmedBaset/hadith-json  — the same chapters, with Arabic titles
 * The script fails loudly if their chapter numbering disagrees, because a
 * silent mismatch would attach the wrong Arabic name to a chapter of hadith.
 *
 *   node scripts/build-hadith-chapters.mjs
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const FAWAZ = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
const BASET = "https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@main/db/by_book";
/** Downloads land here so re-runs are free. Git-ignored. */
const TMP = join(process.cwd(), ".hadith-cache", "_titles");

/** key = the id used in URLs and in .hadith-cache; baset = the file that
 * carries the Arabic titles. The three "forty" collections are a single
 * chapter each, so their title is written by hand rather than scraped. */
const SOURCES = [
  { key: "bukhari", baset: "the_9_books/bukhari.json" },
  { key: "muslim", baset: "the_9_books/muslim.json" },
  { key: "abudawud", baset: "the_9_books/abudawud.json" },
  { key: "tirmidhi", baset: "the_9_books/tirmidhi.json" },
  { key: "nasai", baset: "the_9_books/nasai.json" },
  { key: "ibnmajah", baset: "the_9_books/ibnmajah.json" },
  { key: "malik", baset: "the_9_books/malik.json" },
  { key: "nawawi", single: { ar: "الأربعون النووية", en: "The Forty Hadith" } },
  { key: "qudsi", single: { ar: "الأربعون القدسية", en: "The Forty Hadith Qudsi" } },
  { key: "dehlawi", single: { ar: "الأربعون للشاه ولي الله الدهلوي", en: "The Forty Hadith" } },
];

async function cached(name, url) {
  const file = join(TMP, name);
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    process.stdout.write(`  fetching ${name}… `);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    const text = await res.text();
    await writeFile(file, text);
    console.log("ok");
    return JSON.parse(text);
  }
}

/** Chapters the Arabic dataset has no counterpart for. Both are section 0 —
 * a real, titled opening book that AhmedBaset's chapter list starts after:
 * Sahih Muslim's muqaddimah (92 hadiths) and Ibn Majah's opening book on the
 * Sunnah (266). Skipping them would drop 358 hadiths off the site entirely. */
const MISSING_ARABIC = {
  muslim: { 0: "المقدمة" },
  ibnmajah: { 0: "كتاب السنة" },
};

/** fawazahmed0 names the field `sections` in a whole edition and `section` in
 * a single-section slice. Only the former is used here. Section 0 is usually
 * an empty-titled placeholder, but in two collections it is a genuine book —
 * so include it whenever it actually carries a title. */
function fawazSections(edition) {
  return Object.entries(edition.metadata.sections)
    .filter(([, title]) => title)
    .map(([n, title]) => ({ n: Number(n), en: title }))
    .sort((a, b) => a.n - b.n);
}

const escape = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

/**
 * The URL segment for a kitab: "Ablutions (Wudu')" -> "ablutions-wudu".
 *
 * Derived from the English title even for the Arabic pages, because a locale
 * switch only swaps the /en /ar prefix and keeps the rest of the path — one
 * slug has to serve both. Latin slugs are also what people paste and link.
 *
 * A leading "The " is dropped ("The Book of Purification" ->
 * "book-of-purification"): it carries no query intent and costs six
 * characters in every one of these URLs.
 */
function slugify(title) {
  return title
    .normalize("NFKD")
    // Spelled as escapes, not literal glyphs — see the note in lib/arabic.ts
    .replace(/[\u0300-\u036f]/g, "")
    // Wudu' -> wudu, rather than wudu- with a dangling separator
    .replace(/['’`]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^the-/, "");
}

/** Long titles are cut on a word boundary — "The Book of Fighting [The
 * Prohibition of Bloodshed]" is a URL nobody should have to read in full. */
function cap(slug, max = 60) {
  if (slug.length <= max) return slug;
  const cut = slug.lastIndexOf("-", max);
  return slug.slice(0, cut > 20 ? cut : max).replace(/-+$/, "");
}
/** The two datasets differ in incidental whitespace ("The Book of Prayers "
 * vs "The Book of Prayers"). Compare on the words alone so only a real
 * disagreement about *which* chapter this is trips the guard. */
const squash = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();

await mkdir(TMP, { recursive: true });

const blocks = [];
for (const src of SOURCES) {
  console.log(src.key);
  const edition = await cached(`eng-${src.key}.json`, `${FAWAZ}/eng-${src.key}.min.json`);
  const sections = fawazSections(edition);

  let rows;
  if (src.single) {
    if (sections.length !== 1) {
      throw new Error(`${src.key}: expected one section, found ${sections.length}`);
    }
    rows = [{ n: sections[0].n, ar: src.single.ar, en: src.single.en }];
  } else {
    const baset = await cached(`baset-${src.key}.json`, `${BASET}/${src.baset}`);

    // Pair on the English title, not on the chapter id. The two datasets
    // agree on *which* books a collection contains but not always on how they
    // are numbered — Baset's Nasa'i carries an extra "Book of Oaths and Vows"
    // at 35 and pushes everything after it along by one. fawazahmed0's
    // numbering is the one our texts and URLs use, so it wins; Baset is
    // consulted only for the Arabic name of a chapter we already identified.
    const arabicByTitle = new Map();
    for (const c of baset.chapters) {
      const key = squash(c.english);
      const arabic = c.arabic.replace(/\s+/g, " ").trim();
      const seen = arabicByTitle.get(key);
      if (seen && seen !== arabic) {
        throw new Error(`${src.key}: "${c.english}" maps to both "${seen}" and "${arabic}"`);
      }
      arabicByTitle.set(key, arabic);
    }

    const overrides = MISSING_ARABIC[src.key] ?? {};
    rows = sections.map(({ n, en }) => {
      const arabic = overrides[n] ?? arabicByTitle.get(squash(en));
      // No Arabic title, and not one of the two we supply by hand, means this
      // chapter has no counterpart in the other dataset at all — a real gap,
      // not a numbering quirk. Refuse rather than publish a chapter of hadith
      // under a guessed name.
      if (!arabic) throw new Error(`${src.key}: chapter ${n} ("${en}") has no Arabic title`);
      return { n, ar: arabic, en: en.replace(/\s+/g, " ").trim() };
    });
  }

  // Slugs are the URLs, so a collision would mean two books of hadith
  // fighting over one page. Two chapters that reduce to the same slug get the
  // chapter number appended — deterministic, so the URL is stable across
  // regenerations rather than depending on iteration order.
  const seen = new Map();
  for (const r of rows) {
    const base = cap(slugify(r.en)) || `book-${r.n}`;
    const taken = seen.get(base);
    r.slug = taken === undefined ? base : `${base}-${r.n}`;
    if (taken === undefined) seen.set(base, r.n);
    else console.log(`  ! "${r.en}" collides with chapter ${taken} — slug "${r.slug}"`);
  }
  const dupes = new Set();
  for (const r of rows) {
    if (dupes.has(r.slug)) throw new Error(`${src.key}: duplicate slug "${r.slug}"`);
    dupes.add(r.slug);
  }

  console.log(`  ${rows.length} chapters verified`);
  const lines = rows.map(
    (r) => `  [${r.n}, "${escape(r.ar)}", "${escape(r.en)}", "${r.slug}"],`,
  );
  blocks.push(`  ${src.key}: [\n${lines.map((l) => `  ${l}`).join("\n")}\n  ],`);
}

const out = `/** Chapter (kitab) titles for every hadith collection Falah publishes.
 *
 * GENERATED — do not edit by hand. Run \`node scripts/build-hadith-chapters.mjs\`
 * to rebuild, which re-verifies the numbering against both upstream datasets.
 *
 * Committed rather than fetched for the same reason lib/quran-meta.ts is:
 * chapter slugs are the URLs (/hadith/sahih-bukhari/book-of-belief), and they
 * must not be able to shift because a CDN changed. Tuples keep it small.
 */

export type ChapterTitle = readonly [
  n: number,
  arabic: string,
  english: string,
  /** The URL segment: /hadith/sahih-bukhari/book-of-belief. Shared by both
   * locales, because switching language only swaps the /en /ar prefix. */
  slug: string,
];

export const CHAPTER_TITLES: Record<string, readonly ChapterTitle[]> = {
${blocks.join("\n")}
};
`;

await writeFile(join(process.cwd(), "lib", "hadith-chapters.ts"), out);
console.log(`\nwrote lib/hadith-chapters.ts`);
