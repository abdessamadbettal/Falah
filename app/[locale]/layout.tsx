import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RootShell } from "@/components/root-shell";
import { getDict, isLocale, locales, type Locale } from "@/lib/i18n";
import { siteMetadata, siteViewport } from "@/lib/seo";
import "../globals.css";

/** The only route tree: every locale is served under its prefix (/en, /ar).
 * The bare root "/" (see app/(redirect)) just forwards to the visitor's
 * language. `dynamicParams = false` makes anything else a 404. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return siteMetadata(getDict(locale));
}

export const viewport = siteViewport;

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <RootShell locale={locale as Locale}>{children}</RootShell>;
}
