/** Assembles one hadith route: the hadiths to read, the copy that wraps them,
 * and the links out to the neighbouring units.
 *
 * The three route families (/hadith/[collection], .../[chapter] and its parts,
 * and .../[n] for a single hadith) are the same page with a different slice,
 * so the slicing and the wording live here rather than being repeated three
 * times. Server-only — it reads the build cache. */

import { bareArabic } from "./arabic";
import { type ChapterEntry, chapterHadiths, collectionIndex, type Hadith } from "./hadith-build";
import {
  chapterCount,
  chapterSlug,
  chapterTitle,
  chapterTitles,
  collectionAuthor,
  COLLECTIONS,
  collectionName,
  collectionNames,
  type CollectionMeta,
  hadithSlug,
  hasHadithPages,
  isSixBook,
  PER_PAGE,
  partCount,
} from "./hadith-meta";
import { collectionPath, HADITH_PATH, partPath, unitPath } from "./hadith-seo";
import { getDict, localePath, type Locale } from "./i18n";

export type Link = { href: string; label: string };

/** What every hadith route hands the shell: the H1, the opposite-script
 * ornament, and the intro prose — built from the same strings the <title>
 * and meta description use, so the two can never drift. */
export type Heading = { title: string; side: string; intro: string };

const excerptOf = (h: Hadith | undefined, locale: Locale, max = 90): string => {
  const raw = locale === "ar" ? bareArabic(h?.arabic ?? "") : (h?.translation ?? h?.arabic ?? "");
  const text = raw.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max))}…`;
};

const era = (locale: Locale, c: CollectionMeta): string => {
  const b = getDict(locale).hadithBrowse;
  return c.died ? b.died(c.died.ah, c.died.ce) : b.kind[c.kind];
};

/** Links to the other collections. Every page below the hub carries a few, so
 * no collection is ever more than two hops from any other. */
function otherCollections(locale: Locale, current: CollectionMeta, limit = 6): Link[] {
  const rest = COLLECTIONS.filter((c) => c.key !== current.key);
  // Lead with the canonical six — they are what a reader is most likely to
  // want next, and they are the pages worth passing authority to.
  const ordered = [...rest].sort((a, b) => Number(isSixBook(b)) - Number(isSixBook(a)));
  return ordered.slice(0, limit).map((c) => ({
    href: localePath(locale, collectionPath(c.slug)),
    label: collectionName(locale, c),
  }));
}

// ------------------------------------------------------------- collection

export type CollectionPage = {
  collection: CollectionMeta;
  total: number;
  chapters: (ChapterEntry & { title: string; slug: string })[];
  heading: Heading;
  title: string;
  description: string;
  path: string;
  faq: { q: string; a: string }[];
  /** The names this collection answers to, for the keywords tag and the
   * visible "also known as" line. */
  keywords: string[];
  related: Link[];
};

export async function buildCollectionPage(
  locale: Locale,
  collection: CollectionMeta,
): Promise<CollectionPage> {
  const b = getDict(locale).hadithBrowse;
  const index = await collectionIndex(collection.key);
  const name = collectionName(locale, collection);
  const author = collectionAuthor(locale, collection);
  const books = chapterCount(collection.key);

  return {
    collection,
    total: index.total,
    chapters: index.chapters.map((c) => ({
      ...c,
      title: chapterTitle(locale, collection.key, c.n),
      slug: chapterSlug(collection.key, c.n),
    })),
    heading: {
      title: b.collectionH1(name),
      side: locale === "ar" ? collection.en.name : collection.ar.name,
      intro: b.collectionIntro(
        name,
        author,
        index.total,
        books,
        era(locale, collection),
        b.kindNote[collection.kind],
      ),
    },
    title: b.collectionTitle(name, index.total),
    description: b.collectionDesc(name, author, index.total, books),
    path: collectionPath(collection.slug),
    faq: b.collectionFaq(name, author, index.total, books),
    keywords: [...collectionNames(locale, collection), b.hadith, b.collections],
    related: otherCollections(locale, collection),
  };
}

// ---------------------------------------------------------------- chapter

export type ChapterPage = {
  collection: CollectionMeta;
  chapter: number;
  chapterTitle: string;
  /** This kitab's URL segment — parts hang off it. */
  unit: string;
  hadiths: Hadith[];
  /** 1-based; `parts` is 1 for every chapter short enough to fit one page. */
  part: number;
  parts: number;
  heading: Heading;
  title: string;
  description: string;
  crumb: string;
  path: string;
  keywords: string[];
  /** Sequential navigation: the other parts of this chapter, then the
   * neighbouring chapters. */
  prev: Link | null;
  next: Link | null;
  related: Link[];
};

export async function buildChapterPage(
  locale: Locale,
  collection: CollectionMeta,
  chapter: number,
  part: number,
): Promise<ChapterPage | null> {
  const b = getDict(locale).hadithBrowse;
  const index = await collectionIndex(collection.key);
  const entry = index.chapters.find((c) => c.n === chapter);
  const title = chapterTitle(locale, collection.key, chapter);
  if (!entry || !title) return null;

  const parts = partCount(entry.count);
  if (part < 1 || part > parts) return null;

  const all = await chapterHadiths(collection.key, chapter);
  const hadiths = all.slice((part - 1) * PER_PAGE, part * PER_PAGE);
  if (hadiths.length === 0) return null;

  const name = collectionName(locale, collection);
  const author = collectionAuthor(locale, collection);
  const unit = chapterSlug(collection.key, chapter);
  const both = chapterTitles(collection.key, chapter);
  const path = part === 1 ? unitPath(collection.slug, unit) : partPath(collection.slug, unit, part);
  // The range is of *this page*, not the whole chapter — a part that claims
  // the chapter's full range would be describing hadiths it does not show.
  const range = b.range(hadiths[0].n, hadiths.at(-1)!.n);

  const at = (n: number) => index.chapters.find((c) => c.n === n);
  const chapterLink = (n: number, label: string): Link | null => {
    const target = at(n);
    if (!target) return null;
    const t = chapterTitle(locale, collection.key, n);
    const s = chapterSlug(collection.key, n);
    return t && s
      ? { href: localePath(locale, unitPath(collection.slug, s)), label: `${label} · ${t}` }
      : null;
  };
  const partLink = (p: number, label: string): Link => ({
    href: localePath(
      locale,
      p === 1 ? unitPath(collection.slug, unit) : partPath(collection.slug, unit, p),
    ),
    label: `${label} · ${b.partOf(p, parts)}`,
  });

  const order = index.chapters.map((c) => c.n);
  const here = order.indexOf(chapter);

  return {
    collection,
    chapter,
    chapterTitle: title,
    unit,
    hadiths,
    part,
    parts,
    heading: {
      title: b.chapterH1(title),
      // The other script's name for *this kitab* — more use to the reader than
      // repeating the collection, and it puts "كتاب الإيمان" on the page.
      side: (locale === "ar" ? both?.en : both?.ar) ?? collection.ar.name,
      // Part 1 is the kitab's own page, so it opens by describing the whole
      // kitab and only then mentions that it runs on. Parts 2+ say where they
      // sit, because arriving on one out of context is otherwise baffling.
      intro:
        part > 1
          ? b.chapterIntroPart(name, title, chapter, part, parts, range)
          : b.chapterIntro(name, title, chapter, entry.count, range, author) +
            (parts > 1 ? ` ${b.splitNote(parts)}` : ""),
    },
    // The clean title belongs to part 1 — it is the canonical page for "sahih
    // bukhari book of belief", and appending "part 1" to it would spend the
    // most valuable words in the <title> on a detail nobody searches for.
    title: part > 1 ? b.chapterTitlePart(name, title, part) : b.chapterTitle(name, title),
    // The description does name the part, including on part 1: it describes
    // what is on *this* page, and a split kitab shows 50 of its hadiths here.
    description:
      parts > 1
        ? b.chapterDescPart(name, title, chapter, part, parts, range)
        : b.chapterDesc(name, title, chapter, entry.count, range),
    crumb: title,
    path,
    // The kitab in both scripts plus the collection's common names: a reader
    // looking for this page types "bukhari kitab al-iman" or "كتاب الإيمان"
    // at least as often as they type its English title.
    keywords: [
      ...new Set(
        [
          title,
          ...(both ? [both.ar, both.en] : []),
          ...collectionNames(locale, collection).slice(0, 4),
          b.hadith,
        ].filter(Boolean),
      ),
    ],
    prev:
      part > 1
        ? partLink(part - 1, b.prevPart)
        : here > 0
          ? chapterLink(order[here - 1], b.prevBook)
          : null,
    next:
      part < parts
        ? partLink(part + 1, b.nextPart)
        : here >= 0 && here < order.length - 1
          ? chapterLink(order[here + 1], b.nextBook)
          : null,
    related: otherCollections(locale, collection, 4),
  };
}

// ----------------------------------------------------------- single hadith

export type HadithPage = {
  collection: CollectionMeta;
  hadith: Hadith;
  position: number;
  total: number;
  heading: Heading;
  title: string;
  description: string;
  crumb: string;
  path: string;
  excerpt: string;
  keywords: string[];
  prev: Link | null;
  next: Link | null;
  related: Link[];
};

/** One hadith of a "forty" collection. The large collections would be ~36,000
 * pages, so their hadiths are anchored inside their chapter instead. */
export async function buildHadithPage(
  locale: Locale,
  collection: CollectionMeta,
  n: number,
): Promise<HadithPage | null> {
  if (!hasHadithPages(collection)) return null;
  const b = getDict(locale).hadithBrowse;
  const index = await collectionIndex(collection.key);
  const chapter = index.chapters[0];
  if (!chapter) return null;

  const all = await chapterHadiths(collection.key, chapter.n);
  const at = all.findIndex((h) => h.n === n);
  if (at === -1) return null;
  const hadith = all[at];

  const name = collectionName(locale, collection);
  const author = collectionAuthor(locale, collection);
  const excerpt = excerptOf(hadith, locale);
  const link = (i: number, label: string): Link | null =>
    all[i]
      ? {
          href: localePath(locale, unitPath(collection.slug, hadithSlug(all[i].n))),
          label: `${label} · ${b.numbered(all[i].n)}`,
        }
      : null;

  return {
    collection,
    hadith,
    position: at + 1,
    total: all.length,
    heading: {
      title: b.hadithH1(n),
      side: locale === "ar" ? collection.en.name : collection.ar.name,
      intro: b.hadithIntro(name, n, all.length, author),
    },
    title: b.hadithTitle(name, n),
    description: b.hadithDesc(name, n, excerpt),
    crumb: b.numbered(n),
    path: unitPath(collection.slug, hadithSlug(n)),
    excerpt,
    keywords: [...collectionNames(locale, collection).slice(0, 5), b.numbered(n), b.hadith],
    prev: link(at - 1, b.prevHadith),
    next: link(at + 1, b.nextHadith),
    related: otherCollections(locale, collection, 4),
  };
}

// ------------------------------------------------------------------ params

/** Every numbered unit under a collection: a kitab for the large books, one
 * hadith for each of the "forty" collections. Drives both
 * `generateStaticParams` and the sitemap, so the two can never disagree. */
export async function unitsOf(collection: CollectionMeta): Promise<string[]> {
  const index = await collectionIndex(collection.key);
  if (hasHadithPages(collection)) {
    const first = index.chapters[0];
    if (!first) return [];
    return (await chapterHadiths(collection.key, first.n)).map((h) => hadithSlug(h.n));
  }
  return index.chapters.map((c) => chapterSlug(collection.key, c.n)).filter(Boolean);
}

/** Parts 2..N of every chapter long enough to be split. */
export async function partsOf(
  collection: CollectionMeta,
): Promise<{ unit: string; part: number }[]> {
  if (hasHadithPages(collection)) return [];
  const index = await collectionIndex(collection.key);
  return index.chapters.flatMap((c) => {
    const unit = chapterSlug(collection.key, c.n);
    if (!unit) return [];
    return Array.from({ length: partCount(c.count) - 1 }, (_, i) => ({ unit, part: i + 2 }));
  });
}

/** Every hadith URL the site publishes, for the sitemap. */
export async function hadithPaths(): Promise<{ path: string; priority: number }[]> {
  const paths: { path: string; priority: number }[] = [{ path: HADITH_PATH, priority: 0.9 }];
  for (const c of COLLECTIONS) {
    paths.push({ path: collectionPath(c.slug), priority: 0.8 });
    for (const unit of await unitsOf(c)) {
      paths.push({ path: unitPath(c.slug, unit), priority: 0.7 });
    }
    for (const { unit, part } of await partsOf(c)) {
      paths.push({ path: partPath(c.slug, unit, part), priority: 0.5 });
    }
  }
  return paths;
}
