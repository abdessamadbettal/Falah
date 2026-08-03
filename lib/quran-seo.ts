/** URLs, titles and structured data for the prerendered Quran routes.
 *
 * Four views of the same text, each answering a different query shape:
 *   /quran/surah/al-kahf   "surah al kahf"
 *   /quran/juz/30          "juz amma", "para 30"
 *   /quran/hizb/59         "hizb 59"
 *   /quran/page/255        "quran page 255"
 * All four are self-canonical: they are genuinely different reading units,
 * and each carries its own heading, prose and navigation. */

import { bareArabic } from "./arabic";
import { getDict, localePath, type Locale } from "./i18n";
import { HIZB, JUZ, SURAHS, type SurahMeta, TOTAL_PAGES } from "./quran-meta";
import { TOOL_PATHS } from "./seo";
import { SITE_URL } from "./site";
import type { SitemapEntry } from "./sitemap";

export const QURAN_PATH = TOOL_PATHS.quran;

export const surahPath = (slug: string) => `${QURAN_PATH}/surah/${slug}`;
export const juzPath = (n: number) => `${QURAN_PATH}/juz/${n}`;
export const hizbPath = (n: number) => `${QURAN_PATH}/hizb/${n}`;
export const mushafPath = (n: number) => `${QURAN_PATH}/page/${n}`;

/** The surahs people actually search for by name, rather than reaching by
 * reading order: the Friday and nightly sunnahs (Al-Kahf, Al-Mulk, As-Sajdah,
 * Al-Jumuah), the ones recited from memory every day (the last three, Al-Asr,
 * Al-Kawthar, Ad-Duha, Ash-Sharh), the long-form recitations (Yasin,
 * Ar-Rahman, Al-Waqiah, Al-Muzzammil, Al-Insan) and the narrative surahs
 * people look up by story (Yusuf, Maryam, Ta-Ha).
 *
 * These carry the demand in the /quran tree, so they are ranked with the hub
 * rather than with the other 90 — a flat 0.8 across all 114 says nothing. */
const NOTABLE_SURAHS = new Set([
  "al-fatihah",
  "al-baqarah",
  "yusuf",
  "al-kahf",
  "maryam",
  "taha",
  "as-sajdah",
  "yasin",
  "ar-rahman",
  "al-waqiah",
  "al-jumuah",
  "al-mulk",
  "al-muzzammil",
  "al-insan",
  "an-naba",
  "ad-duha",
  "ash-sharh",
  "al-asr",
  "al-kawthar",
  "al-ikhlas",
  "al-falaq",
  "an-nas",
]);

/** Every Quran URL the site publishes, for the sitemap.
 *
 * The four views are not equals in search: a surah is what people ask for by
 * name, a juz mostly only as "juz amma", and a hizb almost never. The mushaf
 * pages earn their place by completing the crawl of the text, not by demand.
 * Revealed text does not change, so changefreq says so. */
export function quranPaths(): SitemapEntry[] {
  const freq = "yearly" as const;
  return [
    { path: QURAN_PATH, priority: 0.9, changeFrequency: "monthly" },
    ...SURAHS.map((s) => ({
      path: surahPath(s.slug),
      priority: NOTABLE_SURAHS.has(s.slug) ? 0.9 : 0.8,
      changeFrequency: freq,
    })),
    ...JUZ.map((j) => ({
      // Juz 30 is "juz amma" — the one juz with real standalone demand.
      path: juzPath(j.n),
      priority: j.n === 30 ? 0.8 : 0.5,
      changeFrequency: freq,
    })),
    ...HIZB.map((h) => ({ path: hizbPath(h.n), priority: 0.5, changeFrequency: freq })),
    ...Array.from({ length: TOTAL_PAGES }, (_, i) => ({
      path: mushafPath(i + 1),
      priority: 0.5,
      changeFrequency: freq,
    })),
  ];
}


/** The surah's name in the reader's own script: "Al-Kahf" / "الكهف". Using
 * the transliteration inside Arabic copy would be both ugly and unsearchable. */
export function surahName(locale: Locale, s: SurahMeta): string {
  return locale === "ar" ? bareArabic(s.arabic).replace(/^سورة\s*/, "") : s.translit;
}

/** The gloss the reader's own language uses for that name: "The Cave" /
 * "La Caverne". It is what people actually search for — "sourate la
 * caverne" — so it has to be translated, never left in English. */
export function surahMeaning(locale: Locale, s: SurahMeta): string {
  return locale === "fr" ? s.meaningFr : s.meaning;
}

export function juzName(locale: Locale, n: number): string {
  const j = JUZ[n - 1];
  return locale === "ar" ? bareArabic(j.arabic) : j.translit;
}

/** "Surah Al-Kahf 18:10" / "سورة الكهف 18:10". */
export function verseRef(locale: Locale, surah: number, ayah: number): string {
  const b = getDict(locale).quranBrowse;
  return `${b.surah} ${surahName(locale, SURAHS[surah - 1])} ${surah}:${ayah}`;
}

/** A readable list of surah names, for descriptions that span several. */
export function surahListLabel(locale: Locale, numbers: number[]): string {
  const b = getDict(locale).quranBrowse;
  const names = numbers.map((n) => `${b.surah} ${surahName(locale, SURAHS[n - 1])}`);
  return joinNames(locale, names);
}

/** Same list without the "Surah" prefix — for titles, where every character
 * counts against the ~60 Google will actually show. */
export function shortSurahList(locale: Locale, numbers: number[]): string {
  const names = numbers.slice(0, 2).map((n) => surahName(locale, SURAHS[n - 1]));
  const label = joinNames(locale, names);
  return numbers.length > 2 ? `${label}…` : label;
}

/** Each language joins a list its own way: Arabic glues "و" to the last item,
 * French spells out "et", English uses the ampersand titles have room for. */
const LIST_JOIN: Record<Locale, { comma: string; tail: string }> = {
  en: { comma: ", ", tail: " & " },
  ar: { comma: "، ", tail: " و" },
  fr: { comma: ", ", tail: " et " },
};

function joinNames(locale: Locale, names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  const { comma, tail } = LIST_JOIN[locale];
  return `${names.slice(0, -1).join(comma)}${tail}${names.at(-1)}`;
}

const BOOK_NAME: Record<Locale, string> = {
  en: "The Holy Quran",
  ar: "القرآن الكريم",
  fr: "Le Saint Coran",
};

/** trailingSlash is on, so the canonical form carries the slash. Structured
 * data must point at the same URL the <link rel="canonical"> does. */
const abs = (locale: Locale, path: string) => `${SITE_URL}${localePath(locale, path)}/`;

type Crumb = { name: string; path: string };

function breadcrumbs(locale: Locale, trail: Crumb[]) {
  const d = getDict(locale);
  const items: Crumb[] = [
    { name: "Falah.io", path: "" },
    { name: d.tools.quran.title, path: QURAN_PATH },
    ...trail,
  ];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(locale, c.path),
    })),
  };
}

/** Structured data for one reading unit. `Chapter` is only strictly right for
 * a surah; juz, hizb and mushaf pages are described as parts of the same Book
 * so search engines can see how the four views relate. */
export function readingJsonLd({
  locale,
  path,
  name,
  description,
  crumb,
  isChapter = false,
  position,
}: {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  crumb: string;
  isChapter?: boolean;
  position?: number;
}) {
  const url = abs(locale, path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name,
        description,
        url,
        inLanguage: locale,
        isPartOf: { "@type": "WebSite", name: "Falah.io", url: SITE_URL },
        breadcrumb: breadcrumbs(locale, [{ name: crumb, path }]),
        mainEntity: {
          "@type": isChapter ? "Chapter" : "CreativeWork",
          name,
          ...(position ? { position } : {}),
          inLanguage: "ar",
          isPartOf: { "@type": "Book", name: BOOK_NAME[locale], inLanguage: "ar" },
        },
      },
    ],
  };
}

/** The hub at /quran: an explicit machine-readable index of all 114 surahs,
 * which is the single strongest signal that the deeper routes exist. */
export function quranHubJsonLd(locale: Locale) {
  const d = getDict(locale);
  const b = d.quranBrowse;
  const url = abs(locale, QURAN_PATH);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: d.tools.quran.meta.title,
        description: d.tools.quran.meta.description,
        url,
        inLanguage: locale,
        isPartOf: { "@type": "WebSite", name: "Falah.io", url: SITE_URL },
        breadcrumb: breadcrumbs(locale, []),
      },
      {
        "@type": "Book",
        name: BOOK_NAME[locale],
        inLanguage: "ar",
        numberOfPages: TOTAL_PAGES,
        url,
        hasPart: SURAHS.map((s) => ({
          "@type": "Chapter",
          position: s.n,
          name: `${b.surah} ${surahName(locale, s)}`,
          alternateName: s.arabic,
          url: abs(locale, surahPath(s.slug)),
        })),
      },
      {
        "@type": "ItemList",
        name: b.hubJuzTitle,
        numberOfItems: JUZ.length,
        itemListElement: JUZ.map((j) => ({
          "@type": "ListItem",
          position: j.n,
          name: `${b.juz} ${j.n} — ${juzName(locale, j.n)}`,
          url: abs(locale, juzPath(j.n)),
        })),
      },
    ],
  };
}
