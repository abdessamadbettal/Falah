import { ABOUT_PATH, TOOL_PATHS } from "@/lib/seo";
import { LegacyRedirect, legacyMetadata } from "../legacy-redirect";

/** The site briefly served English unprefixed at the root (/zakat, /about);
 * those URLs now live under /en. Only the known legacy paths are generated —
 * anything else stays a 404. */
export function generateStaticParams() {
  return [...Object.values(TOOL_PATHS), ABOUT_PATH].map((path) => ({
    slug: [path.replace(/^\//, "")],
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return legacyMetadata(`/en/${slug[slug.length - 1]}`);
}

export default async function LegacyRootRedirect({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <LegacyRedirect target={`/en/${slug[slug.length - 1]}`} />;
}
