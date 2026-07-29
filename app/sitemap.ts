import type { MetadataRoute } from "next";
import { localePath, locales } from "@/lib/i18n";
import { QURAN_PATH, quranPaths } from "@/lib/quran-seo";
import { ABOUT_PATH, TOOL_PATHS } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** next.config sets `trailingSlash: true`, so /en/zakat serves a redirect and
 * /en/zakat/ is the canonical. The sitemap has to list the canonical form —
 * otherwise every URL Google fetches from it bounces through a 308. */
const abs = (locale: (typeof locales)[number], path: string) =>
  `${SITE_URL}${localePath(locale, path)}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // The Quran hub is listed by quranPaths() with its own priority, so it is
  // dropped here to avoid a duplicate <url> entry.
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: ABOUT_PATH, priority: 0.7 },
    ...Object.values(TOOL_PATHS)
      .filter((p) => p !== QURAN_PATH)
      .map((path) => ({ path, priority: 0.8 })),
    // ~1,600 URLs: 114 surahs, 30 juz, 60 hizb and all 604 mushaf pages.
    ...quranPaths(),
  ];

  return pages.flatMap(({ path, priority }) =>
    locales.map((locale) => ({
      url: abs(locale, path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, abs(l, path)])),
      },
    })),
  );
}
