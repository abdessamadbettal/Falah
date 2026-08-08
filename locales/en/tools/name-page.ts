/** Copy for the 99 prerendered pages, one per divine name.
 *
 * Most of it is a function of the name, because a page is only worth
 * publishing if it reads as though it were written about that name. Ninety-
 * nine variations on one paragraph is the definition of the thin content
 * Google discards — and, for scripture, the kind of padding that deserves to
 * be discarded. */
export const namePage = {
  // ------------------------------------------------------------- the page
  number: (n: number) => `Name ${n} of 99`,
  h1: (word: string) => word,
  metaTitle: (word: string, meaning: string) => `${word} — ${meaning} | Meaning & Explanation`,
  metaDescription: (word: string, arabic: string, meaning: string) =>
    `${word}${arabic === word ? "" : ` (${arabic})`} means "${meaning}". What this name of Allah means, where it appears in the Quran, and how to call upon Allah by it. Free, no ads, no tracking.`,
  keywords: (word: string, arabic: string) => [
    `${word} meaning`,
    `what does ${word} mean`,
    `${word} name of Allah`,
    `${arabic} معنى`,
    `${word} in the Quran`,
    "99 names of Allah",
    "asma ul husna",
  ],

  meaningLabel: "Meaning",
  arabicLabel: "In Arabic",
  transliterationLabel: "Transliteration",
  numberLabel: "Position in the list",

  // ------------------------------------------------------------- sections
  inQuran: (word: string) => `${word} in the Quran`,
  inQuranBody: (word: string, n: number) =>
    n === 1
      ? `The verse below contains this name. Each reference is checked against the Arabic text of the Quran before it is published, so ${word} really is in the verse it is cited from.`
      : `The ${n} verses below contain this name. Every reference is checked against the Arabic text of the Quran before it is published, so ${word} really is in each verse it is cited from.`,

  /** The honest heading for the twenty-eight names not attested verbatim. */
  notInQuran: (word: string) => `Where ${word} comes from`,
  notInQuranBody: (word: string) =>
    `${word} does not appear in the Quran as a standalone name. It reaches the famous list of ninety-nine through the narration of at-Tirmidhi, and its meaning is established by the Quran in other words — through verbs and related forms rather than the name itself. Scholars accepted such names on that basis; this page marks the distinction rather than hiding it.`,

  readVerse: "Read the full surah",
  verseRef: (surah: string, s: number, a: number) => `Surah ${surah} ${s}:${a}`,

  related: "Nearby in the list",
  browseAll: "All 99 names",
  browseAllBody: "The complete Asma ul Husna, each with its own page.",

  // ------------------------------------------------------------ the index
  indexEyebrow: "Browse the names",
  indexTitle: "All 99 names of Allah",
  indexIntro:
    "Every name with its Arabic, transliteration and meaning — and its own page explaining what it means, where it appears in the Quran, and how to call upon Allah by it.",

  // ---------------------------------------------------------- the caveat
  narrationEyebrow: "On the list itself",
  narrationTitle: "How reliable is the list of ninety-nine?",
  narrationBody:
    "That Allah has ninety-nine names is established in Sahih al-Bukhari and Sahih Muslim, and both are agreed upon. The specific enumeration — this list of ninety-nine — comes from a narration in Jami' at-Tirmidhi that at-Tirmidhi himself called gharib, and which many hadith scholars grade weak; several held that a narrator compiled the names by searching the Quran and Sunnah. Classical scholars including al-Khattabi, Ibn Hazm, al-Qurtubi and al-Ghazali compiled lists of their own that differ from it. None of this touches the names themselves, every one of which is established elsewhere; it means the count of exactly these ninety-nine is a scholarly arrangement rather than a revealed roster, and Allah's names are not limited to them.",

  // ----------------------------------------------------------------- FAQ
  faqEyebrow: "About this name",
  faqH2: (word: string) => `Questions about ${word}`,
  faq: (word: string, arabic: string, meaning: string, n: number, verses: number) => [
    {
      q: `What does ${word} mean?`,
      a: `${word}${arabic === word ? "" : ` (${arabic})`} means "${meaning}". Like every one of the ninety-nine names, it describes an attribute of Allah rather than serving as a label — the names are how the Quran teaches who Allah is.`,
    },
    {
      q: `Is ${word} in the Quran?`,
      a:
        verses > 0
          ? `Yes. This page cites ${verses} ${verses === 1 ? "verse" : "verses"} containing ${word}, each checked against the Arabic text before publishing.`
          : `Not as a standalone name. ${word} reaches the list of ninety-nine through at-Tirmidhi's narration, while its meaning is established in the Quran through verbs and related forms. This page says so plainly rather than attaching a verse that does not contain it.`,
    },
    {
      q: `How do I call upon Allah by this name?`,
      a: `Address Allah with "Ya" before the name — "Ya ${word.replace(/^(Al|Ar|As|Ad|Az|An)-/, "")}" — and ask for what that attribute gives. The Quran instructs it directly: "To Allah belong the most beautiful names, so call upon Him by them" (7:180).`,
    },
    {
      q: `Which of the ninety-nine names is this?`,
      a: `It is number ${n} in the well-known list. The order comes from the narration of at-Tirmidhi and is a scholarly arrangement, so numbering can differ slightly between printed lists — the names themselves do not.`,
    },
  ],
};
