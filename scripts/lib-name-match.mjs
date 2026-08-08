/** Shared Quran-matching used by the name-reference scripts.
 *
 * Kept in one place because the candidate generator and the verifier must
 * agree exactly: a verse the generator offers has to be a verse the verifier
 * accepts, or curation would be arguing with the build.
 *
 * The rule is: keep the short vowels, drop the article and the alef.
 *
 *   Vowels stay, because they are the only thing separating the Name
 *   ٱلسَّلَٰمُ from the ordinary noun ٱلسِّلْمِ once everything else is gone.
 *
 *   The article goes, because most of the ninety-nine appear in the Quran
 *   without it — حَفِيظٌ, عَفُوًّا, بَدِيعُ. A definite-only rule reports a
 *   third of the names as absent from the Quran, which is simply false.
 *
 *   The alef goes, because the mushaf writes ٱلرَّحْمَٰنِ with a dagger alef
 *   that the name الرَّحْمَنُ does not have.
 *
 * None of the three works without the other two. What this cannot do is tell
 * whether a word refers to Allah: ٱلْمَلِكُ is the Name in 59:23 and the king
 * of Egypt in 12:43. That judgement is what curation is for — this only
 * supplies candidates and, later, proves a curated citation really is in the
 * verse it claims.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Spelled out in escapes rather than glyphs: written as a literal range the
// class swallows the Arabic letters too. Same trap lib/arabic.ts documents.
const NOISE = /[﻿ـ]/g;
/** Tanwin, shadda and the Quranic annotation marks — noise for matching. */
const DROP = /[ً-ٍّؐ-ؚۖ-ۭ࣓-ࣿ]/g;
/** Alef spellings that all mean the same letter, dagger alef included. */
const ALEF_FORMS = /[آأإٱٰ]/g;
/** Conjunctions and prepositions that glue to the front of a word. */
const PARTICLE = /^[وفبكل][َُِْ]?/;
/** The definite article, with or without its sukun. */
const ARTICLE = /^ا[َُِْ]?ل[َُِْ]?/;
/** The case ending carries grammar, not identity: مَلِكُ and مَلِكِ are one word. */
const FINAL = /[َُِْ]$/;

/** Reduce a word to the form two spellings of the same name share. */
export function stem(word) {
  let w = word.replace(NOISE, "").replace(DROP, "").replace(ALEF_FORMS, "ا");

  // Particles before the article, so وَبِٱلْحَقِّ sheds both.
  for (let i = 0; i < 3; i++) {
    if (ARTICLE.test(w)) w = w.replace(ARTICLE, "");
    else if (PARTICLE.test(w) && w.length > 3) w = w.replace(PARTICLE, "");
    else break;
  }

  return (
    w
      // The hamza takes its vowel with it: ٱلْءَاخِرُ and الْآخِرُ are one word,
      // and leaving the orphaned fatha behind makes them look like two.
      .replace(/[ءئؤ][َُِْ]?/g, "")
      .replace(/ا/g, "")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(FINAL, "")
  );
}

/** Do two stems name the same thing?
 *
 * The final ya is optional because the mushaf drops it where the name keeps
 * it — الْمُتَعَالِ in 13:9 for الْمُتَعَالِي — while everything before it
 * must match exactly. */
export function sameStem(a, b) {
  if (a === b) return true;
  // Dropping the ya exposes the vowel that carried it, so both must go.
  const trim = (s) => s.replace(/ي$/, "").replace(FINAL, "");
  return trim(a) === trim(b);
}

/** Consonants only, with nothing stripped from the front — the basmala test
 * needs this rather than `stem`, which would read the ب of بِسْمِ as a
 * preposition and leave سم. */
export function skeleton(word) {
  return word
    .replace(NOISE, "")
    .replace(DROP, "")
    .replace(ALEF_FORMS, "ا")
    .replace(/[َُِْ]/g, "");
}

/** Outside Al-Fatiha this edition prefixes the basmala to verse 1, which
 * would otherwise report Ar-Rahman and Ar-Rahim in 112 surah openings. */
function stripBasmala(text, surah, ayah) {
  if (ayah !== 1 || surah === 1) return text;
  const words = text.replace(NOISE, "").trim().split(/\s+/);
  return skeleton(words[0] ?? "") === "بسم" ? words.slice(4).join(" ") : text;
}

export async function loadVerses() {
  const file = join(process.cwd(), ".quran-cache", "quran-uthmani.json");
  const raw = await readFile(file, "utf8").catch(() => {
    throw new Error("Run `node scripts/fetch-quran.mjs` first — this reads .quran-cache/.");
  });
  const quran = JSON.parse(raw);
  return quran.data.surahs.flatMap((s) =>
    s.ayahs.map((a) => {
      const text = stripBasmala(a.text, s.number, a.numberInSurah);
      const words = text.trim().split(/\s+/);
      return {
        surah: s.number,
        ayah: a.numberInSurah,
        text,
        stems: words.map(stem),
      };
    }),
  );
}

/** Load a translation edition, keyed "surah:ayah". */
export async function loadTranslation(edition) {
  const file = join(process.cwd(), ".quran-cache", `${edition}.json`);
  const quran = JSON.parse(await readFile(file, "utf8"));
  const map = new Map();
  for (const s of quran.data.surahs) {
    for (const a of s.ayahs) map.set(`${s.number}:${a.numberInSurah}`, a.text);
  }
  return map;
}

/** Does this verse contain this name as a word?
 *
 * Multi-word names ("مالك الملك") are matched as a phrase — those words only
 * mean the Name when they appear together. */
export function verseHasName(verse, nameArabic) {
  const parts = nameArabic.trim().split(/\s+/);
  if (parts.length > 1) {
    return verse.stems.join(" ").includes(parts.map(stem).join(" "));
  }
  const target = stem(parts[0]);
  return verse.stems.some((w) => sameStem(w, target));
}

/** Every verse containing the name — the pool curation chooses from, and the
 * occurrence count a page reports. */
export function occurrences(verses, nameArabic) {
  return verses.filter((v) => verseHasName(v, nameArabic));
}

/** Read the names table straight out of lib/names.ts. */
export async function loadNames() {
  const src = await readFile(join(process.cwd(), "lib", "names.ts"), "utf8");
  const rows = [...src.matchAll(/arabic: "([^"]+)", transliteration: "([^"]+)", slug: "([^"]+)"/g)];
  if (rows.length !== 99) throw new Error(`expected 99 names in lib/names.ts, matched ${rows.length}`);
  return rows.map(([, arabic, translit, slug], i) => ({ n: i + 1, arabic, translit, slug }));
}
