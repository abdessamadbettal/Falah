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
  return legacyMetadata(`/en/${slug[slug.length - 1]}`);
}

/** The pre-i18n site served tools at /tools/<slug> (English only); English
 * now lives under /en, so redirect there. */
export default async function LegacyToolRedirect({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <LegacyRedirect target={`/en/${slug[slug.length - 1]}`} />;
}
