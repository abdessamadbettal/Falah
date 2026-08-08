/** The URL shape of the prayer-times place tree, and nothing else.
 *
 *   /prayer-times                      the tool, and the index of countries
 *   /prayer-times/morocco              the country, and its cities
 *   /prayer-times/morocco/casablanca   one city
 *
 * Split out from lib/prayer-places.ts because client components need to build
 * these links too, and that module reaches for the place list on disk — one
 * `import` of a path helper would otherwise drag `node:fs` into the browser
 * bundle. Everything here is a pure string function. */

import { TOOL_PATHS } from "./seo";

export const PRAYER_PATH = TOOL_PATHS.prayer;

export const countryPath = (slug: string) => `${PRAYER_PATH}/${slug}`;
export const cityPath = (country: string, city: string) => `${PRAYER_PATH}/${country}/${city}`;

/** The <lastmod> the place sitemaps publish. Bump it when the city list or
 * the page template actually changes — not on every deploy.
 *
 * Deliberately a hand-maintained constant, for the reason CONTENT_REVISION
 * spells out: a lastmod that is always "now" across 23,700 URLs teaches
 * Google to ignore the site's lastmod everywhere, including where it is true.
 * `node scripts/fetch-cities.mjs` prints a content hash to tell you whether a
 * refresh of the GeoNames dump actually moved anything. */
export const PLACES_REVISION = "2026-08-03";
