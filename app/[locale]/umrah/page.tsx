import type { Locale } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";
import { TOOL_PATHS } from "@/lib/seo";
import { ToolJsonLd } from "@/lib/tool-page";
import type { Metadata } from "next";
import UmrahSimulatorClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).tools.umrah.meta;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `/${locale}${TOOL_PATHS.umrah}`,
      languages: {
        en: `/en${TOOL_PATHS.umrah}`,
        ar: `/ar${TOOL_PATHS.umrah}`,
        fr: `/fr${TOOL_PATHS.umrah}`,
      },
    },
  };
}

export default async function UmrahSimulatorPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <ToolJsonLd locale={locale} toolKey="umrah" />
      <UmrahSimulatorClient />
    </>
  );
}
