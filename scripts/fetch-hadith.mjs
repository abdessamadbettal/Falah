/**
 * Downloads the hadith collections the prerendered /hadith routes are built
 * from, and splits them into one file per chapter.
 *
 * Runs as `prebuild`, alongside fetch-quran.mjs. Two things make the split
 * worth doing rather than caching the editions whole:
 *
 *   - Size. The ten collections are ~110 MB of JSON across both languages.
 *     `next build` fans out over ~11 worker processes, and if each one had to
 *     parse a whole collection to render a single chapter the build would need
 *     gigabytes of memory. A chapter file is 20 KB–600 KB.
 *   - Requests. Fetching per route instead would be ~400 requests per locale.
 *     This is two per collection, once, and then never again.
 *
 * Each collection produces:
 *   .hadith-cache/<key>/index.json   chapter roster + counts
 *   .hadith-cache/<key>/<n>.json     the hadiths of chapter n, both languages
 *   .hadith-cache/index.json         the roster of collections
 *
 * Cached collections are skipped, so repeat builds do no network I/O at all.
 * Delete .hadith-cache/ to force a refresh.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const API = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
const DIR = join(process.cwd(), ".hadith-cache");

/** Must stay in step with COLLECTIONS in lib/hadith-meta.ts — the integrity
 * check at the end of each collection fails loudly if it drifts. */
const KEYS = [
  "bukhari",
  "muslim",
  "abudawud",
  "tirmidhi",
  "nasai",
  "ibnmajah",
  "malik",
  "nawawi",
  "qudsi",
  "dehlawi",
];

async function fetchEdition(name) {
  const res = await fetch(`${API}/${name}.min.json`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json?.hadiths) || json.hadiths.length === 0) {
    throw new Error(`${name}: no hadiths in payload`);
  }
  return json;
}

/** The chapter numbers lib/hadith-chapters.ts was generated with. The cache
 * and that file are produced by different scripts from the same upstream, and
 * a chapter present in one but not the other would render either a titleless
 * page or a 404 — so they are compared rather than trusted. */
async function committedChapters() {
  const src = await readFile(join(process.cwd(), "lib", "hadith-chapters.ts"), "utf8");
  const out = {};
  for (const [, key, body] of src.matchAll(/^ {2}(\w+): \[$([\s\S]*?)^ {2}\],$/gm)) {
    out[key] = [...body.matchAll(/^\s*\[(\d+),/gm)].map((m) => Number(m[1]));
  }
  return out;
}

/**
 * Which chapter a hadith belongs to.
 *
 * `reference.book` is per-hadith and authoritative, but it is 0 for some
 * hadiths (311 in Bukhari, 82 in Nasa'i, 18 in Muwatta Malik) which would
 * otherwise be dropped. Those fall back to the sequential reading of the
 * section boundaries: a hadith belongs to the last chapter that starts at or
 * before its number, which is simply how the printed books run. On the three
 * collections that actually need the fallback it was verified to agree with
 * `reference.book` on 100% of the hadiths that do carry one.
 */
function chapterAssigner(edition, titled) {
  const details = edition.metadata.section_details ?? {};
  const cuts = titled
    .map((n) => ({ n, start: details[String(n)]?.hadithnumber_first }))
    .filter((c) => typeof c.start === "number")
    .sort((a, b) => a.start - b.start);
  const known = new Set(titled);

  return (hadith) => {
    const ref = hadith.reference?.book;
    if (typeof ref === "number" && known.has(ref)) return ref;
    let fallback = cuts[0]?.n ?? titled[0];
    for (const c of cuts) {
      if (hadith.hadithnumber >= c.start) fallback = c.n;
      else break;
    }
    return fallback;
  };
}

/** Grades come only from the English edition and only for the sunan — tuples
 * keep the cache small: [grader, grade]. */
const grades = (h) =>
  (h.grades ?? [])
    .filter((g) => g?.grade)
    .map((g) => [g.name ?? "", String(g.grade).trim()]);

async function buildCollection(key) {
  const dir = join(DIR, key);
  try {
    const existing = JSON.parse(await readFile(join(dir, "index.json"), "utf8"));
    console.log(`hadith: ${key} already cached (${existing.total} hadiths)`);
    return existing;
  } catch {
    // not cached — build it
  }

  process.stdout.write(`hadith: fetching ${key}… `);
  const [arabic, english] = await Promise.all([
    fetchEdition(`ara-${key}`),
    fetchEdition(`eng-${key}`),
  ]);

  // The Arabic is the hadith; the English is a translation of it. A missing
  // translation is survivable, a missing Arabic text is not.
  const arabicByNumber = new Map(arabic.hadiths.map((h) => [h.hadithnumber, h.text]));

  const titled = Object.entries(english.metadata.sections)
    .filter(([, title]) => title)
    .map(([n]) => Number(n))
    .sort((a, b) => a - b);

  const chapterOf = chapterAssigner(english, titled);

  const buckets = new Map(titled.map((n) => [n, []]));
  let untranslated = 0;
  for (const h of english.hadiths) {
    const ar = arabicByNumber.get(h.hadithnumber);
    if (!ar) continue;
    const en = (h.text ?? "").trim();
    if (!en) untranslated++;
    buckets.get(chapterOf(h))?.push({
      n: h.hadithnumber,
      an: h.arabicnumber ?? h.hadithnumber,
      ar,
      en,
      ...(grades(h).length ? { g: grades(h) } : {}),
    });
  }

  await mkdir(dir, { recursive: true });
  const chapters = [];
  let total = 0;
  for (const n of titled) {
    const hadiths = (buckets.get(n) ?? []).sort((a, b) => a.n - b.n);
    if (hadiths.length === 0) continue;
    await writeFile(join(dir, `${n}.json`), JSON.stringify({ n, hadiths }));
    chapters.push({
      n,
      count: hadiths.length,
      first: hadiths[0].n,
      last: hadiths.at(-1).n,
      // Cheap signal for the collection index, which shows a grade badge
      // without opening the chapter itself.
      graded: hadiths.some((h) => h.g),
    });
    total += hadiths.length;
  }

  const index = { key, name: english.metadata.name, total, chapters };
  await writeFile(join(dir, "index.json"), JSON.stringify(index));

  const dropped = english.hadiths.length - total;
  console.log(
    `${total} hadiths in ${chapters.length} chapters` +
      (untranslated ? `, ${untranslated} untranslated` : "") +
      (dropped ? `, ${dropped} without Arabic text` : ""),
  );

  return index;
}

await mkdir(DIR, { recursive: true });

const committed = await committedChapters();
const roster = [];

for (const key of KEYS) {
  const index = await buildCollection(key);

  // Integrity: every chapter the site will link to must exist in the cache,
  // and every cached chapter must have a title to render.
  const cached = new Set(index.chapters.map((c) => c.n));
  const declared = committed[key];
  if (!declared) {
    throw new Error(
      `hadith: ${key} has no chapters in lib/hadith-chapters.ts — ` +
        `run "node scripts/build-hadith-chapters.mjs"`,
    );
  }
  const titleless = index.chapters.filter((c) => !declared.includes(c.n)).map((c) => c.n);
  if (titleless.length) {
    throw new Error(`hadith: ${key} cached chapters ${titleless} have no committed title`);
  }
  const empty = declared.filter((n) => !cached.has(n));
  if (empty.length) {
    console.warn(`hadith: ${key} chapters ${empty} are titled but hold no hadiths — skipped`);
  }

  roster.push({ key, total: index.total, chapters: index.chapters.length });
}

await writeFile(join(DIR, "index.json"), JSON.stringify({ collections: roster }));

const grand = roster.reduce((n, c) => n + c.total, 0);
console.log(`hadith: ${grand} hadiths across ${roster.length} collections ready`);
