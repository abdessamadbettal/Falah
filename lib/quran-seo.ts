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

export const QURAN_PATH = TOOL_PATHS.quran;

export const surahPath = (slug: string) => `${QURAN_PATH}/surah/${slug}`;
export const juzPath = (n: number) => `${QURAN_PATH}/juz/${n}`;
export const hizbPath = (n: number) => `${QURAN_PATH}/hizb/${n}`;
export const mushafPath = (n: number) => `${QURAN_PATH}/page/${n}`;

/** Every Quran URL the site publishes, for the sitemap. */
export function quranPaths(): { path: string; priority: number }[] {
  return [
    { path: QURAN_PATH, priority: 0.9 },
    ...SURAHS.map((s) => ({ path: surahPath(s.slug), priority: 0.8 })),
    ...JUZ.map((j) => ({ path: juzPath(j.n), priority: 0.7 })),
    ...HIZB.map((h) => ({ path: hizbPath(h.n), priority: 0.6 })),
    ...Array.from({ length: TOTAL_PAGES }, (_, i) => ({
      path: mushafPath(i + 1),
      priority: 0.5,
    })),
  ];
}


/** The surah's name in the reader's own script: "Al-Kahf" / "الكهف". Using
 * the transliteration inside Arabic copy would be both ugly and unsearchable. */
export function surahName(locale: Locale, s: SurahMeta): string {
  return locale === "ar" ? bareArabic(s.arabic).replace(/^سورة\s*/, "") : s.translit;
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

function joinNames(locale: Locale, names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  const tail = locale === "ar" ? " و" : " & ";
  return `${names.slice(0, -1).join(locale === "ar" ? "، " : ", ")}${tail}${names.at(-1)}`;
}

const BOOK_NAME: Record<Locale, string> = {
  en: "The Holy Quran",
  ar: "القرآن الكريم",
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
