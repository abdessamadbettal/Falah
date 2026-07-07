import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RootShell } from "@/components/root-shell";
import { getDict, isLocale, locales, type Locale } from "@/lib/i18n";
import { siteMetadata, siteViewport } from "@/lib/seo";
import "../globals.css";

/** English is served unprefixed at the site root (see app/(en)/layout.tsx);
 * this tree only handles the prefixed locales. */
const PREFIXED_LOCALES = locales.filter((l) => l !== "en");

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

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
