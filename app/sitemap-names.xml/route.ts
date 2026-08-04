import { namesPaths, NAMES_REVISION } from "@/lib/names-seo";
import { urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

/** The Asma ul Husna hub and its 99 names — 300 URLs across the three
 * locales.
 *
 * Its own file because it is its own body of content: a closed, finished set
 * that changes only when the prose is revised, unlike the place pages whose
 * numbers move daily. Search Console reports per sitemap, so keeping the 99
 * separate makes it obvious at a glance whether they are indexed. */
export function GET() {
  return xmlResponse(urlsetXml(namesPaths(), NAMES_REVISION));
}
