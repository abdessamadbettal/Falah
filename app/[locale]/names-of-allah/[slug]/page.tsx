import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/faq";
import {
  NameArticle,
  NameCrumbs,
  NameProvenance,
  NameVerses,
  NarrationNote,
  NearbyNames,
} from "@/components/names-browse";
import { goldCls, lineCls, mutedCls, StarField, ToolShell } from "@/components/ui";
import { getNameArticle } from "@/lib/articles";
import { getDict, locales, type Locale } from "@/lib/i18n";
import { NAMES_OF_ALLAH } from "@/lib/names";
import {
  nameBySlug,
  nameIndex,
  nameJsonLd,
  nameMeaning,
  namePath,
  nameRefs,
  nameTitleWord,
} from "@/lib/names-seo";
import { quranText } from "@/lib/quran-build";
import { JsonLd, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => NAMES_OF_ALLAH.map((n) => ({ locale, slug: n.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const name = nameBySlug(slug);
  if (!name) return {};
  const p = getDict(locale).namePage;
  const word = nameTitleWord(locale, name);
  const meaning = nameMeaning(locale, name);
  return pageMeta(
    locale,
    namePath(name.slug),
    p.metaTitle(word, meaning),
    p.metaDescription(word, name.arabic, meaning),
    p.keywords(word, name.arabic),
  );
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const name = nameBySlug(slug);
  if (!name) notFound();

  const d = getDict(locale);
  const p = d.namePage;
  const word = nameTitleWord(locale, name);
  const meaning = nameMeaning(locale, name);
  const position = nameIndex(name) + 1;
  const refs = nameRefs(name.slug);

  // The cited verses, pulled from the same in-memory Quran the reader routes
  // use — Arabic plus this locale's translation, no client fetch.
  const { ayahs } = await quranText(locale);
  const verses = refs
    .map(([surah, ayah]) => ayahs.find((a) => a.surah === surah && a.ayah === ayah))
    .filter((a) => a !== undefined);

  const article = getNameArticle(name.slug, locale);
  const faq = p.faq(word, name.arabic, meaning, position, verses.length);
  const isAr = locale === "ar";

  return (
    <ToolShell
      icon="ph:sparkle"
      title={p.h1(word)}
      side={isAr ? name.transliteration : name.arabic}
      intro={article?.summary ?? meaning}
      above={<NameCrumbs locale={locale} word={word} />}
    >
      <JsonLd
        data={nameJsonLd({
          locale,
          name,
          path: namePath(name.slug),
          title: p.metaTitle(word, meaning),
          description: p.metaDescription(word, name.arabic, meaning),
          faq,
        })}
      />

      {/* the name itself, framed like a mihrab arch */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-700/20 bg-emerald-50/50 p-8 text-center dark:border-emerald-400/15 dark:bg-emerald-500/5">
        <StarField className="pointer-events-none absolute inset-0 size-full text-emerald-800/[0.05] dark:text-emerald-400/[0.06]" />
        <p className={`relative font-mono text-xs ${mutedCls}`}>{p.number(position)}</p>
        <p lang="ar" dir="rtl" className={`relative mt-4 font-arabic text-6xl sm:text-7xl ${goldCls}`}>
          {name.arabic}
        </p>
        {isAr ? null : (
          <p className="relative mt-4 font-display text-2xl">{name.transliteration}</p>
        )}
        <p className={`relative mt-2 ${mutedCls}`}>{meaning}</p>
      </div>

      {/* the facts a reader may want to quote, and a crawler to parse */}
      <dl
        className={`mt-8 grid gap-px overflow-hidden rounded-2xl border bg-zinc-200 ${lineCls} sm:grid-cols-3 dark:bg-zinc-800`}
      >
        {[
          { label: p.arabicLabel, value: name.arabic, ar: true },
          { label: p.transliterationLabel, value: name.transliteration, ar: false },
          { label: p.numberLabel, value: p.number(position), ar: false },
        ].map((row) => (
          <div key={row.label} className="bg-white p-4 dark:bg-zinc-900/60">
            <dt className={`text-xs ${mutedCls}`}>{row.label}</dt>
            <dd
              className={`mt-1.5 font-medium ${row.ar ? "font-arabic text-xl" : ""}`}
              lang={row.ar ? "ar" : undefined}
              dir={row.ar ? "rtl" : undefined}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {article?.sections.length ? (
        <NameArticle
          locale={locale}
          heading={`${word} — ${meaning}`}
          sections={article.sections}
        />
      ) : null}

      {verses.length ? (
        <NameVerses locale={locale} word={word} verses={verses} />
      ) : (
        <NameProvenance locale={locale} word={word} />
      )}

      <NearbyNames locale={locale} name={name} />

      <NarrationNote locale={locale} />

      <Faq eyebrow={p.faqEyebrow} heading={p.faqH2(word)} items={faq} />
    </ToolShell>
  );
}
