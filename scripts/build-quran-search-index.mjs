/**
 * Generates public/quran-search-index.json — every ayah as one compact row
 * for the Ayah Finder to search over.
 *
 *   { n, s, a, t }  n = global ayah number (1–6236), s = surah,
 *                    a = ayah-in-surah, t = uthmani text
 *
 * The text is kept raw — BOM, tatweel and harakat stay in the file and are
 * stripped at search time (lib/quran-search.ts), so this index is a faithful
 * copy of the source and regenerating it never changes how text is matched.
 *
 * Reads the cached edition that scripts/fetch-quran.mjs downloads into
 * .quran-cache/ (predev and prebuild run fetch first, so it is always
 * present by the time this runs). Fails loudly on any count other than
 * 6,236: an index that silently dropped a verse would orphan that ayah from
 * search.
 *
 *   node scripts/build-quran-search-index.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CACHE = join(process.cwd(), ".quran-cache", "quran-uthmani.json");
const OUT = join(process.cwd(), "public", "quran-search-index.json");
const TOTAL_AYAHS = 6236;

const { data } = JSON.parse(await readFile(CACHE, "utf8"));

const rows = [];
let expected = 1;
for (const surah of data.surahs) {
  for (const ayah of surah.ayahs) {
    if (ayah.number !== expected) {
      throw new Error(
        `quran-search: numbering gap at surah ${surah.number} ayah ${ayah.numberInSurah} — number ${ayah.number}, expected ${expected}`,
      );
    }
    rows.push({ n: ayah.number, s: surah.number, a: ayah.numberInSurah, t: ayah.text });
    expected += 1;
  }
}

if (rows.length !== TOTAL_AYAHS) {
  throw new Error(`quran-search: expected ${TOTAL_AYAHS} ayahs, got ${rows.length}`);
}

await writeFile(OUT, JSON.stringify(rows));
console.log(`quran-search: wrote ${rows.length} ayahs to ${OUT}`);
