import type { Metadata, Viewport } from "next";
import { getDict, localePath, locales, type Dict, type Locale } from "./i18n";
import { GITHUB_URL, SITE_URL } from "./site";

const OG_LOCALES: Record<Locale, string> = { en: "en_US", ar: "ar_MA" };

/** Canonical + hreflang + OG metadata for one page in one locale.
 * English (/en) doubles as the x-default. */
export function pageMeta(
  locale: Locale,
  path: string,
  title: string,
  description: string,
): Metadata {
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}${localePath(l, path)}`]),
  ) as Record<string, string>;
  languages["x-default"] = `${SITE_URL}${localePath("en", path)}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${localePath(locale, path)}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${localePath(locale, path)}`,
      siteName: "Falah.io",
      type: "website",
      locale: OG_LOCALES[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "Falah.io — The Islamic Toolkit" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og.png`],
    },
  };
}

const KEYWORDS = [
  "Islamic tools",
  "prayer times",
  "qibla",
  "hijri calendar",
  "zakat calculator",
  "quran",
  "open source",
];

/** Site-wide <head> metadata, built per locale by the [locale] layout. */
export function siteMetadata(d: Dict): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: d.meta.siteTitle, template: d.meta.titleTemplate },
    description: d.meta.siteDescription,
    applicationName: "Falah.io",
    keywords: KEYWORDS,
    robots: { index: true, follow: true },
  };
}

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

const APP_BASE = {
  "@type": "WebApplication",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any (web browser)",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  license: "https://opensource.org/licenses/MIT",
  creator: { "@type": "Organization", name: "Falah.io", url: SITE_URL, sameAs: [GITHUB_URL] },
};

export function toolJsonLd(locale: Locale, path: string, name: string, description: string) {
  const d = getDict(locale);
  const home = `${SITE_URL}${localePath(locale)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...APP_BASE,
        name,
        description,
        url: `${SITE_URL}${localePath(locale, path)}`,
        inLanguage: locale,
        isPartOf: { "@type": "WebSite", name: "Falah.io", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Falah.io", item: home },
          { "@type": "ListItem", position: 2, name: d.common.nav.toolkit, item: `${home}#toolkit` },
          { "@type": "ListItem", position: 3, name, item: `${SITE_URL}${localePath(locale, path)}` },
        ],
      },
    ],
  };
}

/** Every tool the site ships, keyed exactly like `Dict["tools"]` and
 * `Dict["home"]["toolCards"]`. Because the map is `Record<ToolKey, string>`,
 * adding a tool to the dictionaries without registering its path here (or
 * vice versa) is a compile error, not a runtime surprise. */
export type ToolKey = keyof Dict["tools"];

export const TOOL_PATHS: Record<ToolKey, string> = {
  prayer: "/prayer-times",
  calendar: "/hijri-calendar",
  ramadan: "/ramadan-countdown",
  converter: "/date-converter",
  qibla: "/qibla",
  mosque: "/mosque-finder",
  quran: "/quran",
  tafseer: "/tafseer",
  names: "/names-of-allah",
  hisnul: "/hisnul-muslim",
  zakat: "/zakat",
  inheritance: "/inheritance",
  age: "/hijri-age",
  cards: "/quran-cards",
  stamp: "/date-stamp",
};

/** The 15 tools grouped into the 5 categories used across the site — the home
 * directory and the footer both read from this one source. Group order matches
 * d.home.categories, so index i lines up with categories[i]. */
export const TOOL_CATEGORIES: { key: ToolKey; icon: string }[][] = [
  [
    { key: "prayer", icon: "ph:mosque" },
    { key: "calendar", icon: "ph:calendar-dots" },
    { key: "ramadan", icon: "ph:moon-stars" },
    { key: "converter", icon: "ph:arrows-left-right" },
  ],
  [
    { key: "qibla", icon: "ph:compass" },
    { key: "mosque", icon: "ph:map-pin-area" },
  ],
  [
    { key: "quran", icon: "ph:book-open-text" },
    { key: "tafseer", icon: "ph:scroll" },
    { key: "names", icon: "ph:sparkle" },
    { key: "hisnul", icon: "ph:hands-praying" },
  ],
  [
    { key: "zakat", icon: "ph:coins" },
    { key: "inheritance", icon: "ph:tree-structure" },
    { key: "age", icon: "ph:hourglass-medium" },
  ],
  [
    { key: "cards", icon: "ph:paint-brush" },
    { key: "stamp", icon: "ph:stamp" },
  ],
];

export const ABOUT_PATH = "/about";

export function aboutJsonLd(locale: Locale) {
  const d = getDict(locale);
  const home = `${SITE_URL}${localePath(locale)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        name: d.about.meta.title,
        description: d.about.meta.description,
        url: `${SITE_URL}${localePath(locale, ABOUT_PATH)}`,
        inLanguage: locale,
        isPartOf: { "@type": "WebSite", name: "Falah.io", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Falah.io", item: home },
          { "@type": "ListItem", position: 2, name: d.common.nav.about, item: `${SITE_URL}${localePath(locale, ABOUT_PATH)}` },
        ],
      },
    ],
  };
}

export function homeJsonLd(locale: Locale) {
  const d = getDict(locale);
  const cards = d.home.toolCards;
  const toolKeys = Object.keys(TOOL_PATHS) as ToolKey[];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Falah.io",
        alternateName: "Falah — The Islamic Toolkit",
        url: SITE_URL,
        inLanguage: locale,
        description: d.meta.siteDescription,
      },
      {
        ...APP_BASE,
        name: d.meta.siteTitle,
        description: d.meta.siteDescription,
        url: `${SITE_URL}${localePath(locale)}`,
        inLanguage: locale,
        featureList: Object.values(cards).map((c) => c.name),
      },
      {
        "@type": "ItemList",
        name: d.common.nav.toolkit,
        numberOfItems: toolKeys.length,
        itemListElement: toolKeys.map((key, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: cards[key].name,
          description: cards[key].description,
          url: `${SITE_URL}${localePath(locale, TOOL_PATHS[key])}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: d.home.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

/** Build FAQPage structured data from a list of Q&A pairs — feed it the same
 * array the visible <Faq> renders so the two never drift. */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
