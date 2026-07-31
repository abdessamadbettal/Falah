/** URLs, titles and structured data for the prerendered hadith routes.
 *
 * Three shapes of page, each answering a different query:
 *   /hadith                                           "hadith collections online"
 *   /hadith/sahih-bukhari                             "sahih bukhari"
 *   /hadith/sahih-bukhari/book-of-belief              "sahih bukhari book of belief"
 *   /hadith/sahih-bukhari/military-expeditions/part-3 — part 3 of a long kitab
 *   /hadith/40-hadith-nawawi/hadith-13                "nawawi hadith 13"
 *
 * Every segment is words rather than an id: the path is the clearest place to
 * state what a page is about, and "book-of-belief" is what someone searching
 * for it actually types.
 *
 * The middle two share a route: the segment after the collection is whatever
 * that collection's numbered unit is. For the seven large books that is a
 * kitab; the three "forty" collections have only one kitab, so for them it is
 * the hadith itself. See lib/hadith-page.ts. */

import {
  chapterCount,
  COLLECTIONS,
  type CollectionMeta,
  collectionNames,
  partSlug,
} from "./hadith-meta";
import { getDict, localePath, type Locale } from "./i18n";
import { TOOL_PATHS } from "./seo";
import { SITE_URL } from "./site";

export const HADITH_PATH = TOOL_PATHS.hadith;

export const collectionPath = (slug: string) => `${HADITH_PATH}/${slug}`;
/** A chapter of a large collection ("book-of-belief"), or one hadith of a
 * "forty" ("hadith-13"). `unit` is already a slug. */
export const unitPath = (slug: string, unit: string) => `${collectionPath(slug)}/${unit}`;
/** Parts 2..N of a chapter too long to serve as one page. */
export const partPath = (slug: string, unit: string, part: number) =>
  `${collectionPath(slug)}/${unit}/${partSlug(part)}`;

/** trailingSlash is on, so the canonical form carries the slash. Structured
 * data must point at the same URL <link rel="canonical"> does. */
const abs = (locale: Locale, path: string) => `${SITE_URL}${localePath(locale, path)}/`;

type Crumb = { name: string; path: string };

function breadcrumbs(locale: Locale, trail: Crumb[]) {
  const d = getDict(locale);
  const items: Crumb[] = [
    { name: "Falah.io", path: "" },
    { name: d.tools.hadith.title, path: HADITH_PATH },
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

const website = { "@type": "WebSite", name: "Falah.io", url: SITE_URL };

/** The book a collection's chapters and hadiths belong to. Repeated on every
 * page below the collection so a crawler can see how the routes relate. */
function bookOf(locale: Locale, c: CollectionMeta) {
  const b = getDict(locale).hadithBrowse;
  return {
    "@type": "Book",
    name: locale === "ar" ? c.ar.name : c.en.name,
    // Every name the book is genuinely cited by — this is what lets a search
    // engine tie "Sahih Bukhari", "صحيح البخاري" and "Bukhari Sharif" to one
    // entity rather than treating them as three unrelated strings.
    alternateName: collectionNames(locale, c).slice(1),
    inLanguage: "ar",
    author: { "@type": "Person", name: locale === "ar" ? c.ar.author : c.en.author },
    url: abs(locale, collectionPath(c.slug)),
    genre: b.genre,
  };
}

/** The hub at /hadith: an explicit machine-readable index of all ten
 * collections, which is the strongest signal that the deeper routes exist. */
export function hadithHubJsonLd(locale: Locale, totals: Map<string, number>) {
  const d = getDict(locale);
  const b = d.hadithBrowse;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: d.tools.hadith.meta.title,
        description: d.tools.hadith.meta.description,
        url: abs(locale, HADITH_PATH),
        inLanguage: locale,
        isPartOf: website,
        breadcrumb: breadcrumbs(locale, []),
      },
      {
        "@type": "ItemList",
        name: b.collections,
        numberOfItems: COLLECTIONS.length,
        itemListElement: COLLECTIONS.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: locale === "ar" ? c.ar.name : c.en.name,
          url: abs(locale, collectionPath(c.slug)),
          item: {
            ...bookOf(locale, c),
            numberOfPages: chapterCount(c.key),
            ...(totals.get(c.key) ? { numberOfItems: totals.get(c.key) } : {}),
          },
        })),
      },
    ],
  };
}

export function collectionJsonLd({
  locale,
  collection,
  description,
  total,
  chapters,
  faq,
}: {
  locale: Locale;
  collection: CollectionMeta;
  description: string;
  total: number;
  chapters: { n: number; title: string; count: number; slug: string }[];
  faq: { q: string; a: string }[];
}) {
  const name = locale === "ar" ? collection.ar.name : collection.en.name;
  const url = abs(locale, collectionPath(collection.slug));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name,
        description,
        url,
        inLanguage: locale,
        isPartOf: website,
        breadcrumb: breadcrumbs(locale, [{ name, path: collectionPath(collection.slug) }]),
        mainEntity: {
          ...bookOf(locale, collection),
          description,
          numberOfPages: chapterCount(collection.key),
          hasPart: chapters.map((c) => ({
            "@type": "Chapter",
            position: c.n,
            name: c.title,
            url: abs(locale, unitPath(collection.slug, c.slug)),
          })),
          ...(total ? { numberOfItems: total } : {}),
        },
      },
      faqPage(faq),
    ],
  };
}

export function chapterJsonLd({
  locale,
  collection,
  chapter,
  title,
  description,
  path,
}: {
  locale: Locale;
  collection: CollectionMeta;
  chapter: number;
  title: string;
  description: string;
  path: string;
}) {
  const collectionName = locale === "ar" ? collection.ar.name : collection.en.name;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        description,
        url: abs(locale, path),
        inLanguage: locale,
        isPartOf: website,
        breadcrumb: breadcrumbs(locale, [
          { name: collectionName, path: collectionPath(collection.slug) },
          { name: title, path },
        ]),
        mainEntity: {
          "@type": "Chapter",
          name: title,
          position: chapter,
          inLanguage: "ar",
          isPartOf: bookOf(locale, collection),
        },
      },
    ],
  };
}

/** One hadith, for the "forty" collections. `Quotation` is the closest
 * schema.org has to a transmitted saying, and `spokenByCharacter` would
 * overreach — the narration chain is the citation, so it goes in `citation`. */
export function hadithJsonLd({
  locale,
  collection,
  title,
  description,
  path,
  text,
  citation,
  position,
}: {
  locale: Locale;
  collection: CollectionMeta;
  title: string;
  description: string;
  path: string;
  text: string;
  citation: string;
  position: number;
}) {
  const collectionName = locale === "ar" ? collection.ar.name : collection.en.name;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        description,
        url: abs(locale, path),
        inLanguage: locale,
        isPartOf: website,
        breadcrumb: breadcrumbs(locale, [
          { name: collectionName, path: collectionPath(collection.slug) },
          { name: title, path },
        ]),
        mainEntity: {
          "@type": "Quotation",
          name: title,
          text,
          citation,
          position,
          inLanguage: "ar",
          isPartOf: bookOf(locale, collection),
        },
      },
    ],
  };
}

function faqPage(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
