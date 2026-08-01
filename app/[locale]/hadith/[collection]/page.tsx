import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/faq";
import {
  AlsoKnownAs,
  ChapterIndex,
  Crumbs,
  HadithIndex,
  RelatedCollections,
  SourceNote,
} from "@/components/hadith-browse";
import { chapterHadiths } from "@/lib/hadith-build";
import {
  collectionBySlug,
  COLLECTIONS,
  collectionName,
  hasHadithPages,
} from "@/lib/hadith-meta";
import { buildCollectionPage } from "@/lib/hadith-page";
import { collectionJsonLd } from "@/lib/hadith-seo";
import { getDict, locales, type Locale } from "@/lib/i18n";
import { JsonLd, pageMeta } from "@/lib/seo";
import { ToolShell } from "@/components/ui";

type Props = { params: Promise<{ locale: Locale; collection: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => COLLECTIONS.map((c) => ({ locale, collection: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, collection } = await params;
  const meta = collectionBySlug(collection);
  if (!meta) return {};
  const p = await buildCollectionPage(locale, meta);
  return pageMeta(locale, p.path, p.title, p.description, p.keywords);
}

export default async function Page({ params }: Props) {
  const { locale, collection } = await params;
  const meta = collectionBySlug(collection);
  if (!meta) notFound();

  const p = await buildCollectionPage(locale, meta);
  const b = getDict(locale).hadithBrowse;
  const name = collectionName(locale, meta);

  // The "forty" collections have one kitab, so indexing their books would be a
  // list of one. They index their hadiths instead — which is also where their
  // per-hadith routes live.
  const perHadith = hasHadithPages(meta);
  const hadiths = perHadith ? await chapterHadiths(meta.key, p.chapters[0]?.n ?? 1) : [];

  return (
    <>
      <JsonLd
        data={collectionJsonLd({
          locale,
          collection: meta,
          description: p.description,
          total: p.total,
          chapters: p.chapters.map((c) => ({ n: c.n, title: c.title, count: c.count, slug: c.slug })),
          faq: p.faq,
        })}
      />
      <ToolShell
        icon={meta.icon}
        title={p.heading.title}
        side={p.heading.side}
        intro={p.heading.intro}
        above={<Crumbs locale={locale} trail={[{ href: "", label: name }]} />}
        wide
      >
        <AlsoKnownAs locale={locale} collection={meta} />
        {perHadith ? (
          <HadithIndex
            locale={locale}
            collection={meta}
            hadiths={hadiths.map((h) => ({
              n: h.n,
              excerpt: excerpt(locale === "ar" ? h.arabic : h.translation || h.arabic),
            }))}
            title={b.collectionBooksTitle(name)}
            body={b.collectionBooksP(p.chapters.length)}
          />
        ) : (
          <ChapterIndex
            locale={locale}
            collection={meta}
            chapters={p.chapters}
            title={b.collectionBooksTitle(name)}
            body={b.collectionBooksP(p.chapters.length)}
          />
        )}

        <Faq eyebrow={name} heading={b.faqH2} items={p.faq} />
        <RelatedCollections locale={locale} links={p.related} />
        <SourceNote locale={locale} />
      </ToolShell>
    </>
  );
}

/** A one-line taste of the hadith for the index rows. */
function excerpt(text: string, max = 130): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, clean.lastIndexOf(" ", max))}…`;
}
