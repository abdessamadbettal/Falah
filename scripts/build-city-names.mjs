/**
 * Regenerates lib/city-names.json — the Arabic and French name of every city
 * that has its own /prayer-times page.
 *
 * This is NOT part of the build. The names come from GeoNames'
 * alternateNamesV2 dump, which is 200 MB compressed and 1.2 GB expanded; the
 * ~7,650 names Falah actually needs are 200 KB, so they are committed to the
 * repo for the same reason lib/hadith-chapters.ts is — a deploy must not
 * depend on a 200 MB download, and it must not be possible for a flaky
 * network to quietly ship an Arabic page titled "Casablanca".
 *
 * The small cities15000 dump that every build does read carries alternate
 * names too, but untagged: Casablanca's are ["أنفا", "الدار البيضاء",
 * "كازابلانكا"] with nothing to say which is the name and which is a
 * neighbourhood or a transliteration. alternateNamesV2 has the language tag
 * and the isPreferredName flag, which is the whole reason for the 200 MB.
 *
 * Run scripts/fetch-cities.mjs first — this reads its city selection.
 *
 *   node scripts/build-city-names.mjs
 */

import { createReadStream } from "node:fs";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import { join } from "node:path";
import { createInflateRaw } from "node:zlib";

const URL_V2 = "https://download.geonames.org/export/dump/alternateNamesV2.zip";
const DIR = join(process.cwd(), ".cities-cache");
const ARCHIVE = join(DIR, "alternateNamesV2.zip");
const MEMBER = "alternateNamesV2.txt";
const OUT = join(process.cwd(), "lib", "city-names.json");

const LANGUAGES = ["ar", "fr"];

const COLUMNS = {
  geonameId: 1, language: 2, name: 3,
  preferred: 4, short: 5, colloquial: 6, historic: 7,
};

// ------------------------------------------------------------------ inputs

const places = JSON.parse(
  await readFile(join(DIR, "places.json"), "utf8").catch(() => {
    throw new Error("Run `node scripts/fetch-cities.mjs` first — this needs its city list.");
  }),
);

/** geonameId → the Latin name the page already shows. A localized name equal
 * to it is not worth 40 bytes in every build's bundle. */
const wanted = new Map(places.cities.map((c) => [c.id, c.name]));
console.log(`names: looking for ${LANGUAGES.join("/")} names of ${wanted.size} cities`);

await mkdir(DIR, { recursive: true });
if (!(await stat(ARCHIVE).catch(() => null))) {
  process.stdout.write(`names: downloading ${MEMBER} (200 MB, cached afterwards)… `);
  const res = await fetch(URL_V2);
  if (!res.ok) throw new Error(`alternateNamesV2: HTTP ${res.status}`);
  await writeFile(ARCHIVE, Buffer.from(await res.arrayBuffer()));
  console.log("ok");
}

// ------------------------------------------------------------------ stream

/** Byte range of one member's deflate stream, read from the zip's central
 * directory. The file is far too large to inflate into a Buffer, so only its
 * offsets are resolved here and the data itself is streamed. */
async function locate(path, wantedName) {
  // The end-of-central-directory record is in the last 64 KB at worst.
  const { size } = await stat(path);
  const tailStart = Math.max(0, size - 65_557);
  const tail = await readBytes(path, tailStart, size - 1);

  let eocd = tail.length - 22;
  while (eocd >= 0 && tail.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error("zip: no end-of-central-directory record");

  const count = tail.readUInt16LE(eocd + 10);
  const cdOffset = tail.readUInt32LE(eocd + 16);
  const cd = await readBytes(path, cdOffset, cdOffset + tail.readUInt32LE(eocd + 12) - 1);

  let entry = 0;
  for (let i = 0; i < count; i++) {
    const nameLen = cd.readUInt16LE(entry + 28);
    const name = cd.toString("utf8", entry + 46, entry + 46 + nameLen);
    if (name === wantedName) {
      if (cd.readUInt16LE(entry + 10) !== 8) throw new Error("zip: member is not deflated");
      const compressed = cd.readUInt32LE(entry + 20);
      const local = cd.readUInt32LE(entry + 42);
      // The local header repeats the name and extra fields at its own lengths.
      const header = await readBytes(path, local, local + 29);
      const start =
        local + 30 + header.readUInt16LE(26) + header.readUInt16LE(28);
      return { start, end: start + compressed - 1 };
    }
    entry += 46 + nameLen + cd.readUInt16LE(entry + 30) + cd.readUInt16LE(entry + 32);
  }
  throw new Error(`zip: ${wantedName} not found`);
}

function readBytes(path, start, end) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    createReadStream(path, { start, end })
      .on("data", (c) => chunks.push(c))
      .on("end", () => resolve(Buffer.concat(chunks)))
      .on("error", reject);
  });
}

/** How good a candidate is, higher wins. GeoNames lists several names per
 * language; the flags are the only way to tell today's official name from a
 * historic one ("Constantinople"), a nickname, or a rough transliteration. */
function score(row) {
  if (row[COLUMNS.historic] === "1") return -1;
  if (row[COLUMNS.colloquial] === "1") return -1;
  return (row[COLUMNS.preferred] === "1" ? 4 : 0) + (row[COLUMNS.short] === "1" ? 1 : 0);
}

const best = new Map();
let scanned = 0;

const { start, end } = await locate(ARCHIVE, MEMBER);
const lines = createInterface({
  input: createReadStream(ARCHIVE, { start, end }).pipe(createInflateRaw()),
  crlfDelay: Infinity,
});

for await (const line of lines) {
  scanned++;
  // Cheap reject before the split: the language tag is short and rare.
  const row = line.split("\t");
  const language = row[COLUMNS.language];
  if (!LANGUAGES.includes(language)) continue;

  const id = Number(row[COLUMNS.geonameId]);
  const latin = wanted.get(id);
  if (latin === undefined) continue;

  const name = row[COLUMNS.name]?.trim();
  if (!name || name === latin) continue;

  const rank = score(row);
  if (rank < 0) continue;

  const key = `${id}:${language}`;
  const hit = best.get(key);
  // Ties go to the first seen: GeoNames orders alternates by id, and the
  // lower id is the older, more established spelling.
  if (!hit || rank > hit.rank) best.set(key, { rank, name });
}

console.log(`names: scanned ${scanned.toLocaleString("en-US")} rows`);

// ------------------------------------------------------------------ output

const out = {};
for (const [key, { name }] of best) {
  const [id, language] = key.split(":");
  (out[id] ??= {})[language] = name;
}

// Sorted by id so re-running produces a byte-identical file and the diff is
// only ever the names that actually changed.
const sorted = Object.fromEntries(
  Object.keys(out)
    .map(Number)
    .sort((a, b) => a - b)
    .map((id) => [id, out[id]]),
);

await writeFile(OUT, `${JSON.stringify(sorted, null, 0)}\n`);
await rm(ARCHIVE, { force: true });

const counts = LANGUAGES.map(
  (l) => `${l}: ${Object.values(sorted).filter((v) => v[l]).length}`,
).join(", ");
console.log(`names: ${Object.keys(sorted).length} cities localized (${counts}) → lib/city-names.json`);
