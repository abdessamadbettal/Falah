import { TOOL_PATHS } from "@/lib/seo";
import { LegacyRedirect, legacyMetadata } from "../../legacy-redirect";

export function generateStaticParams() {
  return Object.values(TOOL_PATHS).map((path) => ({
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
  return legacyMetadata(`/${slug[slug.length - 1]}`);
}

/** English tool pages moved from /en/<slug> to the unprefixed /<slug>. */
export default async function LegacyEnToolRedirect({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <LegacyRedirect target={`/${slug[slug.length - 1]}`} />;
}
