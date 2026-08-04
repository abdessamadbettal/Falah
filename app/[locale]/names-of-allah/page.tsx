import type { Metadata } from "next";
import { NarrationNote } from "@/components/names-browse";
import type { Locale } from "@/lib/i18n";
import { namesHubJsonLd } from "@/lib/names-seo";
import { JsonLd } from "@/lib/seo";
import { ToolJsonLd, toolMetadata } from "@/lib/tool-page";
import Client from "./client";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return toolMetadata(locale, "names");
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <ToolJsonLd locale={locale} toolKey="names" />
      {/* The 99 leaves declared as one closed set of terms — the clearest way
          to tell a search engine that the deeper routes exist and belong
          together. */}
      <JsonLd data={namesHubJsonLd(locale)} />
      <Client>
        <NarrationNote locale={locale} />
      </Client>
    </>
  );
}
