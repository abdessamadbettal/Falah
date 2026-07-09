import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { ToolJsonLd, toolMetadata } from "@/lib/tool-page";
import Client from "./client";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return toolMetadata(locale, "tafseer");
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <ToolJsonLd locale={locale} toolKey="tafseer" />
      <Client />
    </>
  );
}
