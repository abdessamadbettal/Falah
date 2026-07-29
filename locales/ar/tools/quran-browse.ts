import type { quranBrowse as en } from "../../en/tools/quran-browse";

/** The `name` arguments arrive already in Arabic (see surahName / juzName in
 * lib/quran-seo.ts) — never a Latin transliteration. `meaning` is the English
 * gloss and is deliberately unused here. */
export const quranBrowse: typeof en = {
  quran: "القرآن الكريم",
  surah: "سورة",
  juz: "الجزء",
  hizb: "الحزب",
  page: "الصفحة",
  verses: "آية",
  verse: "الآية",
  meccan: "مكية",
  medinan: "مدنية",
  readInReader: "افتح في المصحف التفاعلي",
  listen: "استمع إلى التلاوة",
  prev: "السابق",
  next: "التالي",
  backToQuran: "القرآن الكريم كاملًا",

  navigate: "التنقل",
  browseBy: "طريقة التصفح",
  bySurah: "سورة",
  byJuz: "جزء",
  byHizb: "حزب",
  byPage: "صفحة",
  translationList: "التفسير، آيةً آية",

  hubSurahsTitle: "سور القرآن الكريم الـ114",
  hubSurahsP:
    "جميع سور القرآن الكريم بترتيب المصحف. كل سورة في صفحة كاملة بالرسم العثماني مع التفسير الميسّر وتلاوة آيةً آية.",
  hubJuzTitle: "أجزاء القرآن الثلاثون",
  hubJuzP:
    "القرآن الكريم مقسّمًا إلى ثلاثين جزءًا — ورد القراءة الذي يُختم به القرآن في شهر، ولا سيّما في رمضان.",
  hubHizbTitle: "أحزاب القرآن الستون",
  hubHizbP: "كل جزء مقسوم إلى حزبين، لمن يتابع ورده اليومي بالحزب.",
  hubPagesTitle: "صفحات المصحف الـ604",
  hubPagesP:
    "كل صفحات مصحف المدينة بالترقيم المطبوع نفسه — تعين على الحفظ وعلى المتابعة مع المصحف الورقي.",
  showAllPages: "تصفّح الصفحات الـ604",

  surahTitle: (name: string, _meaning: string, n: number) => `سورة ${name} — السورة ${n} كاملة`,
  surahDesc: (
    name: string,
    n: number,
    _meaning: string,
    ayahs: number,
    revelation: string,
    juz: number,
  ) =>
    `اقرأ سورة ${name} كاملة — السورة رقم ${n} في المصحف — بالرسم العثماني مع التفسير الميسّر. ${ayahs} آية، ${revelation}، تبدأ في الجزء ${juz}. مجانًا، بلا إعلانات وبلا حساب.`,
  surahH1: (name: string) => `سورة ${name}`,
  surahIntro: (
    name: string,
    n: number,
    _meaning: string,
    ayahs: number,
    revelation: string,
    juz: number,
    page: number,
  ) =>
    `سورة ${name} هي السورة رقم ${n} في ترتيب المصحف، وهي سورة ${revelation} عدد آياتها ${ayahs} آية، تبدأ في الجزء ${juz} عند الصفحة ${page} من المصحف. وفيما يلي نصها كاملًا بالرسم العثماني مع تفسير كل آية.`,

  juzTitle: (n: number, name: string) => `الجزء ${n} (${name}) كاملًا مع التفسير`,
  juzDesc: (n: number, name: string, from: string, to: string, ayahs: number) =>
    `اقرأ الجزء ${n} من القرآن الكريم (${name}) من ${from} إلى ${to} — ${ayahs} آية بالرسم العثماني مع التفسير والتلاوة. مجانًا وبلا إعلانات.`,
  juzH1: (n: number) => `الجزء ${n}`,
  juzIntro: (n: number, name: string, from: string, to: string, ayahs: number, surahs: number) =>
    `الجزء ${n} — ويُعرف بـ«${name}» نسبةً إلى أول كلماته — هو أحد أجزاء القرآن الثلاثين. يمتد من ${from} إلى ${to}، ويضم ${ayahs} آية في ${surahs === 1 ? "سورة واحدة" : `${surahs} سور`}. وقراءة جزء كل يوم تُتِم ختمة في شهر.`,

  hizbTitle: (n: number, juz: number) => `الحزب ${n} (الجزء ${juz}) كاملًا مع التفسير`,
  hizbDesc: (n: number, juz: number, from: string, to: string, ayahs: number) =>
    `اقرأ الحزب ${n} من القرآن الكريم، وهو ${n % 2 === 1 ? "النصف الأول" : "النصف الثاني"} من الجزء ${juz}، من ${from} إلى ${to} — ${ayahs} آية بالرسم العثماني مع التفسير.`,
  hizbH1: (n: number) => `الحزب ${n}`,
  hizbIntro: (n: number, juz: number, from: string, to: string, ayahs: number) =>
    `الحزب ${n} هو ${n % 2 === 1 ? "النصف الأول" : "النصف الثاني"} من الجزء ${juz}، وأحد أحزاب القرآن الستين. يمتد من ${from} إلى ${to} ويضم ${ayahs} آية.`,

  pageTitle: (n: number, surahs: string, juz: number) =>
    `صفحة ${n} من المصحف — ${surahs}، الجزء ${juz}`,
  pageDesc: (n: number, juz: number, surahs: string, ayahs: number) =>
    `اقرأ الصفحة ${n} من القرآن الكريم (${surahs}، الجزء ${juz}) كما هي في مصحف المدينة المطبوع — ${ayahs} آية بالرسم العثماني مع التفسير والتلاوة.`,
  pageH1: (n: number) => `صفحة ${n} من المصحف`,
  pageIntro: (n: number, juz: number, surahs: string, ayahs: number) =>
    `الصفحة ${n} من مصحف المدينة ذي الـ604 صفحات تقع في الجزء ${juz} وتضم ${ayahs} آية من ${surahs}. ونهاية الصفحة هنا مطابقة للمصحف المطبوع، فيمكنك المتابعة مع نسختك الورقية أو ضبط ورد الحفظ صفحةً صفحة.`,

  alsoIn: "في هذا الموضع من المصحف",
  juzOfSurah: (n: number) => `الجزء ${n}`,
  pageOfSurah: (n: number) => `الصفحة ${n}`,
  surahsOnThisPage: "السور في هذه الصفحة",
  startsAt: "تبدأ عند",
  ayahCount: (n: number) => `${n} آية`,
};
