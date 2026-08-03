import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/faq";
import { CityIndex, PlaceCrumbs } from "@/components/prayer-browse";
import { CountryToday } from "@/components/prayer-country";
import { ToolShell } from "@/components/ui";
import { getDict, locales, type Locale } from "@/lib/i18n";
import { cityName, countryName, places } from "@/lib/places";
import { countryRows } from "@/lib/prayer-board";
import { methodForCountry } from "@/lib/prayer-calc";
import { countryDescription, countryJsonLd, countryTitle } from "@/lib/prayer-places";
import { countryPath } from "@/lib/prayer-paths";
import { JsonLd, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; country: string }> };

/** How many cities the comparison table shows before the full index takes
 * over. Twelve rows is the most a phone can scroll without the table becoming
 * the page; everything else is one tap away in the index below it. */
const COMPARE = 12;

export async function generateStaticParams() {
  const all = await places();
  return locales.flatMap((locale) => all.countries.map((c) => ({ locale, country: c.slug })));
}

async function resolve(slug: string) {
  const all = await places();
  const country = all.countryBySlug.get(slug);
  if (!country) return null;
  return {
    country,
    cities: all.citiesByCountry.get(country.code) ?? [],
    method: methodForCountry(country.code),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country: slug } = await params;
  const found = await resolve(slug);
  if (!found) return {};
  return pageMeta(
    locale,
    countryPath(found.country.slug),
    countryTitle(locale, found.country),
    countryDescription(locale, found.country, found.cities),
  );
}

export default async function Page({ params }: Props) {
  const { locale, country: slug } = await params;
  const found = await resolve(slug);
  if (!found) notFound();
  const { country, cities, method } = found;

  const d = getDict(locale);
  const p = d.prayerPlaces;
  const name = countryName(locale, country.code);
  const path = countryPath(country.slug);
  const title = countryTitle(locale, country);
  const description = countryDescription(locale, country, cities);

  const compared = cities.slice(0, COMPARE).map((city) => ({
    slug: city.slug,
    name: cityName(locale, city),
    lat: city.lat,
    lng: city.lng,
    tz: city.tz,
  }));

  const faq = p.countryFaq(
    name,
    d.tools.prayer.methods[method],
    cities.length,
    cities[0] ? cityName(locale, cities[0]) : name,
  );

  return (
    <ToolShell
      icon="ph:mosque"
      title={p.countryH1(name)}
      side={d.tools.prayer.side}
      intro={p.countryIntro(name, cities.length)}
      wide
      above={<PlaceCrumbs locale={locale} trail={[{ name }]} />}
    >
      <JsonLd
        data={countryJsonLd({ locale, country, cities, path, title, description, faq })}
      />

      {/* Rendered from the build day so the table is in the HTML a crawler
          reads; the component recomputes it for the reader's today on mount. */}
      <CountryToday
        countrySlug={country.slug}
        countryName={name}
        cities={compared}
        method={method}
        initial={countryRows(compared, method)}
      />

      <CityIndex locale={locale} country={country} cities={cities} />

      <Faq eyebrow={p.faqEyebrow} heading={p.faqH2(name)} items={faq} />
    </ToolShell>
  );
}
