import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { JsonLd, homeJsonLd, pageMeta } from "@/lib/seo";
import HomeClient from "@/app/[locale]/home-client";

const d = getDict("en");

export const metadata: Metadata = pageMeta("en", "", d.meta.siteTitle, d.meta.siteDescription);

export default function Home() {
  return (
    <>
      <JsonLd data={homeJsonLd("en")} />
      <HomeClient />
    </>
  );
}
