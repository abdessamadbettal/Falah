import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Crumbs,
  PartLinks,
  RelatedCollections,
  SourceNote,
  UnitNav,
} from "@/components/hadith-browse";
import {
  chapterBySlug,
  collectionBySlug,
  COLLECTIONS,
  collectionName,
  hadithFromSlug,
  hasHadithPages,
} from "@/lib/hadith-meta";
import { buildChapterPage, buildHadithPage, unitsOf } from "@/lib/hadith-page";
import { chapterJsonLd, collectionPath, hadithJsonLd } from "@/lib/hadith-seo";
import { citation } from "@/lib/hadith-view";
import { getDict, localePath, locales, type Locale } from "@/lib/i18n";
import { JsonLd, pageMeta } from "@/lib/seo";
import Reader from "../../client";

type Props = { params: Promise<{ locale: Locale; collection: string; chapter: string }> };

/**
 * The named unit inside a collection.
 *
 * For the seven large collections that is a kitab ("book-of-belief"), and this
 * page is its first (often only) part. The three "forty" collections have a
 * single kitab, so indexing their chapters would be a list of one — for them
 * the segment is the hadith itself ("hadith-13"). Both are "the thing at this
 * place in this collection", which is what the URL says.
 */
export async function generateStaticParams() {
  const params: { locale: string; collection: string; chapter: string }[] = [];
  for (const c of COLLECTIONS) {
    const units = await unitsOf(c);
    for (const locale of locales) {
      for (const unit of units) {
        params.push({ locale, collection: c.slug, chapter: unit });
      }
    }
  }
  return params;
}

async function load(locale: Locale, slug: string, unit: string) {
  const collection = collectionBySlug(slug);
  if (!collection) return null;

  if (hasHadithPages(collection)) {
    const n = hadithFromSlug(unit);
    if (n === null) return null;
    return { kind: "hadith" as const, page: await buildHadithPage(locale, collection, n), collection };
  }

  // chapterBySlug returns null for an unknown slug and 0 for a real chapter —
  // Sahih Muslim's muqaddimah and Ibn Majah's Book of the Sunnah are both
  // chapter 0, so this has to test for null rather than falsiness.
  const n = chapterBySlug(collection.key, unit);
  if (n === null) return null;
  return { kind: "chapter" as const, page: await buildChapterPage(locale, collection, n, 1), collection };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, collection, chapter } = await params;
  const loaded = await load(locale, collection, chapter);
  if (!loaded?.page) return {};
  return pageMeta(
    locale,
    loaded.page.path,
    loaded.page.title,
    loaded.page.description,
    loaded.page.keywords,
  );
}

export default async function Page({ params }: Props) {
  const { locale, collection, chapter } = await params;
  const loaded = await load(locale, collection, chapter);
  if (!loaded?.page) notFound();

  const meta = loaded.collection;
  const b = getDict(locale).hadithBrowse;
  const name = collectionName(locale, meta);
  const up = { href: localePath(locale, collectionPath(meta.slug)), label: b.allBooks(name) };
  const crumbs = (
    <Crumbs
      locale={locale}
      trail={[
        { href: localePath(locale, collectionPath(meta.slug)), label: name },
        { href: "", label: loaded.page.crumb },
      ]}
    />
  );

  if (loaded.kind === "hadith") {
    const p = loaded.page;
    return (
      <>
        <JsonLd
          data={hadithJsonLd({
            locale,
            collection: meta,
            title: p.title,
            description: p.description,
            path: p.path,
            text: p.hadith.arabic,
            citation: citation(name, p.hadith.n),
            position: p.position,
          })}
        />
        <Reader
          icon={meta.icon}
          heading={p.heading}
          hadiths={[p.hadith]}
          collectionName={name}
          above={crumbs}
        >
          <UnitNav prev={p.prev} next={p.next} up={{ ...up, label: b.allBooks(name) }} />
          <RelatedCollections locale={locale} links={p.related} />
          <SourceNote locale={locale} />
        </Reader>
      </>
    );
  }

  const p = loaded.page;
  return (
    <>
      <JsonLd
        data={chapterJsonLd({
          locale,
          collection: meta,
          chapter: p.chapter,
          title: p.title,
          description: p.description,
          path: p.path,
        })}
      />
      <Reader
        icon={meta.icon}
        heading={p.heading}
        hadiths={p.hadiths}
        collectionName={name}
        above={crumbs}
      >
        <PartLinks
          locale={locale}
          collection={meta}
          unit={p.unit}
          part={p.part}
          parts={p.parts}
        />
        <UnitNav prev={p.prev} next={p.next} up={up} />
        <RelatedCollections locale={locale} links={p.related} />
        <SourceNote locale={locale} />
      </Reader>
    </>
  );
}
