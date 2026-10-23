import { hadithPaths } from "@/lib/hadith-page";
import { CONTENT_REVISION, urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

/** The hub and 10 collections in every locale, then — in English and Arabic
 * only, the languages the text exists in — their ~400 books, the parts the
 * long ones are split into, and a page per hadith in the three Forty Hadith
 * collections. See HADITH_TEXT_LOCALES in lib/hadith-seo.ts. */
export async function GET() {
  return xmlResponse(urlsetXml(await hadithPaths(), CONTENT_REVISION));
}
