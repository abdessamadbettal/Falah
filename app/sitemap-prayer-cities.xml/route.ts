import { places } from "@/lib/places";
import { cityPaths } from "@/lib/prayer-places";
import { PLACES_REVISION } from "@/lib/prayer-paths";
import { urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

/** Every city with its own timetable — 7,654 places, 22,962 URLs across the
 * three locales.
 *
 * Comfortably inside the 50,000-URL and 50 MB limits a single sitemap is
 * allowed, so it stays one file. If the city selection in
 * scripts/fetch-cities.mjs ever grows past ~16,600 places this has to be
 * split, and the sitemap index is where the extra files would be listed. */
export async function GET() {
  return xmlResponse(urlsetXml(cityPaths(await places()), PLACES_REVISION));
}
