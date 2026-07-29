/** Copy for the prerendered Quran routes — /quran/surah/…, /juz/…, /hizb/…
 * and /page/…. Kept apart from the reader's UI strings because almost all of
 * it is search-facing: titles, meta descriptions and body prose that Google
 * reads, not chrome. */
export const quranBrowse = {
  // ---- shared labels ----
  quran: "Quran",
  surah: "Surah",
  juz: "Juz",
  hizb: "Hizb",
  page: "Page",
  verses: "verses",
  verse: "Verse",
  meccan: "Meccan",
  medinan: "Medinan",
  readInReader: "Open in the interactive reader",
  listen: "Listen to this recitation",
  prev: "Previous",
  next: "Next",
  backToQuran: "All of the Quran",

  // ---- reader navigation ----
  navigate: "Navigate",
  browseBy: "Browse by",
  bySurah: "Surah",
  byJuz: "Juz",
  byHizb: "Hizb",
  byPage: "Page",
  translationList: "Translation, verse by verse",

  // ---- the hub: /quran ----
  hubSurahsTitle: "All 114 surahs",
  hubSurahsP:
    "Every surah of the Holy Quran, in order of the mushaf. Each one opens as a full page with the Uthmani Arabic, an English translation and verse-by-verse audio.",
  hubJuzTitle: "The 30 juz (para)",
  hubJuzP:
    "The Quran divided into its 30 juz — the reading portions used to complete the Quran across a month, especially in Ramadan.",
  hubHizbTitle: "The 60 hizb",
  hubHizbP: "Each juz split in two, for readers who track their daily portion by hizb.",
  hubPagesTitle: "All 604 mushaf pages",
  hubPagesP:
    "Every page of the standard Madani mushaf, numbered exactly as in print — useful for memorisation and for following along with a physical copy.",
  showAllPages: "Browse all 604 pages",

  // ---- surah pages ----
  // Titles stay under ~50 characters: the site template appends "— Falah.io",
  // and Google only shows about 60.
  surahTitle: (name: string, meaning: string, n: number) =>
    `Surah ${name} (${meaning}) — Quran chapter ${n}`,
  surahDesc: (
    translit: string,
    n: number,
    meaning: string,
    ayahs: number,
    revelation: string,
    juz: number,
  ) =>
    `Read Surah ${translit} — surah ${n} of the Quran, "${meaning}" — in Uthmani Arabic with an English translation. ${ayahs} verses, ${revelation}, begins in juz ${juz}. Free, no ads, no account.`,
  surahH1: (translit: string) => `Surah ${translit}`,
  surahIntro: (
    translit: string,
    n: number,
    meaning: string,
    ayahs: number,
    revelation: string,
    juz: number,
    page: number,
  ) =>
    `Surah ${translit} is the ${ordinal(n)} surah of the Quran. Its name means “${meaning}”. It is a ${revelation.toLowerCase()} surah of ${ayahs} verses, opening in juz ${juz} on page ${page} of the mushaf. Below is the full Arabic text in Uthmani script with an English translation for every verse.`,

  // ---- juz pages ----
  juzTitle: (n: number, name: string) => `Juz ${n} (${name}) — full text & translation`,
  juzDesc: (n: number, translit: string, from: string, to: string, ayahs: number) =>
    `Read juz ${n} of the Quran (${translit}), from ${from} to ${to} — ${ayahs} verses in Uthmani Arabic with an English translation and audio. Free, no ads, no account.`,
  juzH1: (n: number) => `Juz ${n}`,
  juzIntro: (n: number, translit: string, from: string, to: string, ayahs: number, surahs: number) =>
    `Juz ${n} — known as ${translit} after its opening words — is the ${ordinal(n)} of the Quran's 30 reading portions. It runs from ${from} to ${to}, covering ${ayahs} verses across ${surahs === 1 ? "one surah" : `${surahs} surahs`}. Reading one juz a day completes the Quran in a month.`,

  // ---- hizb pages ----
  hizbTitle: (n: number, juz: number) => `Hizb ${n} (Juz ${juz}) — full text & translation`,
  hizbDesc: (n: number, juz: number, from: string, to: string, ayahs: number) =>
    `Read hizb ${n} of the Quran, the ${n % 2 === 1 ? "first" : "second"} half of juz ${juz}, from ${from} to ${to} — ${ayahs} verses in Uthmani Arabic with an English translation.`,
  hizbH1: (n: number) => `Hizb ${n}`,
  hizbIntro: (n: number, juz: number, from: string, to: string, ayahs: number) =>
    `Hizb ${n} is the ${n % 2 === 1 ? "first" : "second"} half of juz ${juz}, one of the 60 hizb the Quran is divided into. It runs from ${from} to ${to} and contains ${ayahs} verses.`,

  // ---- mushaf page routes ----
  pageTitle: (n: number, surahs: string, juz: number) =>
    `Quran page ${n} — ${surahs}, juz ${juz}`,
  pageDesc: (n: number, juz: number, surahs: string, ayahs: number) =>
    `Read page ${n} of the Quran (${surahs}, juz ${juz}) exactly as printed in the Madani mushaf — ${ayahs} verses in Uthmani Arabic with an English translation and audio.`,
  pageH1: (n: number) => `Quran page ${n}`,
  pageIntro: (n: number, juz: number, surahs: string, ayahs: number) =>
    `Page ${n} of the standard 604-page Madani mushaf falls in juz ${juz} and contains ${ayahs} verses from ${surahs}. The page break matches the printed mushaf, so you can follow along with a physical copy or track a memorisation plan page by page.`,

  // ---- cross-links between the four views ----
  alsoIn: "Also in this part of the Quran",
  juzOfSurah: (n: number) => `Juz ${n}`,
  pageOfSurah: (n: number) => `Page ${n}`,
  surahsOnThisPage: "Surahs on this page",
  startsAt: "Starts at",
  ayahCount: (n: number) => `${n} ${n === 1 ? "verse" : "verses"}`,
};

function ordinal(n: number): string {
  const rest = n % 100;
  if (rest >= 11 && rest <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}
