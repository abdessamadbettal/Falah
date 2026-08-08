/** The XML behind the sitemap index and the six sitemaps it ties together.
 *
 * All seven sit at the site root on purpose. A sitemap only covers URLs at or
 * below its own directory, so a file at /sitemap/quran.xml could not legally
 * list /en/quran/… — it would need to be hand-submitted in Search Console to
 * be read at all. Root-level files have no such restriction. */

import { localePath, locales, type Locale } from "./i18n";
import { NAMES_REVISION } from "./names-seo";
import { PLACES_REVISION } from "./prayer-paths";
import { SITE_URL } from "./site";

export type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

/** One page, in every locale. Priorities are the caller's business. */
export type SitemapEntry = { path: string; priority: number; changeFrequency?: ChangeFreq };

/** Bump this when the content or the page template actually changes.
 *
 * It is deliberately a constant and not `new Date()`: stamping the build time
 * on all 5,679 URLs tells Google the entire Quran changed today, on every
 * deploy. Google spots a lastmod that is always "now", decides the signal is
 * noise, and then discounts it site-wide — including on the pages where it
 * would have been true. A date that only moves when something moved is worth
 * more than a fresh one that means nothing. */
export const CONTENT_REVISION = "2026-08-01";

/** The children of /sitemap.xml, in the order Search Console will list them.
 *
 * Each carries its own lastmod, because they revise on different clocks: the
 * Quran and hadith move when a template does, the place list when the world
 * does. One shared date would make four of the five lie every time the fifth
 * changed. */
export const SITEMAPS: { path: string; lastmod: string }[] = [
  { path: "/sitemap-site.xml", lastmod: CONTENT_REVISION },
  { path: "/sitemap-prayer-countries.xml", lastmod: PLACES_REVISION },
  { path: "/sitemap-prayer-cities.xml", lastmod: PLACES_REVISION },
  { path: "/sitemap-names.xml", lastmod: NAMES_REVISION },
  { path: "/sitemap-quran.xml", lastmod: CONTENT_REVISION },
  { path: "/sitemap-hadith.xml", lastmod: CONTENT_REVISION },
];

/** trailingSlash is on, so the canonical form carries the slash. A sitemap
 * listing the unslashed form would send Google through a 308 on every URL. */
const abs = (locale: Locale, path: string) => `${SITE_URL}${localePath(locale, path)}/`;

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Every entry once per locale, each carrying the full hreflang cluster —
 * the same set the pages themselves declare in <head>, x-default included. */
export function urlsetXml(entries: SitemapEntry[], lastmod: string): string {
  const body = entries
    .flatMap(({ path, priority, changeFrequency = "monthly" }) => {
      const alternates = [
        ...locales.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${esc(abs(l, path))}"/>`),
        `<xhtml:link rel="alternate" hreflang="x-default" href="${esc(abs("en", path))}"/>`,
      ].join("");
      return locales.map(
        (locale) =>
          `<url><loc>${esc(abs(locale, path))}</loc>${alternates}` +
          `<lastmod>${lastmod}</lastmod><changefreq>${changeFrequency}</changefreq>` +
          `<priority>${priority}</priority></url>`,
      );
    })
    .join("");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
    `xmlns:xhtml="http://www.w3.org/1999/xhtml">${body}</urlset>`
  );
}

export function sitemapIndexXml(children: readonly { path: string; lastmod: string }[]): string {
  const body = children
    .map(
      ({ path, lastmod }) =>
        `<sitemap><loc>${esc(`${SITE_URL}${path}`)}</loc><lastmod>${lastmod}</lastmod></sitemap>`,
    )
    .join("");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`
  );
}

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
