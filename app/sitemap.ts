import type { MetadataRoute } from "next";
import { SITE_URL, localePath, locales } from "@/lib/i18n";
import { TOOL_PATHS } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...Object.values(TOOL_PATHS)];
  const lastModified = new Date();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}${localePath(l, path)}`]),
        ),
      },
    })),
  );
}
