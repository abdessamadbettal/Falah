import { HADITH_PATH } from "@/lib/hadith-seo";
import { NAMES_PATH } from "@/lib/names-seo";
import { QURAN_PATH } from "@/lib/quran-seo";
import { ABOUT_PATH, TOOL_PATHS } from "@/lib/seo";
import { CONTENT_REVISION, type SitemapEntry, urlsetXml, xmlResponse } from "@/lib/sitemap";
import type { ToolKey } from "@/lib/seo";

/** The tools that carry the site's search demand — the four everyday needs a
 * Muslim looks up by name, plus the calculator that spikes every Ramadan. */
const FLAGSHIP: ToolKey[] = ["prayer", "qibla", "calendar", "ramadan", "zakat"];

/** Real tools with real queries behind them, just an order of magnitude less:
 * "hijri to gregorian", "mosque near me", "99 names of allah". */
const CORE: ToolKey[] = ["converter", "mosque", "tafseer", "names", "hisnul", "inheritance", "age"];

export const dynamic = "force-static";

/** The site proper: the home page, the 16 tools and the about page — 48 URLs
 * across the three locales. Small enough that Search Console reports on it
 * are actually readable, which is the whole point of the split.
 *
 * The Quran, hadith and Asma ul Husna hubs are listed by their own sitemaps,
 * alongside the pages beneath them, so they are dropped here to avoid
 * duplicate entries. */
export function GET() {
  const priorityOf = (key: ToolKey) =>
    FLAGSHIP.includes(key) ? 0.9 : CORE.includes(key) ? 0.8 : 0.6;

  const tools = (Object.keys(TOOL_PATHS) as ToolKey[])
    .filter(
      (key) =>
        TOOL_PATHS[key] !== QURAN_PATH &&
        TOOL_PATHS[key] !== HADITH_PATH &&
        TOOL_PATHS[key] !== NAMES_PATH,
    )
    .map((key) => ({ path: TOOL_PATHS[key], priority: priorityOf(key) }));

  const entries: SitemapEntry[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    ...tools,
    // Honest about what it is: nobody searches for a project's about page.
    { path: ABOUT_PATH, priority: 0.5, changeFrequency: "yearly" },
  ];

  return xmlResponse(urlsetXml(entries, CONTENT_REVISION));
}
