import type { Metadata } from "next";
import { GITHUB_URL, SITE_URL, getDict, locales, type Locale } from "./i18n";

const OG_LOCALES: Record<Locale, string> = { en: "en_US", fr: "fr_FR", ar: "ar_MA" };

/** Canonical + hreflang + OG metadata for one page in one locale. */
export function pageMeta(
  locale: Locale,
  path: string,
  title: string,
  description: string,
): Metadata {
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
  ) as Record<string, string>;
  languages["x-default"] = `${SITE_URL}/en${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
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
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...APP_BASE,
        name,
        description,
        url: `${SITE_URL}/${locale}${path}`,
        inLanguage: locale,
        isPartOf: { "@type": "WebSite", name: "Falah.io", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Falah.io", item: `${SITE_URL}/${locale}` },
          { "@type": "ListItem", position: 2, name: d.common.nav.toolkit, item: `${SITE_URL}/${locale}#toolkit` },
          { "@type": "ListItem", position: 3, name, item: `${SITE_URL}/${locale}${path}` },
        ],
      },
    ],
  };
}

export const TOOL_PATHS: Record<string, string> = {
  prayer: "/tools/prayer-times",
  calendar: "/tools/hijri-calendar",
  ramadan: "/tools/ramadan-countdown",
  converter: "/tools/date-converter",
  qibla: "/tools/qibla",
  mosque: "/tools/mosque-finder",
  quran: "/tools/quran",
  tafseer: "/tools/tafseer",
  names: "/tools/names-of-allah",
  hisnul: "/tools/hisnul-muslim",
  zakat: "/tools/zakat",
  inheritance: "/tools/inheritance",
  age: "/tools/hijri-age",
  cards: "/tools/quran-cards",
  stamp: "/tools/date-stamp",
};

export function homeJsonLd(locale: Locale) {
  const d = getDict(locale);
  const cards = d.home.toolCards as Record<string, { name: string; description: string }>;
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
        url: `${SITE_URL}/${locale}`,
        inLanguage: locale,
        featureList: Object.values(cards).map((c) => c.name),
      },
      {
        "@type": "ItemList",
        name: d.common.nav.toolkit,
        numberOfItems: Object.keys(TOOL_PATHS).length,
        itemListElement: Object.entries(TOOL_PATHS).map(([key, path], i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: cards[key].name,
          description: cards[key].description,
          url: `${SITE_URL}/${locale}${path}`,
        })),
      },
    ],
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
