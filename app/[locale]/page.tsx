import type { Metadata } from "next";
import { getDict, type Locale } from "@/lib/i18n";
import { JsonLd, homeJsonLd, pageMeta } from "@/lib/seo";
import HomeClient from "./home-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const d = getDict(locale);
  return pageMeta(locale, "", d.meta.siteTitle, d.meta.siteDescription);
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <>
      <JsonLd data={homeJsonLd(locale)} />
      <HomeClient />
    </>
  );
}
