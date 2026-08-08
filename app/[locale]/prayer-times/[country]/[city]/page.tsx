import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/faq";
import { NearbyCities, PlaceCrumbs, PlaceFacts } from "@/components/prayer-browse";
import { PrayerBoard } from "@/components/prayer-board";
import { ToolShell } from "@/components/ui";
import { getDict, locales, type Locale } from "@/lib/i18n";
import { countryName, nearbyCities, places } from "@/lib/places";
import { buildBoard, todayIn } from "@/lib/prayer-board";
import {
  cityDescription,
  cityFacts,
  cityJsonLd,
  cityKeywords,
  cityTitle,
} from "@/lib/prayer-places";
import { cityPath, countryPath } from "@/lib/prayer-paths";
import { JsonLd, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; country: string; city: string }> };

export async function generateStaticParams() {
  const all = await places();
  return locales.flatMap((locale) =>
    all.cities.map((city) => ({
      locale,
      country: all.countryByCode.get(city.cc)?.slug ?? "",
      city: city.slug,
    })),
  );
}

async function resolve(countrySlug: string, citySlug: string) {
  const all = await places();
  const country = all.countryBySlug.get(countrySlug);
  if (!country) return null;
  const city = all.citiesByCountry.get(country.code)?.find((c) => c.slug === citySlug);
  if (!city) return null;
  return { all, country, city };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country: countrySlug, city: citySlug } = await params;
  const found = await resolve(countrySlug, citySlug);
  if (!found) return {};
  return pageMeta(
    locale,
    cityPath(found.country.slug, found.city.slug),
    cityTitle(locale, found.city),
    cityDescription(locale, found.city),
    cityKeywords(locale, found.city),
  );
}

export default async function Page({ params }: Props) {
  const { locale, country: countrySlug, city: citySlug } = await params;
  const found = await resolve(countrySlug, citySlug);
  if (!found) notFound();
  const { all, country, city } = found;

  const d = getDict(locale);
  const p = d.prayerPlaces;
  const facts = cityFacts(locale, city);
  const path = cityPath(country.slug, city.slug);
  const title = cityTitle(locale, city);
  const description = cityDescription(locale, city);
  const qibla = p.fromNorth(facts.qibla, p.compass[facts.compass]);

  const faq = p.cityFaq(
    facts.name,
    facts.country,
    city.tz,
    d.tools.prayer.methods[facts.method],
    qibla,
  );

  return (
    <ToolShell
      icon="ph:mosque"
      title={p.cityH1(facts.name)}
      side={d.tools.prayer.side}
      intro={p.cityIntro(facts.name, facts.country)}
      wide
      above={
        <PlaceCrumbs
          locale={locale}
          trail={[
            { name: countryName(locale, country.code), path: countryPath(country.slug) },
            { name: facts.name },
          ]}
        />
      }
    >
      <JsonLd data={cityJsonLd({ locale, city, country, path, title, description, faq })} />

      {/* The build day's timetable, so the page has real content in its HTML;
          the board recomputes it for the reader's today on mount. */}
      <PrayerBoard
        city={{ name: facts.name, lat: city.lat, lng: city.lng, tz: city.tz }}
        method={facts.method}
        initial={buildBoard(locale, city, facts.method, todayIn(city))}
      />

      <PlaceFacts
        title={p.factsTitle(facts.name)}
        rows={[
          { label: p.coordinates, value: facts.coords },
          { label: p.timezone, value: city.tz, ltr: true },
          { label: p.qiblaDirection, value: qibla },
          { label: p.toMakkah, value: p.km(facts.makkahKm) },
          { label: p.method, value: d.tools.prayer.methods[facts.method] },
          ...(city.region ? [{ label: p.region, value: city.region }] : []),
        ]}
      />

      <NearbyCities
        locale={locale}
        city={city}
        cities={nearbyCities(all, city)}
        countries={all.countryByCode}
      />

      <Faq eyebrow={p.faqEyebrow} heading={p.faqH2(facts.label)} items={faq} />
    </ToolShell>
  );
}
