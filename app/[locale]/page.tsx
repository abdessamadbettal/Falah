import type { Metadata } from "next";
import { fetchCommunity } from "@/lib/github";
import type { Locale } from "@/lib/i18n";
import { HomeJsonLd, homeMetadata } from "@/lib/tool-page";
import HomeClient from "./home-client";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return homeMetadata(locale);
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const community = await fetchCommunity();
  return (
    <>
      <HomeJsonLd locale={locale} />
      <HomeClient community={community} />
    </>
  );
}
