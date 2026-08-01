import { HADITH_PATH } from "@/lib/hadith-seo";
import { QURAN_PATH } from "@/lib/quran-seo";
import { ABOUT_PATH, TOOL_PATHS } from "@/lib/seo";
import { type SitemapEntry, urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

/** The site proper: the home page, the 16 tools and the about page — roughly
 * 54 URLs across the three locales. Small enough that Search Console reports
 * on it are actually readable, which is the whole point of the split.
 *
 * The Quran and hadith hubs are listed by their own sitemaps, alongside the
 * pages beneath them, so they are dropped here to avoid duplicate entries. */
export function GET() {
  const entries: SitemapEntry[] = [
    { path: "", priority: 1 },
    ...Object.values(TOOL_PATHS)
      .filter((p) => p !== QURAN_PATH && p !== HADITH_PATH)
      .map((path) => ({ path, priority: 0.9 })),
    { path: ABOUT_PATH, priority: 0.7 },
  ];

  return xmlResponse(urlsetXml(entries, new Date().toISOString()));
}
