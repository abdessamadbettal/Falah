import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RelatedUnits } from "@/components/quran-browse";
import { locales, type Locale } from "@/lib/i18n";
import { HIZB, hizbByNumber } from "@/lib/quran-meta";
import { buildQuranPage } from "@/lib/quran-page";
import { readingJsonLd } from "@/lib/quran-seo";
import { JsonLd, pageMeta } from "@/lib/seo";
import Client from "../../client";

type Props = { params: Promise<{ locale: Locale; hizb: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => HIZB.map((h) => ({ locale, hizb: String(h.n) })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, hizb } = await params;
  if (!hizbByNumber(Number(hizb))) return {};
  const p = await buildQuranPage(locale, "hizb", Number(hizb));
  return pageMeta(locale, p.path, p.title, p.description);
}

export default async function Page({ params }: Props) {
  const { locale, hizb } = await params;
  const n = Number(hizb);
  if (!hizbByNumber(n)) notFound();
  const p = await buildQuranPage(locale, "hizb", n);

  return (
    <>
      <JsonLd
        data={readingJsonLd({
          locale,
          path: p.path,
          name: p.title,
          description: p.description,
          crumb: p.crumb,
          position: n,
        })}
      />
      <Client unit={p.unit} heading={p.heading}>
        <RelatedUnits locale={locale} links={p.related} />
      </Client>
    </>
  );
}
