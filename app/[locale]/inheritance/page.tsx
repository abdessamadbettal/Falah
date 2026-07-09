import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getToolArticle } from "@/lib/articles";
import { ToolJsonLd, toolMetadata } from "@/lib/tool-page";
import Client from "./client";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return toolMetadata(locale, "inheritance");
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <ToolJsonLd locale={locale} toolKey="inheritance" />
      {/* the long-form guide is markdown in content/tools/inheritance/, parsed at build */}
      <Client article={getToolArticle("inheritance", locale)} />
    </>
  );
}
