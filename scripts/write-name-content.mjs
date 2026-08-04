/**
 * Writes content/names/<slug>/<locale>.md from a batch payload on stdin.
 *
 * The markdown files are the source of truth once written — this exists only
 * so a batch of names can be authored in one place and land as ninety-nine
 * separate, individually editable files, the way a translator wants them.
 *
 * Payload shape (JSON on stdin):
 *   { "<slug>": { "en": {...}, "fr": {...}, "ar": {...} } }
 * where each locale is:
 *   { "summary": "...", "sections": [{ "h": "...", "p": ["...", "..."] }] }
 *
 *   node scripts/write-name-content.mjs < batch.json
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const LOCALES = ["en", "fr", "ar"];
const ROOT = join(process.cwd(), "content", "names");

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const batch = JSON.parse(Buffer.concat(chunks).toString("utf8"));

// Read the slugs out of lib/names.ts rather than importing it: this is a
// plain node script and lib/names.ts is TypeScript.
const src = await readFile(join(process.cwd(), "lib", "names.ts"), "utf8");
const known = new Set([...src.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]));
if (known.size !== 99) throw new Error(`expected 99 slugs, found ${known.size}`);
let written = 0;

for (const [slug, locales] of Object.entries(batch)) {
  if (!known.has(slug)) throw new Error(`${slug} is not one of the 99 names`);

  for (const locale of LOCALES) {
    const doc = locales[locale];
    if (!doc) throw new Error(`${slug}: missing ${locale}`);
    if (!doc.summary) throw new Error(`${slug}/${locale}: missing summary`);

    // A [[slug]] that matches no name would render as raw text on a live
    // page. Catching it here is the difference between a typo and a defect
    // shipped across three locales.
    for (const m of JSON.stringify(doc).matchAll(/\[\[([a-z0-9-]+)\]\]/g)) {
      if (!known.has(m[1])) throw new Error(`${slug}/${locale}: [[${m[1]}]] is not a name slug`);
    }

    const body = [
      doc.summary,
      ...(doc.sections ?? []).flatMap((s) => [`## ${s.h}`, ...(s.p ?? [])]),
    ].join("\n\n");

    await mkdir(join(ROOT, slug), { recursive: true });
    await writeFile(join(ROOT, slug, `${locale}.md`), `${body}\n`);
    written++;
  }
}

console.log(`names: wrote ${written} files for ${Object.keys(batch).length} names`);
