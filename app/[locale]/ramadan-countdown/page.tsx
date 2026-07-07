import type { Metadata } from "next";
import { getDict, type Locale } from "@/lib/i18n";
import { JsonLd, TOOL_PATHS, pageMeta, toolJsonLd } from "@/lib/seo";
import Client from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).tools.ramadan.meta;
  return pageMeta(locale, TOOL_PATHS.ramadan, m.title, m.description);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const m = getDict(locale).tools.ramadan.meta;
  return (
    <>
      <JsonLd data={toolJsonLd(locale, TOOL_PATHS.ramadan, m.title, m.description)} />
      <Client />
    </>
  );
}
