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
  partFromSlug,
  partSlug,
} from "@/lib/hadith-meta";
import { buildChapterPage, partsOf } from "@/lib/hadith-page";
import { chapterJsonLd, collectionPath } from "@/lib/hadith-seo";
import { getDict, localePath, locales, type Locale } from "@/lib/i18n";
import { JsonLd, pageMeta } from "@/lib/seo";
import Reader from "../../../client";

type Props = {
  params: Promise<{ locale: Locale; collection: string; chapter: string; part: string }>;
};

/** Parts 2..N of a kitab too long to serve as one page. Part 1 lives at the
 * parent route, so a kitab that fits on one page never gains a /part-2. */
export async function generateStaticParams() {
  const params: { locale: string; collection: string; chapter: string; part: string }[] = [];
  for (const c of COLLECTIONS) {
    const parts = await partsOf(c);
    for (const locale of locales) {
      for (const { unit, part } of parts) {
        params.push({ locale, collection: c.slug, chapter: unit, part: partSlug(part) });
      }
    }
  }
  return params;
}

async function load(locale: Locale, slug: string, chapter: string, part: string) {
  const collection = collectionBySlug(slug);
  if (!collection) return null;
  const n = chapterBySlug(collection.key, chapter);
  // partFromSlug rejects anything below 2: part 1 is the parent route, and
  // serving it here too would duplicate a canonical page under a second URL.
  const p = partFromSlug(part);
  if (n === null || p === null) return null;
  const page = await buildChapterPage(locale, collection, n, p);
  return page ? { page, collection } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, collection, chapter, part } = await params;
  const loaded = await load(locale, collection, chapter, part);
  if (!loaded) return {};
  return pageMeta(
    locale,
    loaded.page.path,
    loaded.page.title,
    loaded.page.description,
    loaded.page.keywords,
  );
}

export default async function Page({ params }: Props) {
  const { locale, collection, chapter, part } = await params;
  const loaded = await load(locale, collection, chapter, part);
  if (!loaded) notFound();

  const { page: p, collection: meta } = loaded;
  const b = getDict(locale).hadithBrowse;
  const name = collectionName(locale, meta);

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
        above={
          <Crumbs
            locale={locale}
            trail={[
              { href: localePath(locale, collectionPath(meta.slug)), label: name },
              { href: "", label: `${p.crumb} · ${b.partOf(p.part, p.parts)}` },
            ]}
          />
        }
      >
        <PartLinks
          locale={locale}
          collection={meta}
          unit={p.unit}
          part={p.part}
          parts={p.parts}
        />
        <UnitNav
          prev={p.prev}
          next={p.next}
          up={{ href: localePath(locale, collectionPath(meta.slug)), label: b.allBooks(name) }}
        />
        <RelatedCollections locale={locale} links={p.related} />
        <SourceNote locale={locale} />
      </Reader>
    </>
  );
}
