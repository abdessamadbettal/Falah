import { SITEMAPS, sitemapIndexXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

/** The index. robots.txt still points here, so a /sitemap.xml already
 * submitted to Search Console keeps working — it now hands over three
 * sitemaps instead of one list, and Console reports each separately. */
export function GET() {
  return xmlResponse(sitemapIndexXml(SITEMAPS, new Date().toISOString()));
}
