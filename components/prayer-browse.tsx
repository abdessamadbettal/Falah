/** Server-rendered link indexes and fact panels for the prayer-times places.
 *
 * Deliberately server-only, like components/quran-browse.tsx: every link into
 * the 7,900 place routes must exist in the HTML a crawler receives, and none
 * of this ships a byte of JavaScript. */

import Link from "next/link";
import { Eyebrow, goldCls, lineCls, mutedCls, Star8 } from "@/components/ui";
import { getDict, localePath, type Locale } from "@/lib/i18n";
import { cityName, countryName, type City, type Country } from "@/lib/places";
import { cityPath, countryPath, PRAYER_PATH } from "@/lib/prayer-paths";

// ------------------------------------------------------------- breadcrumb

/** The visible trail, above the H1.
 *
 * It exists for the reader first — landing on a small town from a search
 * result, the way back up to the country is the most likely next click — and
 * it mirrors the BreadcrumbList in the page's structured data exactly. */
export function PlaceCrumbs({
  locale,
  trail,
}: {
  locale: Locale;
  trail: { name: string; path?: string }[];
}) {
  const d = getDict(locale);
  const items = [
    { name: d.tools.prayer.title, path: PRAYER_PATH },
    ...trail,
  ];
  return (
    <nav aria-label={d.prayerPlaces.breadcrumb} className="mb-6">
      <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${mutedCls}`}>
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden="true" className="opacity-40 select-none">
                /
              </span>
            ) : null}
            {item.path ? (
              <Link
                href={localePath(locale, item.path)}
                className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-zinc-900 dark:text-zinc-100">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ----------------------------------------------------------------- indexes

function IndexHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 font-display text-2xl sm:text-3xl">{title}</h2>
      <p className={`mt-3 max-w-2xl leading-relaxed ${mutedCls}`}>{body}</p>
    </>
  );
}

const tile = `group flex h-full items-center gap-3 rounded-2xl border ${lineCls} bg-white px-3.5 py-3 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-emerald-500/60 dark:bg-zinc-900/60 dark:hover:border-emerald-400/50`;

/** Every country. This is the crawl path from the tool into all 244 country
 * routes, and the fastest way for a reader to reach their own. */
export function CountryIndex({
  locale,
  countries,
}: {
  locale: Locale;
  countries: Country[];
}) {
  const p = getDict(locale).prayerPlaces;
  // Alphabetical in the reader's own language — "المغرب" does not sort where
  // "Morocco" does, and a list nobody can scan is not an index.
  const collator = new Intl.Collator(locale);
  const sorted = countries
    .map((country) => ({ country, name: countryName(locale, country.code) }))
    .sort((a, b) => collator.compare(a.name, b.name));

  return (
    <section id="countries" className="mt-16 scroll-mt-20 sm:mt-20">
      <IndexHeading eyebrow={p.hubEyebrow} title={p.hubTitle} body={p.hubIntro} />
      <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map(({ country, name }) => (
          <li key={country.code}>
            <Link href={localePath(locale, countryPath(country.slug))} className={tile}>
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full border border-emerald-700/20 font-mono text-[11px] font-semibold ${goldCls} dark:border-emerald-400/20`}
              >
                {country.code}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{name}</span>
                <span className={`block truncate text-xs ${mutedCls}`}>
                  {p.hubCities(country.count)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Every city in one country, largest first — population order is what a
 * reader scanning for their own city expects, and it puts the pages with the
 * most demand behind them nearest the top of the crawl. */
export function CityIndex({
  locale,
  country,
  cities,
}: {
  locale: Locale;
  country: Country;
  cities: City[];
}) {
  const p = getDict(locale).prayerPlaces;
  const name = countryName(locale, country.code);
  return (
    <section id="cities" className="mt-16 scroll-mt-20 sm:mt-20">
      <IndexHeading eyebrow={p.hubEyebrow} title={p.citiesIn(name)} body={p.citiesInBody(name)} />
      <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <li key={city.id}>
            <Link href={localePath(locale, cityPath(country.slug, city.slug))} className={tile}>
              <Star8 className={`size-3.5 shrink-0 ${goldCls}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {cityName(locale, city)}
                </span>
                <span className={`block truncate text-xs ${mutedCls}`}>
                  {city.region || p.population(city.pop)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The handful of cities nearest this one. Small, but it is what turns
 * 7,654 leaf pages into a connected region a crawler can walk. */
export function NearbyCities({
  locale,
  city,
  cities,
  countries,
}: {
  locale: Locale;
  city: City;
  cities: City[];
  countries: Map<string, Country>;
}) {
  if (cities.length === 0) return null;
  const p = getDict(locale).prayerPlaces;
  return (
    <nav className="mt-14" aria-label={p.nearby(cityName(locale, city))}>
      <h2 className="flex items-center gap-3 font-display text-lg">
        <Star8 className={`size-4 shrink-0 ${goldCls}`} />
        {p.nearby(cityName(locale, city))}
      </h2>
      <p className={`mt-2 text-sm ${mutedCls}`}>{p.nearbyBody}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {cities.map((near) => {
          const slug = countries.get(near.cc)?.slug;
          if (!slug) return null;
          return (
            <li key={near.id}>
              <Link
                href={localePath(locale, cityPath(slug, near.slug))}
                className={`inline-flex items-center gap-2 rounded-full border ${lineCls} px-4 py-2 text-sm transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
              >
                {cityName(locale, near)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ------------------------------------------------------------------ facts

/** The things about a place that are true whatever the date — coordinates,
 * the qibla bearing, the distance to Makkah, the method its mosques follow.
 *
 * They carry a fair share of the page's weight precisely because they never
 * go stale between rebuilds, and they answer questions ("which way do I face
 * in Casablanca?") that the timetable does not. */
export function PlaceFacts({
  title,
  rows,
}: {
  title: string;
  /** `ltr: true` for values that are ASCII identifiers whatever the page's
   * language — an IANA zone reads "Casablanca/Africa" if a right-to-left
   * paragraph is allowed to reorder it around the slash. */
  rows: { label: string; value: string; ltr?: boolean }[];
}) {
  return (
    <section className="mt-12">
      <h2 className="flex items-center gap-3 font-display text-xl">
        <Star8 className={`size-4 shrink-0 ${goldCls}`} />
        {title}
      </h2>
      <dl
        className={`mt-5 grid gap-px overflow-hidden rounded-2xl border bg-zinc-200 ${lineCls} sm:grid-cols-2 dark:bg-zinc-800`}
      >
        {rows.map((row) => (
          <div key={row.label} className="bg-white p-4 dark:bg-zinc-900/60">
            <dt className={`text-xs ${mutedCls}`}>{row.label}</dt>
            <dd className="mt-1.5 font-medium" dir={row.ltr ? "ltr" : undefined}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
