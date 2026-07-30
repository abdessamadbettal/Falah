/** Server-rendered link indexes for the hadith routes.
 *
 * The reading experience is the reader in app/[locale]/hadith/client.tsx;
 * these are the crawl paths into it. Deliberately server-only, and the few
 * glyphs are inline SVG rather than <Icon> — every link must exist in the HTML
 * a crawler receives, and none of this ships JavaScript. */

import Link from "next/link";
import { cardCls, goldCls, lineCls, mutedCls, Star8 } from "@/components/ui";
import type { ChapterEntry } from "@/lib/hadith-build";
import {
  chapterTitles,
  COLLECTIONS,
  type CollectionMeta,
  collectionAuthor,
  collectionName,
  collectionNames,
  hadithSlug,
  isSixBook,
  partCount,
} from "@/lib/hadith-meta";
import type { Link as NavLink } from "@/lib/hadith-page";
import { collectionPath, partPath, unitPath } from "@/lib/hadith-seo";
import { getDict, localePath, type Locale } from "@/lib/i18n";

const pill = `inline-flex items-center gap-2 rounded-full border ${lineCls} px-4 py-2 text-sm transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Points right in LTR, left in RTL — `rtl:rotate-180` on the caller. */
const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" className={className} {...stroke}>
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
);

const Caret = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" className={className} {...stroke}>
    <path d="m8 5 5 5-5 5" />
  </svg>
);

const Info = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" className={className} {...stroke}>
    <circle cx="10" cy="10" r="7.25" />
    <path d="M10 9v4.5M10 6.6v.01" />
  </svg>
);

/** Number in a hairline medallion — the recurring marker for "this is unit N",
 * used for both kitab numbers and hadith numbers. */
export function NumberMark({ n, className = "" }: { n: number | string; className?: string }) {
  return (
    <span
      className={`grid size-9 shrink-0 place-items-center rounded-full border border-emerald-700/20 font-mono text-xs font-semibold ${goldCls} dark:border-emerald-400/20 ${className}`}
    >
      {n}
    </span>
  );
}

function SectionHeading({ title, body }: { title: string; body?: string }) {
  return (
    <>
      <h2 className="flex items-center gap-3 font-display text-2xl sm:text-3xl">
        <Star8 className={`size-5 shrink-0 ${goldCls}`} />
        {title}
      </h2>
      {body ? <p className={`mt-3 max-w-2xl leading-relaxed ${mutedCls}`}>{body}</p> : null}
    </>
  );
}

/** "Sahih" / "Sunan" / "Muwatta" / "Forty Hadith" — says what kind of book
 * this is, which is what a reader actually wants to know at a glance. */
function KindBadge({ locale, collection }: { locale: Locale; collection: CollectionMeta }) {
  const b = getDict(locale).hadithBrowse;
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-700/25 bg-emerald-50/70 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-300">
      {b.kind[collection.kind]}
    </span>
  );
}

// -------------------------------------------------------------------- hub

function CollectionCard({
  locale,
  collection,
  hadiths,
  chapters,
}: {
  locale: Locale;
  collection: CollectionMeta;
  hadiths: number;
  chapters: number;
}) {
  const b = getDict(locale).hadithBrowse;
  const isAr = locale === "ar";
  return (
    <li>
      <Link
        href={localePath(locale, collectionPath(collection.slug))}
        className={`group flex h-full flex-col ${cardCls} p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-emerald-500/60 dark:hover:border-emerald-400/50`}
      >
        <div className="flex items-start justify-between gap-3">
          <KindBadge locale={locale} collection={collection} />
          {/* The opposite script, so each card carries both names */}
          <span
            lang={isAr ? "en" : "ar"}
            dir={isAr ? "ltr" : "rtl"}
            className={`min-w-0 text-end ${isAr ? "font-mono text-[11px] uppercase tracking-wider" : "font-arabic text-xl leading-tight"} ${goldCls}`}
          >
            {isAr ? collection.en.name : collection.ar.name}
          </span>
        </div>

        <h3 className="mt-4 font-display text-lg leading-snug">
          {collectionName(locale, collection)}
        </h3>
        <p className={`mt-1 text-sm ${mutedCls}`}>{collectionAuthor(locale, collection)}</p>

        <p className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${mutedCls}`}>
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
            {b.hadithCount(hadiths)}
          </span>
          <span aria-hidden="true">·</span>
          <span>{b.bookCount(chapters)}</span>
          {collection.died ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{b.died(collection.died.ah, collection.died.ce)}</span>
            </>
          ) : null}
        </p>

        <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          {b.openCollection}
          <Arrow className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </span>
      </Link>
    </li>
  );
}

/** Every collection, split into the canonical six and the rest. This is the
 * crawl path to all ten collection routes. */
export function CollectionDirectory({
  locale,
  totals,
}: {
  locale: Locale;
  totals: Map<string, { total: number; chapters: number }>;
}) {
  const b = getDict(locale).hadithBrowse;
  const groups = [
    { id: "six", title: b.hubSixTitle, body: b.hubSixP, members: COLLECTIONS.filter(isSixBook) },
    {
      id: "other",
      title: b.hubOtherTitle,
      body: b.hubOtherP,
      members: COLLECTIONS.filter((c) => !isSixBook(c)),
    },
  ];

  return (
    <div className="mt-16">
      {groups.map((group, i) => (
        <section
          key={group.id}
          id={group.id}
          className={i > 0 ? "mt-16 scroll-mt-20 sm:mt-20" : "scroll-mt-20"}
        >
          <SectionHeading title={group.title} body={group.body} />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.members.map((c) => {
              const stat = totals.get(c.key);
              return (
                <CollectionCard
                  key={c.key}
                  locale={locale}
                  collection={c}
                  hadiths={stat?.total ?? 0}
                  chapters={stat?.chapters ?? 0}
                />
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

// ------------------------------------------------------------- collection

/** Every kitab of a collection. The crawl path to each chapter route, and
 * genuinely the fastest way for a reader to find a book of hadith. */
export function ChapterIndex({
  locale,
  collection,
  chapters,
  title,
  body,
}: {
  locale: Locale;
  collection: CollectionMeta;
  chapters: (ChapterEntry & { title: string; slug: string })[];
  title: string;
  body: string;
}) {
  const b = getDict(locale).hadithBrowse;
  const isAr = locale === "ar";
  return (
    <section id="books" className="mt-16 scroll-mt-20 sm:mt-20">
      <SectionHeading title={title} body={body} />
      <ul className="mt-8 grid gap-2 sm:grid-cols-2">
        {chapters.map((c) => {
          const both = chapterTitles(collection.key, c.n);
          const parts = partCount(c.count);
          return (
            <li key={c.n}>
              <Link
                href={localePath(locale, unitPath(collection.slug, c.slug))}
                className={`flex h-full items-center gap-3 rounded-2xl border ${lineCls} bg-white px-3.5 py-3 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-emerald-500/60 dark:bg-zinc-900/60 dark:hover:border-emerald-400/50`}
              >
                <NumberMark n={c.n} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{c.title}</span>
                  <span className={`block truncate text-xs ${mutedCls}`}>
                    {b.hadithCount(c.count)} · {b.range(c.first, c.last)}
                    {parts > 1 ? ` · ${parts}` : ""}
                  </span>
                </span>
                {/* The Arabic kitab name, for readers of the English pages */}
                {isAr || !both ? null : (
                  <span lang="ar" dir="rtl" className="shrink-0 font-arabic text-base">
                    {both.ar}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The "forty" collections have a page per hadith rather than per kitab, so
 * their collection page indexes the hadiths themselves — with an excerpt, so
 * the list is readable rather than 42 identical rows. */
export function HadithIndex({
  locale,
  collection,
  hadiths,
  title,
  body,
}: {
  locale: Locale;
  collection: CollectionMeta;
  hadiths: { n: number; excerpt: string }[];
  title: string;
  body: string;
}) {
  return (
    <section id="hadiths" className="mt-16 scroll-mt-20 sm:mt-20">
      <SectionHeading title={title} body={body} />
      <ul className="mt-8 grid gap-2">
        {hadiths.map((h) => (
          <li key={h.n}>
            <Link
              href={localePath(locale, unitPath(collection.slug, hadithSlug(h.n)))}
              className={`flex h-full items-start gap-3 rounded-2xl border ${lineCls} bg-white px-3.5 py-3 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-emerald-500/60 dark:bg-zinc-900/60 dark:hover:border-emerald-400/50`}
            >
              <NumberMark n={h.n} />
              <span className={`min-w-0 flex-1 pt-1.5 text-sm leading-relaxed ${mutedCls}`}>
                {h.excerpt}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ------------------------------------------------------------- navigation

/** Visible breadcrumb. Mirrors the BreadcrumbList in the page's JSON-LD, so
 * what a reader sees and what a crawler is told are the same trail. */
export function Crumbs({ locale, trail }: { locale: Locale; trail: NavLink[] }) {
  const d = getDict(locale);
  const items = [{ href: localePath(locale, "/hadith"), label: d.tools.hadith.title }, ...trail];
  return (
    <nav aria-label={d.hadithBrowse.onThisPage} className={`mb-6 text-xs ${mutedCls}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-2">
            {i > 0 ? <Caret className="size-3 shrink-0 rtl:rotate-180" /> : null}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-zinc-700 dark:text-zinc-300">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Sequential prev/next. Real links, so a crawler can walk a whole collection
 * from any one of its pages. */
export function UnitNav({
  prev,
  next,
  up,
}: {
  prev: NavLink | null;
  next: NavLink | null;
  up: NavLink;
}) {
  return (
    <nav className={`mt-12 border-t ${lineCls} pt-6`} aria-label={up.label}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between">
        {prev ? (
          <Link href={prev.href} className={`${pill} min-w-0 sm:max-w-[45%]`}>
            <Arrow className="size-4 shrink-0 rotate-180 rtl:rotate-0" />
            <span className="truncate">{prev.label}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={next.href} className={`${pill} min-w-0 sm:max-w-[45%]`}>
            <span className="truncate">{next.label}</span>
            <Arrow className="size-4 shrink-0 rtl:rotate-180" />
          </Link>
        ) : (
          <span />
        )}
      </div>
      <p className="mt-5 text-center">
        <Link
          href={up.href}
          className="text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {up.label}
        </Link>
      </p>
    </nav>
  );
}

/** Every part of a long kitab, so parts 3..N are one hop from part 1 rather
 * than only reachable by walking. */
export function PartLinks({
  locale,
  collection,
  unit,
  part,
  parts,
}: {
  locale: Locale;
  collection: CollectionMeta;
  /** The kitab's slug — parts hang off it as /part-2, /part-3. */
  unit: string;
  part: number;
  parts: number;
}) {
  if (parts < 2) return null;
  const b = getDict(locale).hadithBrowse;
  return (
    <nav className="mt-10" aria-label={b.partOf(part, parts)}>
      <h2 className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}>
        {b.partOf(part, parts)}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {Array.from({ length: parts }, (_, i) => i + 1).map((p) => {
          const current = p === part;
          return (
            <li key={p}>
              {current ? (
                <span
                  aria-current="page"
                  className="block rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-1.5 text-center font-mono text-xs font-semibold text-emerald-700 dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  {p}
                </span>
              ) : (
                <Link
                  href={localePath(
                    locale,
                    p === 1 ? unitPath(collection.slug, unit) : partPath(collection.slug, unit, p),
                  )}
                  className={`block rounded-lg border ${lineCls} px-3 py-1.5 text-center font-mono text-xs transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
                >
                  {p}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Cross-links to the other collections — the same hadith is often recorded
 * by more than one compiler. */
export function RelatedCollections({ locale, links }: { locale: Locale; links: NavLink[] }) {
  if (links.length === 0) return null;
  const b = getDict(locale).hadithBrowse;
  return (
    <nav className="mt-14" aria-label={b.moreCollections}>
      <h2 className="flex items-center gap-3 font-display text-lg">
        <Star8 className={`size-4 shrink-0 ${goldCls}`} />
        {b.moreCollections}
      </h2>
      <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${mutedCls}`}>{b.moreCollectionsP}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={pill}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The other names this collection is cited by. Genuinely useful — a reader
 * arriving from a citation that says "Tirmizi" needs to know they are in the
 * right place — and it is also where the variant spellings people search for
 * live as real, visible copy rather than as a hidden keywords tag. */
export function AlsoKnownAs({
  locale,
  collection,
}: {
  locale: Locale;
  collection: CollectionMeta;
}) {
  const b = getDict(locale).hadithBrowse;
  // The first entry is the name already in the H1.
  const names = collectionNames(locale, collection).slice(1);
  if (names.length === 0) return null;
  return (
    <p className={`mt-6 text-sm ${mutedCls}`}>
      <span className="font-semibold">{b.alsoKnownAs}: </span>
      {names.map((n, i) => (
        <span key={n}>
          {i > 0 ? " · " : ""}
          <span lang={/[\u0600-\u06FF]/.test(n) ? "ar" : "en"}>{n}</span>
        </span>
      ))}
    </p>
  );
}

/** Where the text comes from, and the caveat about numbering. Shown on every
 * page that renders hadith text — a reader citing a hadith deserves to know. */
export function SourceNote({ locale }: { locale: Locale }) {
  const b = getDict(locale).hadithBrowse;
  return (
    <p
      className={`mt-10 flex items-start gap-2.5 rounded-2xl border ${lineCls} bg-zinc-50 p-4 text-xs leading-relaxed ${mutedCls} dark:bg-zinc-900/40`}
    >
      <Info className="mt-0.5 size-4 shrink-0" />
      {b.sourceNote}
    </p>
  );
}
