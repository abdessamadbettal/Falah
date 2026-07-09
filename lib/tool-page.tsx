import type { Metadata } from "next";
import { getDict, type Locale } from "@/lib/i18n";
import {
  ABOUT_PATH,
  JsonLd,
  TOOL_PATHS,
  aboutJsonLd,
  homeJsonLd,
  pageMeta,
  toolJsonLd,
  type ToolKey,
} from "@/lib/seo";

/** Shared metadata + JSON-LD builders. Every app/[locale] page is a thin,
 * mechanical wrapper over these — page files contain no logic of their own. */
export function toolMetadata(locale: Locale, key: ToolKey): Metadata {
  const m = getDict(locale).tools[key].meta;
  return pageMeta(locale, TOOL_PATHS[key], m.title, m.description);
}

export function ToolJsonLd({ locale, toolKey }: { locale: Locale; toolKey: ToolKey }) {
  const m = getDict(locale).tools[toolKey].meta;
  return <JsonLd data={toolJsonLd(locale, TOOL_PATHS[toolKey], m.title, m.description)} />;
}

export function homeMetadata(locale: Locale): Metadata {
  const d = getDict(locale);
  return pageMeta(locale, "", d.meta.siteTitle, d.meta.siteDescription);
}

export function HomeJsonLd({ locale }: { locale: Locale }) {
  return <JsonLd data={homeJsonLd(locale)} />;
}

export function aboutMetadata(locale: Locale): Metadata {
  const m = getDict(locale).about.meta;
  return pageMeta(locale, ABOUT_PATH, m.title, m.description);
}

export function AboutJsonLd({ locale }: { locale: Locale }) {
  return <JsonLd data={aboutJsonLd(locale)} />;
}
