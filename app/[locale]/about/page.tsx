import type { Metadata } from "next";
import { getDict, type Locale } from "@/lib/i18n";
import { ABOUT_PATH, JsonLd, aboutJsonLd, pageMeta } from "@/lib/seo";
import Client from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).about.meta;
  return pageMeta(locale, ABOUT_PATH, m.title, m.description);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <>
      <JsonLd data={aboutJsonLd(locale)} />
      <Client />
    </>
  );
}
