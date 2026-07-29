import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RelatedUnits } from "@/components/quran-browse";
import { locales, type Locale } from "@/lib/i18n";
import { TOTAL_PAGES } from "@/lib/quran-meta";
import { buildQuranPage } from "@/lib/quran-page";
import { readingJsonLd } from "@/lib/quran-seo";
import { JsonLd, pageMeta } from "@/lib/seo";
import Client from "../../client";

type Props = { params: Promise<{ locale: Locale; page: string }> };

const valid = (n: number) => Number.isInteger(n) && n >= 1 && n <= TOTAL_PAGES;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    Array.from({ length: TOTAL_PAGES }, (_, i) => ({ locale, page: String(i + 1) })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, page } = await params;
  if (!valid(Number(page))) return {};
  const p = await buildQuranPage(locale, "page", Number(page));
  return pageMeta(locale, p.path, p.title, p.description);
}

export default async function Page({ params }: Props) {
  const { locale, page } = await params;
  const n = Number(page);
  if (!valid(n)) notFound();
  const p = await buildQuranPage(locale, "page", n);

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
