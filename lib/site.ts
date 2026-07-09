/** Single source of truth for the project's identity. Everything that
 * builds an absolute URL (canonicals, hreflang, sitemap, JSON-LD, OG)
 * reads from here, so forks and preview deploys can rebrand with one
 * env var instead of a find-and-replace. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://falah.io";

export const GITHUB_URL = "https://github.com/abdessamadbettal/falah";

/** Google Analytics measurement ID. Set NEXT_PUBLIC_GA_ID to override per
 * deploy, or leave the default. Empty string disables analytics entirely. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
