/** Copy for the prerendered hadith routes — /hadith, /hadith/[collection],
 * /hadith/[collection]/[chapter] and its parts.
 *
 * Kept apart from the reader's UI strings for the same reason quran-browse is:
 * almost all of it is search-facing — titles, meta descriptions and body prose
 * that Google reads, not chrome. */
export const hadithBrowse = {
  // ---- shared labels ----
  hadith: "Hadith",
  collections: "Collections",
  collection: "Collection",
  /** A kitab. "Book" is the term English translations and citations use. */
  book: "Book",
  books: "Books",
  compiler: "Compiler",
  died: (ah: number, ce: number) => `d. ${ah} AH / ${ce} CE`,
  grade: "Grading",
  gradedBy: (grader: string) => `${grader}`,
  reference: "Reference",
  hadithCount: (n: number) => `${fmt(n)} ${n === 1 ? "hadith" : "hadiths"}`,
  bookCount: (n: number) => `${n} ${n === 1 ? "book" : "books"}`,
  numbered: (n: number) => `Hadith ${fmt(n)}`,
  inBook: (n: number) => `Book ${n}`,
  arabicNumbering: (n: number) => `Arabic numbering ${fmt(n)}`,
  range: (first: number, last: number) => `Hadith ${fmt(first)}–${fmt(last)}`,
  partOf: (part: number, total: number) => `Part ${part} of ${total}`,
  genre: "Hadith",
  alsoKnownAs: "Also known as",

  // ---- how a collection is described ----
  kind: {
    sahih: "Sahih",
    sunan: "Sunan",
    muwatta: "Muwatta",
    forty: "Forty Hadith",
  } as Record<string, string>,
  kindNote: {
    sahih: "Every hadith in this collection was held to the compiler's own condition of authenticity.",
    sunan: "Arranged by chapters of fiqh, and graded — each hadith carries the verdict of the hadith scholars.",
    muwatta: "The earliest surviving collection, combining hadith with the practice of Madinah.",
    forty: "A short, memorisable collection gathering hadiths that sum up the religion.",
  } as Record<string, string>,
  sixBooks: "Kutub as-Sittah",
  sixBooksNote: "One of the six canonical collections",

  // ---- the hub: /hadith ----
  hubSixTitle: "The six canonical collections",
  hubSixP:
    "The Kutub as-Sittah — the six books Sunni scholarship treats as the core of the recorded Sunnah. Sahih al-Bukhari and Sahih Muslim are the two most rigorously authenticated; the four Sunan arrange the hadiths by chapters of law and record a grading for each.",
  hubOtherTitle: "Earlier and shorter collections",
  hubOtherP:
    "The Muwatta of Imam Malik predates all six and pairs hadith with the settled practice of Madinah. The Forty Hadith collections are short by design — gathered to be memorised, and traditionally the first hadiths a student learns.",
  hubStatsTitle: (hadiths: number, collections: number) =>
    `${fmt(hadiths)} hadiths across ${collections} collections`,
  browseBooks: (n: number) => `Browse all ${n} books`,
  openCollection: "Read this collection",

  // ---- collection pages ----
  collectionTitle: (name: string, hadiths: number) => `${name} — all ${fmt(hadiths)} hadiths`,
  collectionDesc: (name: string, author: string, hadiths: number, books: number) =>
    `Read ${name} in full — all ${fmt(hadiths)} hadiths compiled by ${author}, arranged across ${books} books, in Arabic with an English translation. Free, no ads, no account.`,
  collectionH1: (name: string) => name,
  collectionIntro: (
    name: string,
    author: string,
    hadiths: number,
    books: number,
    era: string,
    note: string,
  ) =>
    `${name} was compiled by ${author} (${era}). It gathers ${fmt(hadiths)} hadiths arranged across ${books} books of the Sunnah. ${note} Every hadith below is given in the original Arabic with an English translation, and each book opens as its own page.`,
  collectionBooksTitle: (name: string) => `The books of ${name}`,
  collectionBooksP: (books: number) =>
    `All ${books} books, in the order of the printed edition. Each one opens as a full page with the Arabic text, the translation and the reference for every hadith it contains.`,

  // ---- chapter (kitab) pages ----
  chapterTitle: (collection: string, title: string) => `${collection}: ${title}`,
  chapterTitlePart: (collection: string, title: string, part: number) =>
    `${collection}: ${title} — part ${part}`,
  chapterDesc: (collection: string, title: string, n: number, hadiths: number, range: string) =>
    `Book ${n} of ${collection}, “${title}” — ${fmt(hadiths)} hadiths (${range}) in Arabic with an English translation and the authentication grade for each.`,
  chapterDescPart: (
    collection: string,
    title: string,
    n: number,
    part: number,
    total: number,
    range: string,
  ) =>
    `Part ${part} of ${total} of book ${n} of ${collection}, “${title}” — ${range} in Arabic with an English translation and grading.`,
  chapterH1: (title: string) => title,
  chapterIntro: (
    collection: string,
    title: string,
    n: number,
    hadiths: number,
    range: string,
    author: string,
  ) =>
    `“${title}” is book ${n} of ${collection}, the collection of ${author}. It holds ${fmt(hadiths)} hadiths — ${range} in the standard numbering. Each is shown below in the original Arabic with an English translation, its full reference, and the grading the hadith scholars gave it where one was recorded.`,
  /** Appended to part 1's intro when the kitab runs past one page. */
  splitNote: (parts: number) =>
    `It is long enough that it is split across ${parts} pages so each one stays quick to load; the parts run in order and are linked at the foot of the page.`,
  chapterIntroPart: (
    collection: string,
    title: string,
    n: number,
    part: number,
    total: number,
    range: string,
  ) =>
    `This is part ${part} of ${total} of “${title}”, book ${n} of ${collection} — ${range}. The book is long enough that it is split across ${total} pages so each one stays quick to load; the parts run in order and are linked at the foot of the page.`,

  // ---- single hadith pages (the "forty" collections) ----
  hadithTitle: (collection: string, n: number) => `Hadith ${n} of ${collection}`,
  hadithDesc: (collection: string, n: number, excerpt: string) =>
    `Hadith ${n} of ${collection}: “${excerpt}” — the full Arabic text with an English translation and reference.`,
  hadithH1: (n: number) => `Hadith ${n}`,
  hadithIntro: (collection: string, n: number, total: number, author: string) =>
    `The ${ordinal(n)} of the ${total} hadiths gathered by ${author} in ${collection}, given below in the original Arabic with an English translation and its reference.`,

  // ---- navigation ----
  allBooks: (name: string) => `All books of ${name}`,
  allCollections: "All hadith collections",
  prevBook: "Previous book",
  nextBook: "Next book",
  prevHadith: "Previous hadith",
  nextHadith: "Next hadith",
  prevPart: "Previous part",
  nextPart: "Next part",
  moreCollections: "Other collections",
  moreCollectionsP:
    "The same hadith is often recorded by more than one compiler. These are the other collections published here in full.",
  onThisPage: "On this page",

  // ---- FAQ (also emitted as FAQPage structured data) ----
  faqH2: "About the hadith collections",
  hubFaq: [
    {
      q: "What is a hadith?",
      a: "A hadith is a recorded report of what the Prophet Muhammad ﷺ said, did, or approved of. Together the hadiths make up the Sunnah, the second source of Islamic guidance after the Quran.",
    },
    {
      q: "Which hadith collections are the most authentic?",
      a: "Sahih al-Bukhari and Sahih Muslim are held to be the most rigorously authenticated, and are together called the Sahihayn. They form the first two of the six canonical collections, the Kutub as-Sittah.",
    },
    {
      q: "What do the grades Sahih, Hasan and Da'if mean?",
      a: "They are verdicts on a hadith's chain of narration. Sahih means authentic, Hasan means sound but with a slightly weaker chain, and Da'if means weak. Bukhari and Muslim admitted only hadiths meeting their own conditions, so their collections carry no per-hadith grading; the four Sunan do.",
    },
    {
      q: "Where does this text come from?",
      a: "The Arabic text, the English translations and the gradings come from the open hadith-api dataset, and the book titles are cross-checked against a second independent dataset before publishing. Nothing is edited or abridged.",
    },
    {
      q: "Is it free to use?",
      a: "Yes — every collection is free to read in full, with no ads, no account and no paywall. Falah is built purely as Sadaqah Jariyah.",
    },
  ],
  collectionFaq: (name: string, author: string, hadiths: number, books: number) => [
    {
      q: `How many hadiths are in ${name}?`,
      a: `This edition of ${name} contains ${fmt(hadiths)} hadiths arranged across ${books} books. Numbering differs between printed editions, so a hadith's number here may differ by one or two from another copy.`,
    },
    {
      q: `Who compiled ${name}?`,
      a: `${name} was compiled by ${author}, and is published here in full in the original Arabic with an English translation.`,
    },
    {
      q: `Can I read ${name} for free?`,
      a: `Yes. Every book of ${name} is a free page on Falah.io — no account, no ads, and no chapter held back.`,
    },
  ],

  // ---- honesty note shown under every collection ----
  sourceNote:
    "Text from the open hadith-api dataset. Hadith numbering follows that edition and can differ slightly from a printed copy — check the Arabic against a trusted mushaf of hadith before relying on a reference.",
};

/** Thousands separators in prose, so "7580 hadiths" reads as "7,580 hadiths".
 * Fractional hadith numbers (402.2) keep their decimal. */
function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function ordinal(n: number): string {
  const rest = n % 100;
  if (rest >= 11 && rest <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}
