/**
 * Builds the place list the prerendered /prayer-times/<country>/<city>
 * routes are generated from.
 *
 * Runs once as `prebuild`, for the same reason the Quran and hadith fetches
 * do: `next build` fans out across ~11 worker processes and every one of them
 * renders some of the ~7,900 place routes. Downloading and reducing GeoNames
 * in each worker would be ~40 MB of identical work; instead this writes one
 * small JSON that every worker mmaps off disk.
 *
 * Source: GeoNames `cities15000` (every populated place over 15,000 people)
 * under CC BY 4.0, plus `admin1CodesASCII` for region names. Cached files are
 * reused, so repeat builds do no network I/O at all — delete .cities-cache/
 * to force a refresh.
 */

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { inflateRawSync } from "node:zlib";

const DUMP = "https://download.geonames.org/export/dump";
const DIR = join(process.cwd(), ".cities-cache");
const OUT = join(DIR, "places.json");

/** How much of the world gets its own page.
 *
 * Every country keeps its N largest cities so that no country is left as a
 * hub with nothing under it, and on top of that every city over the
 * population floor gets a page wherever it is. The union is ~7,650 cities:
 * enough to cover anything a person would search for by name, while staying
 * far short of the 34,000 in the raw file — most of which are places nobody
 * types into a search box, and each of which would cost a page in three
 * languages. */
const TOP_PER_COUNTRY = 20;
const POPULATION_FLOOR = 100_000;

// ------------------------------------------------------------------ fetch

async function cached(name, url, binary = false) {
  const file = join(DIR, name);
  try {
    return await readFile(file, binary ? null : "utf8");
  } catch {
    // not cached yet
  }
  process.stdout.write(`cities: fetching ${name}… `);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(file, buf);
  console.log(`ok (${(buf.length / 1e6).toFixed(1)} MB)`);
  return binary ? buf : buf.toString("utf8");
}

/** Reads one member out of a zip archive, via the central directory.
 *
 * A dependency for this would be a dependency in the production tree for the
 * sake of one build script, and the local file header cannot be trusted on
 * its own — archives that stream their output leave the sizes there zeroed
 * and put the real ones in a trailing data descriptor. The central directory
 * always has them. */
function unzip(buf, wanted) {
  // End of central directory: fixed 22-byte record, possibly followed by a
  // comment, so scan backwards for the signature.
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error("zip: no end-of-central-directory record");

  let entry = buf.readUInt32LE(eocd + 16);
  const count = buf.readUInt16LE(eocd + 10);

  for (let i = 0; i < count; i++) {
    const nameLen = buf.readUInt16LE(entry + 28);
    const name = buf.toString("utf8", entry + 46, entry + 46 + nameLen);
    if (name === wanted) {
      const method = buf.readUInt16LE(entry + 10);
      const size = buf.readUInt32LE(entry + 20);
      const offset = buf.readUInt32LE(entry + 42);
      // The local header's own name/extra lengths decide where the data
      // starts; they are allowed to differ from the central directory's.
      const start =
        offset + 30 + buf.readUInt16LE(offset + 26) + buf.readUInt16LE(offset + 28);
      const data = buf.subarray(start, start + size);
      return method === 0 ? data.toString("utf8") : inflateRawSync(data).toString("utf8");
    }
    entry +=
      46 + nameLen + buf.readUInt16LE(entry + 30) + buf.readUInt16LE(entry + 32);
  }
  throw new Error(`zip: ${wanted} not found`);
}

// ------------------------------------------------------------------ slugs

/** Latin-1 letters GeoNames' own transliteration leaves in place. */
const FOLD = { æ: "ae", œ: "oe", ø: "o", đ: "d", ð: "d", þ: "th", ß: "ss", ł: "l", ħ: "h", ŋ: "ng" };

/** A URL segment: lowercase ASCII, words joined by single hyphens.
 *
 * Slugs are the permanent public identity of a page — "casablanca" has to
 * keep meaning the same city across every rebuild — so this only ever folds
 * characters away, and never depends on the machine's locale. */
function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[æœøđðþßłħŋ]/g, (c) => FOLD[c] ?? c)
    .replace(/['’ʻʼ`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ------------------------------------------------------------------ build

await mkdir(DIR, { recursive: true });

const zip = await cached("cities15000.zip", `${DUMP}/cities15000.zip`, true);
const admin1Raw = await cached("admin1CodesASCII.txt", `${DUMP}/admin1CodesASCII.txt`);

// "US.IL\tIllinois\tIllinois\t4896861" — keyed by "<country>.<admin1 code>".
const regions = new Map();
for (const line of admin1Raw.split("\n")) {
  const [key, name] = line.split("\t");
  if (key && name) regions.set(key, name);
}

// The dump's untagged `alternatenames` column is deliberately unused: the
// Arabic and French names come from lib/city-names.json, which is built from
// the language-tagged dump by scripts/build-city-names.mjs.
const COLUMNS = {
  id: 0, name: 1, ascii: 2, lat: 4, lng: 5,
  country: 8, admin1: 10, population: 14, timezone: 17,
};

const rows = unzip(zip, "cities15000.txt")
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split("\t"));

const byCountry = new Map();
for (const row of rows) {
  const code = row[COLUMNS.country];
  if (!code) continue;
  const bucket = byCountry.get(code);
  if (bucket) bucket.push(row);
  else byCountry.set(code, [row]);
}

const countryName = new Intl.DisplayNames(["en"], { type: "region" });
const countries = [];
const cities = [];
const countrySlugs = new Set();

for (const [code, all] of [...byCountry].sort(([a], [b]) => a.localeCompare(b))) {
  all.sort((a, b) => Number(b[COLUMNS.population]) - Number(a[COLUMNS.population]));

  const keep = all.filter(
    (row, i) => i < TOP_PER_COUNTRY || Number(row[COLUMNS.population]) >= POPULATION_FLOOR,
  );
  if (keep.length === 0) continue;

  // CLDR gives every code in the file a real English name, and it is the one
  // people search with ("Ivory Coast" resolves to Côte d'Ivoire either way).
  let slug = slugify(countryName.of(code) ?? code) || code.toLowerCase();
  // Two countries sharing an English slug would silently overwrite one
  // another's pages; the code is the only guaranteed tiebreaker.
  if (countrySlugs.has(slug)) slug = `${slug}-${code.toLowerCase()}`;
  countrySlugs.add(slug);

  const taken = new Map();
  const kept = [];

  for (const row of keep) {
    const region = regions.get(`${code}.${row[COLUMNS.admin1]}`) ?? "";
    const base =
      slugify(row[COLUMNS.ascii]) || slugify(row[COLUMNS.name]) || `city-${row[COLUMNS.id]}`;

    // Every country has its Springfields. Fall back to the region, then to
    // the GeoNames id, so a slug always identifies exactly one place.
    let citySlug = base;
    if (taken.has(citySlug)) citySlug = `${base}-${slugify(region)}`;
    if (taken.has(citySlug) || citySlug === base + "-") citySlug = `${base}-${row[COLUMNS.id]}`;
    taken.set(citySlug, true);

    kept.push({
      id: Number(row[COLUMNS.id]),
      slug: citySlug,
      name: row[COLUMNS.name],
      region,
      cc: code,
      lat: Number(Number(row[COLUMNS.lat]).toFixed(4)),
      lng: Number(Number(row[COLUMNS.lng]).toFixed(4)),
      pop: Number(row[COLUMNS.population]) || 0,
      tz: row[COLUMNS.timezone],
    });
  }

  countries.push({ code, slug, count: kept.length });
  cities.push(...kept);
}

/** A content hash of the selection — printed, never published.
 *
 * .cities-cache/ is not committed, so this file is rebuilt from scratch on
 * every CI run and cannot carry a trustworthy date. The <lastmod> the sitemap
 * publishes is PLACES_REVISION in lib/prayer-paths.ts, bumped by hand; this
 * hash is how a maintainer refreshing the dump can tell whether anything
 * actually moved and the constant is due a bump. */
const hash = createHash("sha256")
  .update(JSON.stringify({ countries, cities }))
  .digest("hex")
  .slice(0, 12);

await writeFile(OUT, JSON.stringify({ hash, countries, cities }));

console.log(
  `cities: ${cities.length} cities in ${countries.length} countries ` +
    `→ .cities-cache/places.json (content ${hash})`,
);
