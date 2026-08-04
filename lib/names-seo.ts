/** URLs, titles and structured data for the 99 prerendered name pages.
 *
 *   /names-of-allah              the searchable hub, and the index of all 99
 *   /names-of-allah/ar-rahman    one name, in full
 *
 * The hub answers "99 names of allah"; each leaf answers "what does Ar-Rahman
 * mean", "ar rahman meaning in arabic", "الرحمن معنى" — a set of queries the
 * hub cannot rank for on its own, because a page that says a little about
 * ninety-nine things says enough about none of them. */

import { bareArabic } from "./arabic";
import { getDict, localePath, type Locale } from "./i18n";
import { NAMES_OF_ALLAH, type DivineName } from "./names";
import REFS from "./name-refs.json";
import { TOOL_PATHS } from "./seo";
import { SITE_URL } from "./site";
import type { SitemapEntry } from "./sitemap";

export const NAMES_PATH = TOOL_PATHS.names;

export const namePath = (slug: string) => `${NAMES_PATH}/${slug}`;

/** Bump when the name content or the page template actually changes — not on
 * every deploy. Same reasoning as CONTENT_REVISION in lib/sitemap.ts. */
export const NAMES_REVISION = "2026-08-04";

export function nameBySlug(slug: string): DivineName | undefined {
  return NAMES_OF_ALLAH.find((n) => n.slug === slug);
}

export function nameIndex(name: DivineName): number {
  return NAMES_OF_ALLAH.indexOf(name);
}

/** The verses that contain this name, curated and build-time verified.
 *
 * Empty is a real answer: twenty-eight of the ninety-nine reach the famous
 * list through at-Tirmidhi's narration rather than through the Quran, and the
 * page says so rather than attaching a verse that does not contain them. */
export function nameRefs(slug: string): [number, number][] {
  const refs = (REFS as Record<string, number[][]>)[slug] ?? [];
  return refs.map(([surah, ayah]) => [surah, ayah]);
}

/** The name in the reader's own script: "Ar-Rahman" / "الرَّحْمَنُ".
 *
 * An Arabic page headed "Ar-Rahman" in Latin letters is both ugly and
 * unsearchable — Arabic readers type الرحمن, not the transliteration. */
export function nameTitleWord(locale: Locale, name: DivineName): string {
  // Undecorated on Arabic pages: nobody types الْفَتَّاحُ into a search box —
  // they type الفتاح — and the harakat belong on the ornamental display of
  // the name, not in a <title>.
  return locale === "ar" ? bareArabic(name.arabic) : name.transliteration;
}

/** The short gloss in the reader's language. */
export function nameMeaning(locale: Locale, name: DivineName): string {
  if (locale === "ar") return name.meaningAr;
  if (locale === "fr") return name.meaningFr;
  return name.meaning;
}

export function namesPaths(): SitemapEntry[] {
  return [
    { path: NAMES_PATH, priority: 0.8, changeFrequency: "monthly" },
    ...NAMES_OF_ALLAH.map((n) => ({
      path: namePath(n.slug),
      // The names people search by name — the ones recited in du'a and taught
      // first — carry the demand in this tree.
      priority: NOTABLE.has(n.slug) ? 0.7 : 0.6,
      changeFrequency: "yearly" as const,
    })),
  ];
}

/** The names with standalone search demand: the two that open every surah,
 * the ones invoked by name in du'a, and those that name a surah of the
 * Quran. A flat priority across all 99 would say nothing at all. */
const NOTABLE = new Set([
  "ar-rahman",
  "ar-rahim",
  "al-malik",
  "al-quddus",
  "as-salam",
  "al-aziz",
  "al-khaliq",
  "al-ghaffar",
  "ar-razzaq",
  "al-fattah",
  "al-alim",
  "al-wahhab",
  "al-latif",
  "al-ghafur",
  "al-wadud",
  "al-haqq",
  "al-hayy",
  "al-qayyum",
  "al-ahad",
  "as-samad",
  "an-nur",
  "al-hadi",
  "at-tawwab",
  "al-afuww",
  "al-karim",
  "as-sabur",
]);

// -------------------------------------------------------- structured data

/** trailingSlash is on, so the canonical form carries the slash. Structured
 * data must point at the same URL <link rel="canonical"> does. */
const abs = (locale: Locale, path: string) => `${SITE_URL}${localePath(locale, path)}/`;

type Crumb = { name: string; path: string };

function breadcrumbs(locale: Locale, trail: Crumb[]) {
  const d = getDict(locale);
  const items: Crumb[] = [
    { name: "Falah.io", path: "" },
    { name: d.tools.names.title, path: NAMES_PATH },
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

function faqEntity(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** One name.
 *
 * `DefinedTerm` in a `DefinedTermSet` is the honest shape: each name is a
 * term with a precise meaning inside a named, closed set, which is exactly
 * what Al-Asma ul-Husna is. It also lets the 99 leaves declare their
 * membership of one collection rather than looking like 99 loose pages. */
export function nameJsonLd({
  locale,
  name,
  path,
  title,
  description,
  faq,
}: {
  locale: Locale;
  name: DivineName;
  path: string;
  title: string;
  description: string;
  faq: { q: string; a: string }[];
}) {
  const d = getDict(locale);
  const url = abs(locale, path);
  const word = nameTitleWord(locale, name);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        description,
        url,
        inLanguage: locale,
        dateModified: NAMES_REVISION,
        isPartOf: { "@type": "WebSite", name: "Falah.io", url: SITE_URL },
        breadcrumb: breadcrumbs(locale, [{ name: word, path }]),
        about: { "@id": `${url}#term` },
      },
      {
        "@type": "DefinedTerm",
        "@id": `${url}#term`,
        name: word,
        alternateName: [name.arabic, name.transliteration].filter((v) => v !== word),
        description: nameMeaning(locale, name),
        termCode: String(nameIndex(name) + 1),
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: d.tools.names.title,
          url: abs(locale, NAMES_PATH),
        },
        url,
      },
      faqEntity(faq),
    ],
  };
}

/** The hub: an explicit machine-readable index of all 99 leaves, which is the
 * single strongest signal that the deeper routes exist. */
export function namesHubJsonLd(locale: Locale) {
  const d = getDict(locale);
  const t = d.tools.names;
  const url = abs(locale, NAMES_PATH);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        name: t.title,
        alternateName: "Al-Asma ul-Husna",
        description: t.meta.description,
        url,
        inLanguage: locale,
        hasDefinedTerm: NAMES_OF_ALLAH.map((n, i) => ({
          "@type": "DefinedTerm",
          termCode: String(i + 1),
          name: nameTitleWord(locale, n),
          description: nameMeaning(locale, n),
          url: abs(locale, namePath(n.slug)),
        })),
      },
      faqEntity(t.faq),
    ],
  };
}
