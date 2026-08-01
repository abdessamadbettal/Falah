/** Assembles one Quran route: the verses to read, the copy that wraps them,
 * and the links out to the other three views of the same text.
 *
 * Every route family (/surah, /juz, /hizb, /page) is the same page with a
 * different slice, so the slicing and the wording live here rather than being
 * repeated four times. */

import { getDict, localePath, type Locale } from "./i18n";
import { quranText } from "./quran-build";
import { HIZB, JUZ, SURAHS, TOTAL_PAGES } from "./quran-meta";
import type { BrowseMode, ReaderUnit } from "./quran-reader";
import {
  hizbPath,
  juzName,
  juzPath,
  mushafPath,
  shortSurahList,
  surahListLabel,
  surahName,
  surahMeaning,
  surahPath,
  verseRef,
} from "./quran-seo";

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const toArabicNum = (n: number) =>
  String(n)
    .split("")
    .map((c) => AR_DIGITS[Number(c)] ?? c)
    .join("");

export type QuranPage = {
  unit: ReaderUnit;
  /** What the tool shell shows: H1, the opposite-script ornament, intro prose. */
  heading: { title: string; side: string; intro: string };
  /** <title> and <meta name="description">. */
  title: string;
  description: string;
  crumb: string;
  /** Cross-links to the same passage seen as juz / hizb / page / surah. */
  related: { href: string; label: string }[];
  path: string;
};

export async function buildQuranPage(
  locale: Locale,
  mode: BrowseMode,
  n: number,
): Promise<QuranPage> {
  const b = getDict(locale).quranBrowse;
  const text = await quranText(locale);
  const ayahs =
    mode === "surah"
      ? (text.bySurah.get(n) ?? [])
      : mode === "juz"
        ? (text.byJuz.get(n) ?? [])
        : mode === "hizb"
          ? (text.byHizb.get(n) ?? [])
          : (text.byPage.get(n) ?? []);

  const unit: ReaderUnit = { mode, n, ayahs, edition: text.edition };
  const first = ayahs[0];
  const last = ayahs.at(-1);
  const from = first ? verseRef(locale, first.surah, first.ayah) : "";
  const to = last ? verseRef(locale, last.surah, last.ayah) : "";
  const surahNumbers = [...new Set(ayahs.map((a) => a.surah))];
  const juzNumbers = [...new Set(ayahs.map((a) => a.juz))];
  const hizbNumbers = [...new Set(ayahs.map((a) => a.hizb))];
  const pageNumbers = [...new Set(ayahs.map((a) => a.page))];

  const link = (href: string, label: string) => ({ href: localePath(locale, href), label });
  const surahLinks = surahNumbers.map((s) =>
    link(surahPath(SURAHS[s - 1].slug), `${b.surah} ${surahName(locale, SURAHS[s - 1])}`),
  );
  const juzLinks = juzNumbers.map((j) => link(juzPath(j), `${b.juz} ${j}`));
  const hizbLinks = hizbNumbers.map((h) => link(hizbPath(h), `${b.hizb} ${h}`));
  // A long surah touches dozens of pages; a handful is enough of a crawl path.
  const pageLinks = pageNumbers.slice(0, 12).map((p) => link(mushafPath(p), `${b.page} ${p}`));

  if (mode === "surah") {
    const s = SURAHS[n - 1];
    const name = surahName(locale, s);
    const meaning = surahMeaning(locale, s);
    const revelation = s.revelation === "Meccan" ? b.meccan : b.medinan;
    return {
      unit,
      path: surahPath(s.slug),
      crumb: `${b.surah} ${name}`,
      title: b.surahTitle(name, meaning, s.n),
      description: b.surahDesc(name, s.n, meaning, s.ayahs, revelation, s.juz),
      heading: {
        title: b.surahH1(name),
        side: locale === "ar" ? s.translit : s.arabic,
        intro: b.surahIntro(name, s.n, meaning, s.ayahs, revelation, s.juz, s.page),
      },
      related: [...juzLinks, ...hizbLinks, ...pageLinks],
    };
  }

  if (mode === "juz") {
    const j = JUZ[n - 1];
    const name = juzName(locale, n);
    return {
      unit,
      path: juzPath(n),
      crumb: `${b.juz} ${n}`,
      title: b.juzTitle(n, name),
      description: b.juzDesc(n, name, from, to, ayahs.length),
      heading: {
        title: b.juzH1(n),
        side: locale === "ar" ? j.translit : j.arabic,
        intro: b.juzIntro(n, name, from, to, ayahs.length, surahNumbers.length),
      },
      related: [...surahLinks, ...hizbLinks],
    };
  }

  if (mode === "hizb") {
    const h = HIZB[n - 1];
    return {
      unit,
      path: hizbPath(n),
      crumb: `${b.hizb} ${n}`,
      title: b.hizbTitle(n, h.juz),
      description: b.hizbDesc(n, h.juz, from, to, ayahs.length),
      heading: {
        title: b.hizbH1(n),
        side: locale === "ar" ? `Hizb ${n}` : JUZ[h.juz - 1].arabic,
        intro: b.hizbIntro(n, h.juz, from, to, ayahs.length),
      },
      related: [link(juzPath(h.juz), `${b.juz} ${h.juz}`), ...surahLinks],
    };
  }

  const juz = first?.juz ?? 1;
  return {
    unit,
    path: mushafPath(n),
    crumb: `${b.page} ${n}`,
    title: b.pageTitle(n, shortSurahList(locale, surahNumbers), juz),
    description: b.pageDesc(n, juz, surahListLabel(locale, surahNumbers), ayahs.length),
    heading: {
      title: b.pageH1(n),
      side: locale === "ar" ? `Page ${n} / ${TOTAL_PAGES}` : `﴿ ${toArabicNum(n)} ﴾`,
      intro: b.pageIntro(n, juz, surahListLabel(locale, surahNumbers), ayahs.length),
    },
    related: [...juzLinks, ...hizbLinks, ...surahLinks],
  };
}
