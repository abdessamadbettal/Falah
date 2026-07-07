import type { Metadata } from "next";
import { getDict, type Dict, type Locale } from "@/lib/i18n";
import { JsonLd, TOOL_PATHS, pageMeta, toolJsonLd } from "@/lib/seo";

type ToolKey = keyof Dict["tools"] & keyof typeof TOOL_PATHS;

/** Shared metadata + JSON-LD for a tool page, used by both the
 * app/(en)/<slug> pages (fixed locale="en") and app/[locale]/<slug> pages
 * (fr/ar) so the two trees can't drift apart. */
export function toolMetadata(locale: Locale, key: ToolKey): Metadata {
  const m = getDict(locale).tools[key].meta;
  return pageMeta(locale, TOOL_PATHS[key], m.title, m.description);
}

export function ToolJsonLd({ locale, toolKey }: { locale: Locale; toolKey: ToolKey }) {
  const m = getDict(locale).tools[toolKey].meta;
  return <JsonLd data={toolJsonLd(locale, TOOL_PATHS[toolKey], m.title, m.description)} />;
}
