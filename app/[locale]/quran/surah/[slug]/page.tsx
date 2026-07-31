import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RelatedUnits } from "@/components/quran-browse";
import { locales, type Locale } from "@/lib/i18n";
import { SURAHS, surahBySlug } from "@/lib/quran-meta";
import { buildQuranPage } from "@/lib/quran-page";
import { readingJsonLd } from "@/lib/quran-seo";
import { JsonLd, pageMeta } from "@/lib/seo";
import Client from "../../client";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => SURAHS.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = surahBySlug(slug);
  if (!s) return {};
  const p = await buildQuranPage(locale, "surah", s.n);
  return pageMeta(locale, p.path, p.title, p.description);
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const s = surahBySlug(slug);
  if (!s) notFound();
  const p = await buildQuranPage(locale, "surah", s.n);

  return (
    <>
      <JsonLd
        data={readingJsonLd({
          locale,
          path: p.path,
          name: p.title,
          description: p.description,
          crumb: p.crumb,
          isChapter: true,
          position: s.n,
        })}
      />
      <Client unit={p.unit} heading={p.heading}>
        <RelatedUnits locale={locale} links={p.related} />
      </Client>
    </>
  );
}
