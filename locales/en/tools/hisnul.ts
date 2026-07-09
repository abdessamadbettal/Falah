export const hisnul = {
  meta: {
    title: "Hisnul Muslim — authentic daily duas & adhkar with audio",
    description:
      "The complete Fortress of the Muslim (Hisnul Muslim): every authentic daily dua and dhikr with Arabic text, translation, repetition counts and audio recitation. Free, no account, no ads.",
  },
  title: "Hisnul Muslim",
  side: "حصن المسلم",
  intro:
    "The complete Fortress of the Muslim — every chapter of authentic daily supplications, with translation, repetition counts, and audio recitation for each dua.",
  chapters: "Chapters",
  searchPh: "Search a chapter…",
  loading: "Loading…",
  error: "Couldn't load the adhkar. Check your connection and try again.",
  playChapter: "Play chapter",
  pause: "Pause",
  selectPrompt: "Choose a chapter to read its adhkar.",
  count: (n: number) => (n === 1 ? "1 dhikr" : `${n} adhkar`),
  repeat: (n: number) => `Repeat ×${n}`,
  copy: "Copy",
  copied: "Copied",
  faqEyebrow: "Hisnul Muslim FAQ",
  faqH2: "About these adhkar",
  faq: [
    {
      q: "What is Hisnul Muslim?",
      a: "Hisnul Muslim (“Fortress of the Muslim”) is a widely used collection of authentic daily supplications (adhkar) compiled by Sheikh Sa'id bin Ali al-Qahtani from the Quran and Sunnah.",
    },
    {
      q: "Can I listen to the duas?",
      a: "Yes. Each chapter has a full audio recitation, and every individual dua has its own audio — just tap the play button.",
    },
    {
      q: "What does the repetition count mean?",
      a: "Some adhkar are recited a set number of times (for example three or a hundred). The “Repeat ×N” badge shows how many times a dua is said, following the Sunnah.",
    },
    {
      q: "When should I read the morning and evening adhkar?",
      a: "The morning adhkar are read after Fajr until sunrise, and the evening adhkar after Asr until sunset (or after Maghrib). Consistency matters more than exact timing.",
    },
    {
      q: "Does it work without an account?",
      a: "Yes — no sign-up, no ads, no tracking. The text and audio load from the open HisnMuslim.com API.",
    },
  ],
};
