import { quranPaths } from "@/lib/quran-seo";
import { CONTENT_REVISION, urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

/** 145 URLs per locale: the hub, 114 surahs and 30 juz. The hizb and mushaf
 * pages are noindex and left out — see lib/quran-seo.ts. */
export function GET() {
  return xmlResponse(urlsetXml(quranPaths(), CONTENT_REVISION));
}
