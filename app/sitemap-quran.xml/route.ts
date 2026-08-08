import { quranPaths } from "@/lib/quran-seo";
import { CONTENT_REVISION, urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

/** ~1,600 URLs per locale: the hub, 114 surahs, 30 juz, 60 hizb and all 604
 * mushaf pages. Kept apart from the site sitemap so a crawl problem in the
 * mushaf pages can't hide behind the handful of pages that earn traffic. */
export function GET() {
  return xmlResponse(urlsetXml(quranPaths(), CONTENT_REVISION));
}
