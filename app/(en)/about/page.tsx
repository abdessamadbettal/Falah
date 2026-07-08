import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { ABOUT_PATH, JsonLd, aboutJsonLd, pageMeta } from "@/lib/seo";
import Client from "@/app/[locale]/about/client";

const d = getDict("en");

export const metadata: Metadata = pageMeta("en", ABOUT_PATH, d.about.meta.title, d.about.meta.description);

export default function Page() {
  return (
    <>
      <JsonLd data={aboutJsonLd("en")} />
      <Client />
    </>
  );
}
