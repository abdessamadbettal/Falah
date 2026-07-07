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

/** The pre-i18n site served tools at /tools/<slug> (English only); English
 * now lives unprefixed at the root, so redirect straight there. */
export default async function LegacyToolRedirect({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <LegacyRedirect target={`/${slug[slug.length - 1]}`} />;
}
