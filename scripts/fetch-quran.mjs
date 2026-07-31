/**
 * Downloads the Quran editions the prerendered routes are built from.
 *
 * Runs once as `prebuild`. `next build` fans out across ~11 worker
 * processes, and every one of them renders some of the ~1,600 Quran routes —
 * without this step each worker would fetch all three editions itself, which
 * is ~40 requests for 14 MB of identical data and gets refused by the API.
 *
 * Cached files are reused, so repeat builds do no network I/O at all. Delete
 * .quran-cache/ to force a refresh.
 */

import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const API = "https://api.alquran.cloud/v1/quran";
const DIR = join(process.cwd(), ".quran-cache");

// The Arabic text, plus the translation each locale's dictionary asks for.
const EDITIONS = ["quran-uthmani", "en.sahih", "ar.muyassar"];
const TOTAL_AYAHS = 6236;

async function fetchEdition(edition) {
  const res = await fetch(`${API}/${edition}`);
  if (!res.ok) throw new Error(`${edition}: HTTP ${res.status}`);
  const json = await res.json();
  const count = json?.data?.surahs?.reduce((n, s) => n + s.ayahs.length, 0) ?? 0;
  if (count !== TOTAL_AYAHS) {
    throw new Error(`${edition}: expected ${TOTAL_AYAHS} ayahs, got ${count}`);
  }
  return json;
}

await mkdir(DIR, { recursive: true });
const present = new Set(await readdir(DIR).catch(() => []));

for (const edition of EDITIONS) {
  const file = `${edition}.json`;
  if (present.has(file)) {
    console.log(`quran: ${edition} already cached`);
    continue;
  }
  process.stdout.write(`quran: fetching ${edition}… `);
  const json = await fetchEdition(edition);
  await writeFile(join(DIR, file), JSON.stringify(json));
  console.log("ok");
}
