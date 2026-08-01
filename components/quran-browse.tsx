/** Server-rendered link indexes for the Quran routes.
 *
 * The reading experience itself is the interactive reader; these are the
 * crawl paths into it. Deliberately server-only — every link must exist in
 * the HTML a crawler receives, and none of this ships JavaScript. */

import Link from "next/link";
import { goldCls, lineCls, mutedCls, Star8 } from "@/components/ui";
import { getDict, localePath, type Locale } from "@/lib/i18n";
import { HIZB, JUZ, SURAHS, TOTAL_PAGES } from "@/lib/quran-meta";
import {
  hizbPath,
  juzName,
  juzPath,
  mushafPath,
  surahMeaning,
  surahName,
  surahPath,
} from "@/lib/quran-seo";

/** The same passage seen as juz, hizb, mushaf page and surah. Real links, so
 * the four views of the Quran are reachable from one another. */
export function RelatedUnits({
  locale,
  links,
}: {
  locale: Locale;
  links: { href: string; label: string }[];
}) {
  if (links.length === 0) return null;
  const b = getDict(locale).quranBrowse;
  return (
    <nav className="mt-10" aria-label={b.alsoIn}>
      <h2 className="flex items-center gap-3 font-display text-lg">
        <Star8 className={`size-4 shrink-0 ${goldCls}`} />
        {b.alsoIn}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={`inline-flex items-center gap-2 rounded-full border ${lineCls} px-4 py-2 text-sm transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ---------------------------------------------------------------- indexes

function IndexHeading({ title, body }: { title: string; body: string }) {
  return (
    <>
      <h2 className="flex items-center gap-3 font-display text-2xl sm:text-3xl">
        <Star8 className={`size-5 shrink-0 ${goldCls}`} />
        {title}
      </h2>
      <p className={`mt-3 max-w-2xl leading-relaxed ${mutedCls}`}>{body}</p>
    </>
  );
}

/** All 114 surahs. This is the crawl path to every surah route, and it is
 * genuinely the fastest way for a reader to find one too. */
export function SurahIndex({ locale }: { locale: Locale }) {
  const b = getDict(locale).quranBrowse;
  const isAr = locale === "ar";
  return (
    <section id="surahs" className="scroll-mt-20">
      <IndexHeading title={b.hubSurahsTitle} body={b.hubSurahsP} />
      <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {SURAHS.map((s) => (
          <li key={s.slug}>
            <Link
              href={localePath(locale, surahPath(s.slug))}
              className={`group flex h-full items-center gap-3 rounded-2xl border ${lineCls} bg-white px-3.5 py-3 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-emerald-500/60 dark:bg-zinc-900/60 dark:hover:border-emerald-400/50`}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full border border-emerald-700/20 font-mono text-xs font-semibold ${goldCls} dark:border-emerald-400/20`}
              >
                {s.n}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {surahName(locale, s)}
                </span>
                <span className={`block truncate text-xs ${mutedCls}`}>
                  {isAr ? b.ayahCount(s.ayahs) : `${surahMeaning(locale, s)} · ${b.ayahCount(s.ayahs)}`}
                </span>
              </span>
              {isAr ? null : (
                <span lang="ar" dir="rtl" className="shrink-0 font-arabic text-lg">
                  {s.arabic.replace(/^سُورَةُ\s*/, "")}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function JuzIndex({ locale }: { locale: Locale }) {
  const b = getDict(locale).quranBrowse;
  const isAr = locale === "ar";
  return (
    <section id="juz" className="mt-16 scroll-mt-20 sm:mt-20">
      <IndexHeading title={b.hubJuzTitle} body={b.hubJuzP} />
      <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {JUZ.map((j) => (
          <li key={j.n}>
            <Link
              href={localePath(locale, juzPath(j.n))}
              className={`flex h-full items-center gap-3 rounded-2xl border ${lineCls} bg-white px-3.5 py-3 transition-colors hover:border-emerald-500/60 dark:bg-zinc-900/60 dark:hover:border-emerald-400/50`}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full border border-emerald-700/20 font-mono text-xs font-semibold ${goldCls} dark:border-emerald-400/20`}
              >
                {j.n}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {b.juz} {j.n} · {juzName(locale, j.n)}
                </span>
                <span className={`block truncate text-xs ${mutedCls}`}>
                  {b.startsAt} {surahName(locale, SURAHS[j.start[0] - 1])} {j.start[0]}:{j.start[1]}
                </span>
              </span>
              {isAr ? null : (
                <span lang="ar" dir="rtl" className={`shrink-0 font-arabic text-lg ${goldCls}`}>
                  {j.arabic}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HizbIndex({ locale }: { locale: Locale }) {
  const b = getDict(locale).quranBrowse;
  return (
    <section id="hizb" className="mt-16 scroll-mt-20 sm:mt-20">
      <IndexHeading title={b.hubHizbTitle} body={b.hubHizbP} />
      <ul className="mt-8 flex flex-wrap gap-2">
        {HIZB.map((h) => (
          <li key={h.n}>
            <Link
              href={localePath(locale, hizbPath(h.n))}
              className={`inline-flex items-center gap-2 rounded-full border ${lineCls} px-4 py-2 text-sm transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
            >
              <span className="font-semibold">
                {b.hizb} {h.n}
              </span>
              <span className={`font-mono text-xs ${mutedCls}`}>
                {h.start[0]}:{h.start[1]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 604 links, collapsed behind a <details> — still in the HTML, so every
 * mushaf page is one hop from the hub without swamping the layout. */
export function PageIndex({ locale }: { locale: Locale }) {
  const b = getDict(locale).quranBrowse;
  return (
    <section id="pages" className="mt-16 scroll-mt-20 sm:mt-20">
      <IndexHeading title={b.hubPagesTitle} body={b.hubPagesP} />
      <details className={`mt-8 rounded-2xl border ${lineCls} p-4`}>
        <summary className="cursor-pointer text-sm font-semibold">{b.showAllPages}</summary>
        <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1.5">
          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
            <li key={n}>
              <Link
                href={localePath(locale, mushafPath(n))}
                className={`block rounded-lg border ${lineCls} py-1.5 text-center font-mono text-xs transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
              >
                {n}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

/** Everything the hub renders below the interactive reader. */
export function QuranDirectory({ locale }: { locale: Locale }) {
  return (
    <div className="mt-20">
      <SurahIndex locale={locale} />
      <JuzIndex locale={locale} />
      <HizbIndex locale={locale} />
      <PageIndex locale={locale} />
    </div>
  );
}
