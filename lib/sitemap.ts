/** The XML behind the sitemap index and the three sitemaps it ties together.
 *
 * All four sit at the site root on purpose. A sitemap only covers URLs at or
 * below its own directory, so a file at /sitemap/quran.xml could not legally
 * list /en/quran/… — it would need to be hand-submitted in Search Console to
 * be read at all. Root-level files have no such restriction. */

import { localePath, locales, type Locale } from "./i18n";
import { SITE_URL } from "./site";

/** One page, in every locale. Priorities are the caller's business. */
export type SitemapEntry = { path: string; priority: number };

/** The children of /sitemap.xml, in the order Search Console will list them. */
export const SITEMAPS = [
  "/sitemap-site.xml",
  "/sitemap-quran.xml",
  "/sitemap-hadith.xml",
] as const;

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
    .flatMap(({ path, priority }) => {
      const alternates = [
        ...locales.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${esc(abs(l, path))}"/>`),
        `<xhtml:link rel="alternate" hreflang="x-default" href="${esc(abs("en", path))}"/>`,
      ].join("");
      return locales.map(
        (locale) =>
          `<url><loc>${esc(abs(locale, path))}</loc>${alternates}` +
          `<lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq>` +
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

export function sitemapIndexXml(paths: readonly string[], lastmod: string): string {
  const body = paths
    .map((p) => `<sitemap><loc>${esc(`${SITE_URL}${p}`)}</loc><lastmod>${lastmod}</lastmod></sitemap>`)
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
