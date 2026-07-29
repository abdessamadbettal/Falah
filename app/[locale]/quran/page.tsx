import type { Metadata } from "next";
import { QuranDirectory } from "@/components/quran-browse";
import { getDict, type Locale } from "@/lib/i18n";
import { buildQuranPage } from "@/lib/quran-page";
import { quranHubJsonLd } from "@/lib/quran-seo";
import { JsonLd } from "@/lib/seo";
import { toolMetadata } from "@/lib/tool-page";
import Client from "./client";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return toolMetadata(locale, "quran");
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const d = getDict(locale);
  // The hub opens on Al-Fatiha, but keeps the tool's own title and intro —
  // it is the Quran landing page, not a surah page.
  const p = await buildQuranPage(locale, "surah", 1);

  return (
    <>
      {/* Book + ItemList — the machine-readable map of every surah and juz
          route, so the deeper pages are discoverable from the hub alone. */}
      <JsonLd data={quranHubJsonLd(locale)} />
      <Client
        unit={p.unit}
        heading={{ title: d.tools.quran.title, side: d.tools.quran.side, intro: d.tools.quran.intro }}
      >
        <QuranDirectory locale={locale} />
      </Client>
    </>
  );
}
