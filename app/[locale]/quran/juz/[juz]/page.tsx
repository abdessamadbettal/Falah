import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RelatedUnits } from "@/components/quran-browse";
import { locales, type Locale } from "@/lib/i18n";
import { JUZ, juzByNumber } from "@/lib/quran-meta";
import { buildQuranPage } from "@/lib/quran-page";
import { readingJsonLd } from "@/lib/quran-seo";
import { JsonLd, pageMeta } from "@/lib/seo";
import Client from "../../client";

type Props = { params: Promise<{ locale: Locale; juz: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => JUZ.map((j) => ({ locale, juz: String(j.n) })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, juz } = await params;
  if (!juzByNumber(Number(juz))) return {};
  const p = await buildQuranPage(locale, "juz", Number(juz));
  return pageMeta(locale, p.path, p.title, p.description);
}

export default async function Page({ params }: Props) {
  const { locale, juz } = await params;
  const n = Number(juz);
  if (!juzByNumber(n)) notFound();
  const p = await buildQuranPage(locale, "juz", n);

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
