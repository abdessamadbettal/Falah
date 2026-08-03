import type { Metadata } from "next";
import { CountryIndex } from "@/components/prayer-browse";
import type { Locale } from "@/lib/i18n";
import { places } from "@/lib/places";
import { placesHubJsonLd } from "@/lib/prayer-places";
import { JsonLd } from "@/lib/seo";
import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "./client";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return toolMetadata(locale, "prayer");
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const { countries } = await places();

  return (
    <>
      <ToolJsonLd locale={locale} toolKey="prayer" />
      {/* The 244 country links below, declared for machines too — this is the
          hub's job in the crawl, and an ItemList states it outright. */}
      <JsonLd data={placesHubJsonLd(locale, countries)} />
      <Client>
        <CountryIndex locale={locale} countries={countries} />
      </Client>
    </>
  );
}
