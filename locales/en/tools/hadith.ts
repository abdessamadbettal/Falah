export const hadith = {
  meta: {
    title: "Hadith collections — Sahih al-Bukhari, Muslim & the Sunan",
    description:
      "Read over 36,000 hadiths from the six canonical collections, the Muwatta of Imam Malik and the Forty Hadith — full Arabic text with English translation and authentication grades. Free, no ads, no account.",
  },
  title: "Hadith",
  side: "الحديث الشريف",
  intro:
    "The sayings and practice of the Prophet Muhammad ﷺ, as recorded by the great compilers. Every collection is here in full — the original Arabic alongside an English translation, with the authentication grade shown wherever the scholars recorded one.",

  // ---- reader chrome ----
  display: "Display",
  showBoth: "Arabic & translation",
  showArabic: "Arabic only",
  showTranslation: "Translation only",
  textSize: "Text size",
  reading: "Reading",
  controls: "Reading settings",
  openControls: "Open reading settings",
  close: "Close",
  filterPh: "Filter these hadiths…",
  filterAria: "Filter the hadiths on this page",
  noMatch: (q: string) => `No hadith on this page contains “${q}”.`,
  clearFilter: "Clear filter",
  matchCount: (n: number) => (n === 1 ? "1 match" : `${n} matches`),
  copy: "Copy",
  copied: "Copied",
  copyAria: "Copy this hadith",
  linkAria: "Link to this hadith",
  untranslated: "No English translation is available for this hadith.",

  // ---- the hub search ----
  searchPh: "Search a collection or a book of hadith…",
  searchAria: "Search hadith collections and books",
  searchEmpty: (q: string) => `Nothing matches “${q}”. Try a book name like “prayer” or “fasting”.`,
  searchHint: "Type a collection, a book of hadith, or a subject.",
  resultsIn: "in",
};
