import { places } from "@/lib/places";
import { countryPaths } from "@/lib/prayer-places";
import { PLACES_REVISION } from "@/lib/prayer-paths";
import { urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

/** The 244 country hubs — 732 URLs across the three locales.
 *
 * Split from the cities on purpose. These are the pages that decide whether
 * the 7,654 beneath them ever get crawled, and Search Console reports
 * indexing per sitemap: mixed into 23,000 city URLs their coverage would be a
 * rounding error, and a country that failed to index would be invisible. */
export async function GET() {
  return xmlResponse(urlsetXml(countryPaths(await places()), PLACES_REVISION));
}
