import { places } from "@/lib/places";
import { cityPaths } from "@/lib/prayer-places";
import { PLACES_REVISION } from "@/lib/prayer-paths";
import { urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

/** The indexed cities only — ~1,600 of the ~7,700 places with a timetable,
 * so ~6,400 URLs across the four locales. The rest render with `noindex` and
 * stay out of here; see `indexedCities` in lib/places.ts for the cut.
 *
 * Comfortably inside the 50,000-URL and 50 MB limits a single sitemap is
 * allowed, so it stays one file. */
export async function GET() {
  return xmlResponse(urlsetXml(cityPaths(await places()), PLACES_REVISION));
}
