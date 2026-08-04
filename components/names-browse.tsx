/** Server-rendered furniture for the 99 name pages.
 *
 * Server-only on purpose, like components/quran-browse.tsx: every link into
 * the ninety-nine routes must exist in the HTML a crawler receives, and the
 * cited verses have to be text on the page rather than a fetch. None of this
 * ships JavaScript. */

import Link from "next/link";
import { Eyebrow, goldCls, lineCls, mutedCls, Star8 } from "@/components/ui";
import { getDict, localePath, type Locale } from "@/lib/i18n";
import { NAMES_OF_ALLAH, type DivineName } from "@/lib/names";
import { namePath, NAMES_PATH, nameTitleWord } from "@/lib/names-seo";
import type { ArticleSection } from "@/components/article";
import type { BuiltAyah } from "@/lib/quran-build";
import { SURAHS } from "@/lib/quran-meta";
import { surahName, surahPath } from "@/lib/quran-seo";

// ------------------------------------------------------------- the prose

/** Splits a paragraph on [[slug]] references and renders each as a link to
 * that name's page, labelled in the reader's own language.
 *
 * The wiki form rather than a markdown link is deliberate: content/names is
 * written once per locale, and a hard-coded /en/names-of-allah/... would be
 * wrong in two of the three. The slug is locale-independent; the label and
 * the path are resolved here. */
const REF = /\[\[([a-z0-9-]+)\]\]/g;

function withLinks(text: string, locale: Locale) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(REF)) {
    const target = NAMES_OF_ALLAH.find((n) => n.slug === m[1]);
    if (m.index > last) out.push(text.slice(last, m.index));
    last = m.index + m[0].length;
    if (!target) {
      // An unresolved reference is a typo in the content, not a crash: show
      // the slug so it is obvious in review rather than silently vanishing.
      out.push(m[1]);
      continue;
    }
    out.push(
      <Link
        key={`${m.index}-${target.slug}`}
        href={localePath(locale, namePath(target.slug))}
        className="font-medium text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 transition-colors hover:decoration-emerald-700 dark:text-emerald-400 dark:decoration-emerald-400/30 dark:hover:decoration-emerald-400"
      >
        {nameTitleWord(locale, target)}
      </Link>,
    );
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** The name's own prose, from content/names/<slug>/<locale>.md. */
export function NameArticle({
  locale,
  heading,
  sections,
}: {
  locale: Locale;
  heading: string;
  sections: ArticleSection[];
}) {
  const p = getDict(locale).namePage;
  return (
    <section className="mt-14">
      <Eyebrow>{p.meaningLabel}</Eyebrow>
      <h2 className="mt-5 font-display text-2xl sm:text-3xl">{heading}</h2>
      <div className="mt-8 max-w-3xl space-y-8">
        {sections.map((s) => (
          <div key={s.h}>
            <h3 className="font-display text-xl">{s.h}</h3>
            {s.p?.map((para, i) => (
              <p key={i} className={`mt-2 leading-relaxed ${mutedCls}`}>
                {withLinks(para, locale)}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// ------------------------------------------------------------- breadcrumb

export function NameCrumbs({ locale, word }: { locale: Locale; word: string }) {
  const d = getDict(locale);
  const items = [
    { name: d.tools.names.title, path: NAMES_PATH },
    { name: word, path: undefined as string | undefined },
  ];
  return (
    <nav aria-label={d.prayerPlaces.breadcrumb} className="mb-6">
      <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${mutedCls}`}>
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden="true" className="opacity-40 select-none">
                /
              </span>
            ) : null}
            {item.path ? (
              <Link
                href={localePath(locale, item.path)}
                className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-zinc-900 dark:text-zinc-100">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ------------------------------------------------------------ the verses

/** The verses that contain this name, in Arabic with the reader's translation.
 *
 * This is the part of the page that cannot be written from a template: the
 * ayat differ for every name, they are the evidence for what the name means,
 * and each one links into the Quran reader. Every reference here is checked
 * against the Arabic text at build time by scripts/verify-name-refs.mjs. */
export function NameVerses({
  locale,
  word,
  verses,
}: {
  locale: Locale;
  word: string;
  verses: BuiltAyah[];
}) {
  const p = getDict(locale).namePage;
  const isAr = locale === "ar";
  if (verses.length === 0) return null;

  return (
    <section className="mt-14">
      <Eyebrow>{p.inQuran(word)}</Eyebrow>
      <h2 className="mt-5 font-display text-2xl sm:text-3xl">{p.inQuran(word)}</h2>
      <p className={`mt-3 max-w-3xl leading-relaxed ${mutedCls}`}>
        {p.inQuranBody(word, verses.length)}
      </p>

      <ol className="mt-8 space-y-4">
        {verses.map((v) => {
          const meta = SURAHS[v.surah - 1];
          return (
            <li
              key={`${v.surah}:${v.ayah}`}
              className={`overflow-hidden rounded-2xl border ${lineCls} bg-white dark:bg-zinc-900/60`}
            >
              <div className="p-5">
                <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-[2.1]">
                  {v.arabic}
                </p>
                {isAr ? null : (
                  <p className={`mt-4 leading-relaxed ${mutedCls}`}>{v.translation}</p>
                )}
              </div>
              <div
                className={`flex flex-wrap items-center justify-between gap-3 border-t ${lineCls} px-5 py-3`}
              >
                <span className={`text-sm font-medium ${goldCls}`}>
                  {p.verseRef(surahName(locale, meta), v.surah, v.ayah)}
                </span>
                <Link
                  href={localePath(locale, surahPath(meta.slug))}
                  className={`text-xs ${mutedCls} transition-colors hover:text-emerald-700 dark:hover:text-emerald-400`}
                >
                  {p.readVerse} →
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** The honest alternative to the verses block, for the twenty-eight names the
 * Quran does not carry verbatim. Saying so is worth more than a verse that
 * does not contain the word. */
export function NameProvenance({ locale, word }: { locale: Locale; word: string }) {
  const p = getDict(locale).namePage;
  return (
    <section className="mt-14">
      <Eyebrow>{p.notInQuran(word)}</Eyebrow>
      <h2 className="mt-5 font-display text-2xl sm:text-3xl">{p.notInQuran(word)}</h2>
      <p className={`mt-4 max-w-3xl leading-relaxed ${mutedCls}`}>{p.notInQuranBody(word)}</p>
    </section>
  );
}

// ------------------------------------------------------------- the caveat

/** What the ninety-nine actually rest on. It costs a paragraph and it is the
 * difference between a devotional poster and something a reader can trust. */
export function NarrationNote({ locale }: { locale: Locale }) {
  const p = getDict(locale).namePage;
  return (
    <section className={`mt-14 rounded-2xl border ${lineCls} bg-zinc-50 p-6 dark:bg-zinc-900/60`}>
      <Eyebrow>{p.narrationEyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-xl">{p.narrationTitle}</h2>
      <p className={`mt-3 text-sm leading-relaxed ${mutedCls}`}>{p.narrationBody}</p>
    </section>
  );
}

// ------------------------------------------------------------ the sequence

/** The names on either side, so the ninety-nine read as one sequence a
 * reader — or a crawler — can walk end to end. */
export function NearbyNames({ locale, name }: { locale: Locale; name: DivineName }) {
  const p = getDict(locale).namePage;
  const i = NAMES_OF_ALLAH.indexOf(name);
  const around = [NAMES_OF_ALLAH[i - 2], NAMES_OF_ALLAH[i - 1], NAMES_OF_ALLAH[i + 1], NAMES_OF_ALLAH[i + 2]]
    .filter(Boolean)
    .filter((n) => n !== name);

  return (
    <nav className="mt-14" aria-label={p.related}>
      <h2 className="flex items-center gap-3 font-display text-lg">
        <Star8 className={`size-4 shrink-0 ${goldCls}`} />
        {p.related}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {around.map((n) => (
          <li key={n.slug}>
            <Link
              href={localePath(locale, namePath(n.slug))}
              className={`inline-flex items-center gap-2 rounded-full border ${lineCls} px-4 py-2 text-sm transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
            >
              {nameTitleWord(locale, n)}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={localePath(locale, NAMES_PATH)}
            className={`inline-flex items-center gap-2 rounded-full border border-emerald-700/30 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-400/30 dark:text-emerald-400 dark:hover:bg-emerald-500/10`}
          >
            {p.browseAll} →
          </Link>
        </li>
      </ul>
    </nav>
  );
}
