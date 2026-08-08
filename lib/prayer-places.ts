/** URLs, titles and structured data for the prerendered prayer-times places.
 *
 *   /prayer-times                      the tool, and the index of countries
 *   /prayer-times/morocco              the country, and its cities
 *   /prayer-times/morocco/casablanca   one city
 *
 * Three levels, each self-canonical, because each answers a query the others
 * do not: "prayer times" (the tool), "prayer times in Morocco" (which method,
 * which cities) and "prayer times in Casablanca" (the actual timetable). */

import { getDict, localePath, type Locale } from "./i18n";
import {
  cityLabel,
  cityName,
  countryName,
  distanceKm,
  type City,
  type Country,
  type Places,
} from "./places";
import { MAKKAH, methodForCountry, qiblaDegrees } from "./prayer-calc";
import { cityPath, countryPath, PLACES_REVISION, PRAYER_PATH } from "./prayer-paths";
import { SITE_URL } from "./site";
import type { SitemapEntry } from "./sitemap";

// ------------------------------------------------------------------ sitemap

/** A city big enough that people search it by name rather than stumble on it.
 * Priority is only a relative hint to a crawler about where to spend its
 * budget, and within a set this large the population really is the signal. */
const MAJOR_CITY = 1_000_000;

export function countryPaths(all: Places): SitemapEntry[] {
  return all.countries.map((c) => ({
    path: countryPath(c.slug),
    priority: 0.7,
    // Honest: the timetable underneath genuinely is a different set of
    // numbers tomorrow, which is the entire reason the page exists.
    changeFrequency: "daily" as const,
  }));
}

export function cityPaths(all: Places): SitemapEntry[] {
  return all.cities.map((city) => ({
    path: cityPath(all.countryByCode.get(city.cc)?.slug ?? "", city.slug),
    priority: city.pop >= MAJOR_CITY ? 0.7 : 0.6,
    changeFrequency: "daily" as const,
  }));
}

// ------------------------------------------------------------------- copy

/** Bearing as a compass point: "NE", "ESE". Eight points, because sixteen is
 * more precision than anyone reads off a page and the exact degrees are
 * printed next to it anyway. */
const COMPASS = ["n", "ne", "e", "se", "s", "sw", "w", "nw"] as const;

export function compassPoint(degrees: number): (typeof COMPASS)[number] {
  return COMPASS[Math.round((((degrees % 360) + 360) % 360) / 45) % 8];
}

/** "33.59°N, 7.61°W" — signed decimals are unreadable; hemispheres are not. */
export function formatCoords(locale: Locale, lat: number, lng: number): string {
  const p = getDict(locale).prayerPlaces;
  const ns = lat >= 0 ? p.compass.n : p.compass.s;
  const ew = lng >= 0 ? p.compass.e : p.compass.w;
  return `${Math.abs(lat).toFixed(2)}°${ns}${p.listComma}${Math.abs(lng).toFixed(2)}°${ew}`;
}

/** Everything about a city that never changes — the facts a description can
 * quote without going stale between rebuilds.
 *
 * The times themselves are deliberately not among them. A meta description
 * reading "Fajr 05:10" is a lie by December, and a wrong prayer time in a
 * search result is worse than no number at all. Coordinates, the qibla
 * bearing and the distance to Makkah are true forever. */
export function cityFacts(locale: Locale, city: City) {
  const qibla = qiblaDegrees(city);
  return {
    name: cityName(locale, city),
    label: cityLabel(locale, city),
    country: countryName(locale, city.cc),
    coords: formatCoords(locale, city.lat, city.lng),
    qibla: Math.round(qibla),
    compass: compassPoint(qibla),
    makkahKm: Math.round(distanceKm(city, MAKKAH)),
    method: methodForCountry(city.cc),
  };
}

export function cityTitle(locale: Locale, city: City): string {
  return getDict(locale).prayerPlaces.cityTitle(cityName(locale, city), countryName(locale, city.cc));
}

export function cityDescription(locale: Locale, city: City): string {
  const p = getDict(locale).prayerPlaces;
  const f = cityFacts(locale, city);
  return p.cityDescription(f.label, f.coords, `${f.qibla}° ${p.compass[f.compass]}`);
}

export function countryTitle(locale: Locale, country: Country): string {
  return getDict(locale).prayerPlaces.countryTitle(countryName(locale, country.code));
}

export function countryDescription(locale: Locale, country: Country, cities: City[]): string {
  const p = getDict(locale).prayerPlaces;
  const largest = cities
    .slice(0, 3)
    .map((c) => cityName(locale, c))
    .join(p.listComma);
  return p.countryDescription(countryName(locale, country.code), cities.length, largest);
}

/** Keywords worth carrying: the phrasings a person actually types for this
 * exact city, in this exact language — never a wish list. */
export function cityKeywords(locale: Locale, city: City): string[] {
  const p = getDict(locale).prayerPlaces;
  const name = cityName(locale, city);
  const country = countryName(locale, city.cc);
  return p.cityKeywords(name, country);
}

// -------------------------------------------------------- structured data

/** trailingSlash is on, so the canonical form carries the slash. Structured
 * data must point at the same URL <link rel="canonical"> does. */
const abs = (locale: Locale, path: string) => `${SITE_URL}${localePath(locale, path)}/`;

type Crumb = { name: string; path: string };

function breadcrumbs(locale: Locale, trail: Crumb[]) {
  const d = getDict(locale);
  const items: Crumb[] = [
    { name: "Falah.io", path: "" },
    { name: d.tools.prayer.title, path: PRAYER_PATH },
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

/** One city.
 *
 * The `City` node is the point of this: it pins the page to a real place with
 * coordinates, so a search engine can connect "prayer times casablanca" to
 * the Casablanca at 33.59°N rather than to the film or to the Casablanca in
 * Chile. `dateModified` is the honest revision date, not the render time. */
export function cityJsonLd({
  locale,
  city,
  country,
  path,
  title,
  description,
  faq,
}: {
  locale: Locale;
  city: City;
  country: Country;
  path: string;
  title: string;
  description: string;
  faq: { q: string; a: string }[];
}) {
  const url = abs(locale, path);
  const name = cityName(locale, city);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        description,
        url,
        inLanguage: locale,
        dateModified: PLACES_REVISION,
        isPartOf: { "@type": "WebSite", name: "Falah.io", url: SITE_URL },
        breadcrumb: breadcrumbs(locale, [
          { name: countryName(locale, country.code), path: countryPath(country.slug) },
          { name, path },
        ]),
        about: { "@id": `${url}#place` },
      },
      {
        "@type": "City",
        "@id": `${url}#place`,
        name,
        ...(name === city.name ? {} : { alternateName: city.name }),
        address: {
          "@type": "PostalAddress",
          addressLocality: name,
          ...(city.region ? { addressRegion: city.region } : {}),
          addressCountry: city.cc,
        },
        geo: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lng },
        url,
      },
      faqEntity(faq),
    ],
  };
}

/** One country: the page itself, the country as a place, and an explicit
 * machine-readable list of every city beneath it — the strongest single
 * signal that those deeper routes exist and are worth crawling. */
export function countryJsonLd({
  locale,
  country,
  cities,
  path,
  title,
  description,
  faq,
}: {
  locale: Locale;
  country: Country;
  cities: City[];
  path: string;
  title: string;
  description: string;
  faq: { q: string; a: string }[];
}) {
  const url = abs(locale, path);
  const name = countryName(locale, country.code);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        description,
        url,
        inLanguage: locale,
        dateModified: PLACES_REVISION,
        isPartOf: { "@type": "WebSite", name: "Falah.io", url: SITE_URL },
        breadcrumb: breadcrumbs(locale, [{ name, path }]),
        about: { "@id": `${url}#place` },
      },
      { "@type": "Country", "@id": `${url}#place`, name, identifier: country.code, url },
      {
        "@type": "ItemList",
        name: title,
        numberOfItems: cities.length,
        itemListElement: cities.map((city, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: cityName(locale, city),
          url: abs(locale, cityPath(country.slug, city.slug)),
        })),
      },
      faqEntity(faq),
    ],
  };
}

/** The hub at /prayer-times, listing all 244 countries. */
export function placesHubJsonLd(locale: Locale, countries: Country[]) {
  const p = getDict(locale).prayerPlaces;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: p.hubTitle,
    numberOfItems: countries.length,
    itemListElement: countries.map((country, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: countryName(locale, country.code),
      url: abs(locale, countryPath(country.slug)),
    })),
  };
}
