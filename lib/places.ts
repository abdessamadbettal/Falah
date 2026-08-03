/** Every country and city that has a prerendered prayer-times page.
 *
 * The site is a static export, so all ~7,900 place routes are rendered to
 * HTML during `next build`, across ~11 worker processes. The list is read
 * from disk once per process and sliced in memory from then on — the same
 * shape as lib/quran-build.ts, for the same reason.
 *
 * Data: GeoNames (CC BY 4.0), reduced by scripts/fetch-cities.mjs. */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import LOCALIZED from "./city-names.json";
import { getDict, type Locale } from "./i18n";

export type City = {
  /** GeoNames id — stable across dumps, and the tiebreaker in slugs. */
  id: number;
  /** URL segment, unique within its country: "casablanca". */
  slug: string;
  /** The Latin name, as GeoNames spells it. */
  name: string;
  /** Admin-1 region ("Illinois", "Casablanca-Settat"); "" where none exists. */
  region: string;
  /** ISO 3166-1 alpha-2 country code. */
  cc: string;
  lat: number;
  lng: number;
  pop: number;
  /** IANA zone. Every time on the page is rendered in it, never in the
   * visitor's own — someone in London reading the Jakarta page wants
   * Jakarta's Maghrib. */
  tz: string;
};

export type Country = {
  code: string;
  /** URL segment from the English name: "morocco", "united-states". */
  slug: string;
  count: number;
};

export type Places = {
  /** Content hash of the selection — a maintenance aid, not a published date.
   * See PLACES_REVISION in lib/prayer-paths.ts for the sitemap's <lastmod>. */
  hash: string;
  countries: Country[];
  cities: City[];
  countryBySlug: Map<string, Country>;
  countryByCode: Map<string, Country>;
  citiesByCountry: Map<string, City[]>;
};

const CACHE = join(process.cwd(), ".cities-cache", "places.json");

type Raw = Pick<Places, "hash" | "countries" | "cities">;

async function load(): Promise<Places> {
  let raw: Raw;
  try {
    raw = JSON.parse(await readFile(CACHE, "utf8")) as Raw;
  } catch {
    // Half a site is worse than a failed build: without this list every
    // country and city route would render an empty shell, and 23,000 empty
    // shells is the kind of thing that costs a domain its standing.
    throw new Error(
      `Place data: could not read ${CACHE}. The /prayer-times country and city ` +
        `routes are prerendered, so the build needs .cities-cache/ populated — run ` +
        `"node scripts/fetch-cities.mjs" (npm does this for you as prebuild).`,
    );
  }

  const citiesByCountry = new Map<string, City[]>();
  for (const city of raw.cities) {
    const bucket = citiesByCountry.get(city.cc);
    if (bucket) bucket.push(city);
    else citiesByCountry.set(city.cc, [city]);
  }

  return {
    ...raw,
    countryBySlug: new Map(raw.countries.map((c) => [c.slug, c])),
    countryByCode: new Map(raw.countries.map((c) => [c.code, c])),
    citiesByCountry,
  };
}

let pending: Promise<Places> | undefined;

/** Memoized per process — one disk read per build worker. */
export function places(): Promise<Places> {
  pending ??= load();
  return pending;
}

// ------------------------------------------------------------------- names

const DISPLAY = new Map<Locale, Intl.DisplayNames>();

/** "Morocco" / "المغرب" / "Maroc", from CLDR.
 *
 * Country names are the one part of this that needs no data of its own:
 * every code in the GeoNames dump resolves in all three locales, including
 * the awkward ones (XK → Kosovo / كوسوفو / Kosovo). */
export function countryName(locale: Locale, code: string): string {
  let names = DISPLAY.get(locale);
  if (!names) {
    names = new Intl.DisplayNames([locale], { type: "region" });
    DISPLAY.set(locale, names);
  }
  return names.of(code) ?? code;
}

const NAMES = LOCALIZED as Record<string, { ar?: string; fr?: string } | undefined>;

/** The city's name in the reader's language, falling back to the Latin one.
 *
 * An Arabic page headed "Casablanca" is invisible to someone searching
 * "مواقيت الصلاة الدار البيضاء", which is how Arabic readers actually search.
 * Where GeoNames has no localized name — true of most small towns — the Latin
 * spelling is also the one locals write, so the fallback is not a compromise. */
export function cityName(locale: Locale, city: City): string {
  if (locale === "en") return city.name;
  return NAMES[city.id]?.[locale] ?? city.name;
}

/** "Casablanca, Morocco" / "الدار البيضاء، المغرب" — the full form, for
 * titles and headings. The separator comes from the dictionary because
 * Arabic's comma is ، and a Latin one in Arabic copy reads as a typo. */
export function cityLabel(locale: Locale, city: City): string {
  const comma = getDict(locale).prayerPlaces.listComma;
  return `${cityName(locale, city)}${comma}${countryName(locale, city.cc)}`;
}

// --------------------------------------------------------------- geography

const EARTH_KM = 6371;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in kilometres. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(h));
}

/** The closest other cities, nearest first.
 *
 * Real internal links, and genuinely useful: someone who lands on a small
 * town's page is often looking for the larger city next to it, and a crawler
 * that arrives at one town can reach its whole region from there. Neighbours
 * come from the same country first — a border town's true nearest city can be
 * in another country, but "prayer times near Ceuta" almost never means Spain. */
export function nearbyCities(all: Places, city: City, limit = 8): City[] {
  const pool = all.citiesByCountry.get(city.cc) ?? [];
  const ranked = pool
    .filter((c) => c.id !== city.id)
    .map((c) => ({ city: c, km: distanceKm(city, c) }))
    .sort((a, b) => a.km - b.km);

  // A country with almost nothing in it (Monaco, Nauru) would otherwise show
  // an empty list; fall back to the nearest cities anywhere.
  if (ranked.length < 4) {
    const global = all.cities
      .filter((c) => c.id !== city.id && c.cc !== city.cc)
      .map((c) => ({ city: c, km: distanceKm(city, c) }))
      .sort((a, b) => a.km - b.km);
    ranked.push(...global.slice(0, limit));
  }

  return ranked.slice(0, limit).map((r) => r.city);
}
