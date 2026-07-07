import type { Metadata } from "next";
import { RootShell } from "@/components/root-shell";
import { getDict } from "@/lib/i18n";
import { siteMetadata, siteViewport } from "@/lib/seo";
import "../globals.css";

export const metadata: Metadata = siteMetadata(getDict("en"));
export const viewport = siteViewport;

/** English is unprefixed at the site root ("/", "/zakat", ...) so it can be
 * both the hreflang "en" and "x-default" target. /fr and /ar live under
 * app/[locale]. */
export default function EnglishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootShell locale="en">{children}</RootShell>;
}
