/** Identity of every hadith collection Falah publishes — names, compilers,
 * era, and the slug each one lives at.
 *
 * Hardcoded for the same reason lib/quran-meta.ts is: these are the URLs. A
 * collection's slug and a chapter's number decide where a page lives, and
 * neither may shift because an upstream dataset changed its spelling. The
 * texts still come from the cache built by scripts/fetch-hadith.mjs; only the
 * skeleton lives here.
 *
 * `key` is the join to everything else: the .hadith-cache/<key>/ directory
 * and the CHAPTER_TITLES entry in lib/hadith-chapters.ts. */

import { CHAPTER_TITLES } from "./hadith-chapters";
import type { Locale } from "./i18n";

/** How a collection is conventionally described — drives the badge on the
 * hub and the wording of each collection's intro. */
export type CollectionKind = "sahih" | "sunan" | "muwatta" | "forty";

export type CollectionMeta = {
  key: string;
  /** URL slug. Deliberately the full searched name ("sahih-bukhari", not
   * "bukhari") — it is what people type, and it reads as a title in a SERP. */
  slug: string;
  en: { name: string; author: string };
  ar: { name: string; author: string };
  /** Year the compiler died, Hijri and Gregorian. Null for Forty Hadith
   * Qudsi, which has no single compiler. */
  died: { ah: number; ce: number } | null;
  kind: CollectionKind;
  icon: string;
  /**
   * The other names this collection is genuinely known by — rival
   * transliterations ("Tirmizi", "Abu Dawood"), the short form people
   * actually type ("Bukhari"), and the Arabic.
   *
   * These are real alternative names, not invented phrases: they go into
   * `schema.org` `alternateName`, into a visible "also known as" line, and
   * into the hub's search index, so someone who types "bukhari sharif" or
   * "صحيح البخاري" lands on the right page. Keeping them to names that a
   * reader would recognise is the line between covering search variants and
   * stuffing keywords.
   */
  aliases: { en: string[]; ar: string[] };
};

export const COLLECTIONS: CollectionMeta[] = [
  {
    key: "bukhari",
    slug: "sahih-bukhari",
    en: { name: "Sahih al-Bukhari", author: "Imam Muhammad ibn Isma'il al-Bukhari" },
    ar: { name: "صحيح البخاري", author: "الإمام محمد بن إسماعيل البخاري" },
    died: { ah: 256, ce: 870 },
    kind: "sahih",
    icon: "ph:book-bookmark",
    aliases: {
      en: ["Sahih Bukhari", "Bukhari", "Bukhari Sharif", "Sahih al-Bukhari hadith"],
      ar: ["صحيح البخاري", "البخاري", "الجامع الصحيح"],
    },
  },
  {
    key: "muslim",
    slug: "sahih-muslim",
    en: { name: "Sahih Muslim", author: "Imam Muslim ibn al-Hajjaj an-Naysaburi" },
    ar: { name: "صحيح مسلم", author: "الإمام مسلم بن الحجاج النيسابوري" },
    died: { ah: 261, ce: 875 },
    kind: "sahih",
    icon: "ph:book-bookmark",
    aliases: {
      en: ["Sahih Muslim", "Muslim", "Sahih Muslim hadith"],
      ar: ["صحيح مسلم", "مسلم"],
    },
  },
  {
    key: "abudawud",
    slug: "sunan-abu-dawud",
    en: { name: "Sunan Abu Dawud", author: "Imam Abu Dawud as-Sijistani" },
    ar: { name: "سنن أبي داود", author: "الإمام أبو داود السجستاني" },
    died: { ah: 275, ce: 889 },
    kind: "sunan",
    icon: "ph:books",
    aliases: {
      en: ["Sunan Abu Dawood", "Abu Dawud", "Abu Dawood", "Sunan Abi Dawud"],
      ar: ["سنن أبي داود", "أبو داود"],
    },
  },
  {
    key: "tirmidhi",
    slug: "jami-at-tirmidhi",
    en: { name: "Jami' at-Tirmidhi", author: "Imam Abu 'Isa Muhammad at-Tirmidhi" },
    ar: { name: "جامع الترمذي", author: "الإمام أبو عيسى محمد الترمذي" },
    died: { ah: 279, ce: 892 },
    kind: "sunan",
    icon: "ph:books",
    aliases: {
      en: ["Sunan at-Tirmidhi", "Tirmidhi", "Tirmizi", "Jami al-Tirmidhi"],
      ar: ["جامع الترمذي", "سنن الترمذي", "الترمذي"],
    },
  },
  {
    key: "nasai",
    slug: "sunan-an-nasai",
    en: { name: "Sunan an-Nasa'i", author: "Imam Ahmad ibn Shu'ayb an-Nasa'i" },
    ar: { name: "سنن النسائي", author: "الإمام أحمد بن شعيب النسائي" },
    died: { ah: 303, ce: 915 },
    kind: "sunan",
    icon: "ph:books",
    aliases: {
      en: ["Sunan Nasai", "An-Nasai", "Nasai", "Sunan an-Nasa'i"],
      ar: ["سنن النسائي", "النسائي", "المجتبى"],
    },
  },
  {
    key: "ibnmajah",
    slug: "sunan-ibn-majah",
    en: { name: "Sunan Ibn Majah", author: "Imam Muhammad ibn Yazid Ibn Majah" },
    ar: { name: "سنن ابن ماجه", author: "الإمام محمد بن يزيد ابن ماجه" },
    died: { ah: 273, ce: 887 },
    kind: "sunan",
    icon: "ph:books",
    aliases: {
      en: ["Sunan Ibn Maja", "Ibn Majah", "Ibn Maja"],
      ar: ["سنن ابن ماجه", "ابن ماجه"],
    },
  },
  {
    key: "malik",
    slug: "muwatta-malik",
    en: { name: "Muwatta Malik", author: "Imam Malik ibn Anas" },
    ar: { name: "موطأ مالك", author: "الإمام مالك بن أنس" },
    died: { ah: 179, ce: 795 },
    kind: "muwatta",
    icon: "ph:scroll",
    aliases: {
      en: ["Al-Muwatta", "Muwatta Imam Malik", "Muwatta", "Al-Muwatta of Imam Malik"],
      ar: ["الموطأ", "موطأ الإمام مالك"],
    },
  },
  {
    key: "nawawi",
    slug: "40-hadith-nawawi",
    en: { name: "An-Nawawi's Forty Hadith", author: "Imam Yahya ibn Sharaf an-Nawawi" },
    ar: { name: "الأربعون النووية", author: "الإمام يحيى بن شرف النووي" },
    died: { ah: 676, ce: 1277 },
    kind: "forty",
    icon: "ph:star-four",
    aliases: {
      en: ["40 Hadith Nawawi", "Forty Hadith Nawawi", "Arbaeen Nawawi", "Nawawi's 40 Hadith"],
      ar: ["الأربعون النووية", "أربعون النووي", "متن الأربعين النووية"],
    },
  },
  {
    key: "qudsi",
    slug: "40-hadith-qudsi",
    en: { name: "Forty Hadith Qudsi", author: "Various compilers" },
    ar: { name: "الأربعون القدسية", author: "جمع من العلماء" },
    died: null,
    kind: "forty",
    icon: "ph:star-four",
    aliases: {
      en: ["40 Hadith Qudsi", "Hadith Qudsi", "Forty Hadith Qudsi", "Sacred Hadith"],
      ar: ["الأحاديث القدسية", "الأربعون القدسية", "الحديث القدسي"],
    },
  },
  {
    key: "dehlawi",
    slug: "40-hadith-shah-waliullah",
    en: { name: "Shah Waliullah's Forty Hadith", author: "Shah Waliullah ad-Dehlawi" },
    ar: { name: "الأربعون للشاه ولي الله الدهلوي", author: "الشاه ولي الله الدهلوي" },
    died: { ah: 1176, ce: 1762 },
    kind: "forty",
    icon: "ph:star-four",
    aliases: {
      en: ["40 Hadith Shah Waliullah", "Arbaeen Shah Waliullah", "Shah Waliullah Dehlawi Forty Hadith"],
      ar: ["الأربعون للدهلوي", "أربعون الشاه ولي الله"],
    },
  },
];

/** The six canonical collections, in the order they are conventionally
 * listed. Used to group the hub, and to say "one of the Kutub as-Sittah". */
export const SIX_BOOKS = ["bukhari", "muslim", "abudawud", "tirmidhi", "nasai", "ibnmajah"];

const BY_SLUG = new Map(COLLECTIONS.map((c) => [c.slug, c]));
const BY_KEY = new Map(COLLECTIONS.map((c) => [c.key, c]));

export const collectionBySlug = (slug: string) => BY_SLUG.get(slug);
export const collectionByKey = (key: string) => BY_KEY.get(key);

export const isSixBook = (c: CollectionMeta) => SIX_BOOKS.includes(c.key);

/** A "forty" collection is short enough that every hadith in it earns its own
 * URL; the large collections would be ~36,000 pages, so their hadiths are
 * anchored inside their chapter instead. */
export const hasHadithPages = (c: CollectionMeta) => c.kind === "forty";

/** The collection's name in the reader's own script. Latin locales get the
 * transliteration, Arabic gets the Arabic — a transliteration inside Arabic
 * copy is both ugly and unsearchable. */
export function collectionName(locale: Locale, c: CollectionMeta): string {
  return locale === "ar" ? c.ar.name : c.en.name;
}

export function collectionAuthor(locale: Locale, c: CollectionMeta): string {
  return locale === "ar" ? c.ar.author : c.en.author;
}

/** Every name a collection answers to, in the reader's language plus the
 * Arabic — the Arabic is always included because Arabic-script queries are a
 * large share of the traffic these pages are for, on both locales. */
export function collectionNames(locale: Locale, c: CollectionMeta): string[] {
  const own =
    locale === "ar" ? [c.ar.name, ...c.aliases.ar] : [c.en.name, ...c.aliases.en];
  const other = locale === "ar" ? [c.en.name] : [c.ar.name, ...c.aliases.ar];
  return [...new Set([...own, ...other])].filter(Boolean);
}

/** Title of one kitab, in the reader's language. Chapter numbers come from
 * the cache, so a missing title means the two have drifted — callers treat
 * an empty string as "not found" and 404 rather than render a blank heading. */
export function chapterTitle(locale: Locale, key: string, n: number): string {
  const row = CHAPTER_TITLES[key]?.find(([num]) => num === n);
  if (!row) return "";
  return locale === "ar" ? row[1] : row[2];
}

/** Both scripts at once, for the chapter index where each row shows the
 * Arabic kitab name alongside its English rendering. */
export function chapterTitles(key: string, n: number): { ar: string; en: string } | null {
  const row = CHAPTER_TITLES[key]?.find(([num]) => num === n);
  return row ? { ar: row[1], en: row[2] } : null;
}

// ------------------------------------------------------------------- slugs

/** The URL segment for a kitab — "book-of-belief", not "2". Readable URLs
 * carry the query in the path, and a hadith book's name is exactly what
 * someone searching for it types. */
export function chapterSlug(key: string, n: number): string {
  return CHAPTER_TITLES[key]?.find(([num]) => num === n)?.[3] ?? "";
}

/** The chapter a slug names, or null. Used to resolve a route param, so an
 * unknown slug must be distinguishable from chapter 0 — which is a real
 * chapter in Sahih Muslim and Sunan Ibn Majah. */
export function chapterBySlug(key: string, slug: string): number | null {
  const row = CHAPTER_TITLES[key]?.find(([, , , s]) => s === slug);
  return row ? row[0] : null;
}

/** A hadith's own segment, for the "forty" collections: "hadith-13". Bare
 * numbers read as an id; this reads as a thing. */
export const hadithSlug = (n: number) => `hadith-${formatSlugNumber(n)}`;

export function hadithFromSlug(slug: string): number | null {
  const m = /^hadith-(\d+(?:-\d+)?)$/.exec(slug);
  if (!m) return null;
  const n = Number(m[1].replace("-", "."));
  return Number.isFinite(n) ? n : null;
}

/** Parts 2..N of a long kitab: "part-3". */
export const partSlug = (part: number) => `part-${part}`;

export function partFromSlug(slug: string): number | null {
  const m = /^part-(\d+)$/.exec(slug);
  if (!m) return null;
  const part = Number(m[1]);
  return Number.isInteger(part) && part >= 2 ? part : null;
}

/** A handful of hadiths are split as 402.2; a dot in a path segment reads as
 * a file extension, so it becomes a hyphen. */
const formatSlugNumber = (n: number) =>
  Number.isInteger(n) ? String(n) : String(n).replace(".", "-");

export const chapterCount = (key: string) => CHAPTER_TITLES[key]?.length ?? 0;

/** How many hadiths fit on one chapter page before it is split. Kitab
 * al-Maghazi has 525 — a single page would be ~1 MB of HTML, which is a bad
 * trade for the one metric (LCP) that these pages compete on. */
export const PER_PAGE = 50;

export const partCount = (hadiths: number) => Math.max(1, Math.ceil(hadiths / PER_PAGE));
