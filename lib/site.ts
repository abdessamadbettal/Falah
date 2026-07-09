/** Single source of truth for the project's identity. Everything that
 * builds an absolute URL (canonicals, hreflang, sitemap, JSON-LD, OG)
 * reads from here, so forks and preview deploys can rebrand with one
 * env var instead of a find-and-replace. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://falah.io";

export const GITHUB_URL = "https://github.com/abdessamadbettal/falah";
