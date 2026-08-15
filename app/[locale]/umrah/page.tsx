import type { Locale } from "@/lib/arabic";
import { getDict } from "@/lib/arabic";
import { TOOL_PATHS } from "@/lib/seo";
import { ToolJsonLd } from "@/lib/tool-page";
import type { Metadata } from "next";
import UmrahSimulatorClient from "./client";

export function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Metadata {
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

export default function UmrahSimulatorPage({ params: { locale } }: { params: { locale: Locale } }) {
  return (
    <>
      <ToolJsonLd locale={locale} toolKey="umrah" />
      <UmrahSimulatorClient />
    </>
  );
}
