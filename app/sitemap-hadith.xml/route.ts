import { hadithPaths } from "@/lib/hadith-page";
import { urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

/** ~1,000 URLs per locale: 10 collections, their ~400 books, the parts the
 * long ones are split into, and a page per hadith in the three Forty Hadith
 * collections. */
export async function GET() {
  return xmlResponse(urlsetXml(await hadithPaths(), new Date().toISOString()));
}
