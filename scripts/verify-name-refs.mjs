/**
 * Proves that every Quran reference on the 99 Names pages is real.
 *
 * lib/name-refs.json is curated by hand, because deciding whether ٱلْمَلِكُ
 * means Allah or the king of Egypt is a judgement no regex makes. What a
 * script *can* do is refuse to let a citation ship unless the verse actually
 * contains the name — so curation supplies the meaning and this supplies the
 * proof.
 *
 * Runs as part of `prebuild`, after the Quran is fetched. A wrong citation
 * fails the build rather than reaching a reader, which is the right trade for
 * scripture: the pages either cite correctly or they do not go out.
 *
 * An empty list is a legitimate answer, not a gap. Twenty-odd of the famous
 * ninety-nine — As-Sabur, Al-Muqaddim, Al-Mughni — reach the list through
 * at-Tirmidhi's narration rather than through the Quran, and the pages say so
 * plainly instead of quietly attaching a verse that does not contain them.
 *
 *   node scripts/verify-name-refs.mjs
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadNames, loadVerses, verseHasName } from "./lib-name-match.mjs";

const REFS = join(process.cwd(), "lib", "name-refs.json");

const refs = JSON.parse(await readFile(REFS, "utf8"));
const names = await loadNames();
const verses = await loadVerses();

const at = new Map(verses.map((v) => [`${v.surah}:${v.ayah}`, v]));
const problems = [];
let cited = 0;
let attested = 0;

for (const name of names) {
  const list = refs[name.slug];
  if (!list) {
    problems.push(`${name.slug}: missing from lib/name-refs.json`);
    continue;
  }
  if (list.length) attested++;

  for (const [surah, ayah] of list) {
    const verse = at.get(`${surah}:${ayah}`);
    if (!verse) {
      problems.push(`${name.slug}: ${surah}:${ayah} is not a verse`);
      continue;
    }
    if (!verseHasName(verse, name.arabic)) {
      problems.push(
        `${name.slug} (${name.translit}): ${surah}:${ayah} does not contain ${name.arabic}\n` +
          `    ${verse.text}`,
      );
      continue;
    }
    cited++;
  }
}

const extra = Object.keys(refs).filter((slug) => !names.some((n) => n.slug === slug));
for (const slug of extra) problems.push(`${slug}: in name-refs.json but not in lib/names.ts`);

if (problems.length) {
  console.error(`name-refs: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error("  ✗", p);
  process.exit(1);
}

console.log(
  `name-refs: ${cited} citations verified across ${attested}/99 names ` +
    `(${99 - attested} attested by the Sunnah rather than the Quran)`,
);
