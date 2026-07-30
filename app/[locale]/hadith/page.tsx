import type { Metadata } from "next";
import { CollectionDirectory, SourceNote } from "@/components/hadith-browse";
import { Faq } from "@/components/faq";
import { collectionIndex, hadithRoster } from "@/lib/hadith-build";
import {
  chapterSlug,
  chapterTitles,
  COLLECTIONS,
  collectionAuthor,
  collectionName,
  collectionNames,
} from "@/lib/hadith-meta";
import { collectionPath, HADITH_PATH, hadithHubJsonLd, unitPath } from "@/lib/hadith-seo";
import { getDict, localePath, type Locale } from "@/lib/i18n";
import { faqJsonLd, JsonLd, pageMeta } from "@/lib/seo";
import Hub, { type SearchEntry } from "./hub-client";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getDict(locale).tools.hadith.meta;
  // The hub is the page that should answer "sahih bukhari online", so it
  // carries the name of every collection it links to.
  const keywords = COLLECTIONS.flatMap((c) => collectionNames(locale, c).slice(0, 2));
  return pageMeta(locale, HADITH_PATH, m.title, m.description, keywords);
}

/** Every collection and every kitab, as one flat list the hub search filters.
 * ~400 rows — small enough to ship whole, so the search needs no network. */
async function searchIndex(locale: Locale): Promise<SearchEntry[]> {
  const isAr = locale === "ar";
  const entries: SearchEntry[] = [];

  for (const c of COLLECTIONS) {
    entries.push({
      href: localePath(locale, collectionPath(c.slug)),
      label: collectionName(locale, c),
      sub: collectionAuthor(locale, c),
      // Every spelling the book is cited by, so "tirmizi", "abu dawood" and
      // "صحيح البخاري" all reach it from either locale.
      alt: collectionNames(locale, c).join(" "),
    });

    const index = await collectionIndex(c.key);
    for (const ch of index.chapters) {
      const both = chapterTitles(c.key, ch.n);
      if (!both) continue;
      entries.push({
        href: localePath(locale, unitPath(c.slug, chapterSlug(c.key, ch.n))),
        label: isAr ? both.ar : both.en,
        sub: collectionName(locale, c),
        alt: isAr ? both.en : both.ar,
      });
    }
  }
  return entries;
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const d = getDict(locale);
  const b = d.hadithBrowse;

  const roster = await hadithRoster();
  const totals = new Map(roster.map((r) => [r.key, { total: r.total, chapters: r.chapters }]));
  const grand = roster.reduce((n, c) => n + c.total, 0);

  return (
    <>
      {/* ItemList of all ten collections — the machine-readable map of the
          routes below, so the deeper pages are discoverable from the hub. */}
      <JsonLd data={hadithHubJsonLd(locale, new Map(roster.map((r) => [r.key, r.total])))} />
      <JsonLd data={faqJsonLd(b.hubFaq)} />

      <Hub
        heading={{
          title: d.tools.hadith.title,
          side: d.tools.hadith.side,
          intro: d.tools.hadith.intro,
        }}
        entries={await searchIndex(locale)}
        stat={b.hubStatsTitle(grand, COLLECTIONS.length)}
      >
        <CollectionDirectory locale={locale} totals={totals} />
        <Faq eyebrow={b.hadith} heading={b.faqH2} items={b.hubFaq} />
        <SourceNote locale={locale} />
      </Hub>
    </>
  );
}
