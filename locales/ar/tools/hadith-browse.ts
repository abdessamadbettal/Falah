import type { hadithBrowse as en } from "../../en/tools/hadith-browse";

/** أسماء المجموعات والكتب تصل مكتوبةً بالعربية أصلًا (انظر collectionName
 * و chapterTitle في lib/hadith-meta.ts) — لا تُمرَّر قط بالحروف اللاتينية.
 * والترجمة الإنجليزية لا وجود لها في هذه النسخة، فالنص العربي هو الأصل. */
export const hadithBrowse: typeof en = {
  hadith: "الحديث",
  collections: "كتب الحديث",
  collection: "المجموعة",
  book: "كتاب",
  books: "الكتب",
  compiler: "المؤلف",
  died: (ah: number, ce: number) => `ت ${ah} هـ / ${ce} م`,
  grade: "درجة الحديث",
  gradedBy: (grader: string) => `${grader}`,
  reference: "المرجع",
  hadithCount: (n: number) => `${fmt(n)} حديث`,
  bookCount: (n: number) => `${n} كتابًا`,
  numbered: (n: number) => `الحديث ${fmt(n)}`,
  inBook: (n: number) => `الكتاب ${n}`,
  arabicNumbering: (n: number) => `الترقيم العربي ${fmt(n)}`,
  range: (first: number, last: number) => `الأحاديث ${fmt(first)}–${fmt(last)}`,
  partOf: (part: number, total: number) => `الجزء ${part} من ${total}`,
  genre: "حديث",
  alsoKnownAs: "ويُعرف أيضًا بـ",

  kind: {
    sahih: "صحيح",
    sunan: "سنن",
    muwatta: "موطأ",
    forty: "أربعون حديثًا",
  },
  kindNote: {
    sahih: "التزم مؤلفه شرطه في الصحة، فلم يُخرج فيه إلا ما بلغ درجته.",
    sunan: "مرتَّب على أبواب الفقه، وقد ذكر العلماء درجة كل حديث فيه.",
    muwatta: "أقدم ما وصلنا من كتب الحديث، يجمع الحديث إلى عمل أهل المدينة.",
    forty: "مجموعة وجيزة تُحفظ، جُمعت فيها أحاديث جامعة لأصول الدين.",
  },
  sixBooks: "الكتب الستة",
  sixBooksNote: "من الكتب الستة",

  // ---- الصفحة الرئيسة: /hadith ----
  hubSixTitle: "الكتب الستة",
  hubSixP:
    "الكتب الستة هي أصول السنة المدوَّنة عند أهل السنة. صحيحا البخاري ومسلم أعلاها في التوثيق، وتُعرفان بالصحيحين؛ أما السنن الأربعة فمرتَّبة على أبواب الفقه، وقد ذُكرت درجة كل حديث فيها.",
  hubOtherTitle: "ما تقدّمها وما قصُر منها",
  hubOtherP:
    "موطأ الإمام مالك أقدم من الكتب الستة جميعًا، ويجمع الحديث إلى عمل أهل المدينة. أما الأربعينيات فقصيرة عن قصد — جُمعت لتُحفظ، وهي أول ما يبدأ به طالب العلم عادةً.",
  hubStatsTitle: (hadiths: number, collections: number) =>
    `${fmt(hadiths)} حديث في ${collections} مجموعات`,
  browseBooks: (n: number) => `تصفّح كتبه الـ${n}`,
  openCollection: "اقرأ هذه المجموعة",

  // ---- صفحات المجموعات ----
  collectionTitle: (name: string, hadiths: number) => `${name} — ${fmt(hadiths)} حديث كاملة`,
  collectionDesc: (name: string, author: string, hadiths: number, books: number) =>
    `اقرأ ${name} كاملًا — ${fmt(hadiths)} حديث جمعها ${author}، مرتَّبة في ${books} كتابًا، بالنص العربي. مجانًا، بلا إعلانات وبلا حساب.`,
  collectionH1: (name: string) => name,
  collectionIntro: (
    name: string,
    author: string,
    hadiths: number,
    books: number,
    era: string,
    note: string,
  ) =>
    `${name} جمعه ${author} (${era})، ويضم ${fmt(hadiths)} حديث مرتَّبة في ${books} كتابًا من كتب السنة. ${note} وكل حديث فيما يلي بنصه العربي، وكل كتاب منها في صفحة مستقلة.`,
  collectionBooksTitle: (name: string) => `كتب ${name}`,
  collectionBooksP: (books: number) =>
    `الكتب الـ${books} كلها بترتيب النسخة المطبوعة. كل كتاب في صفحة كاملة فيها نص كل حديث ومرجعه.`,

  // ---- صفحات الكتب ----
  chapterTitle: (collection: string, title: string) => `${collection}: ${title}`,
  chapterTitlePart: (collection: string, title: string, part: number) =>
    `${collection}: ${title} — الجزء ${part}`,
  chapterDesc: (collection: string, title: string, n: number, hadiths: number, range: string) =>
    `الكتاب ${n} من ${collection}، «${title}» — ${fmt(hadiths)} حديث (${range}) بالنص العربي مع درجة كل حديث.`,
  chapterDescPart: (
    collection: string,
    title: string,
    n: number,
    part: number,
    total: number,
    range: string,
  ) =>
    `الجزء ${part} من ${total} من الكتاب ${n} من ${collection}، «${title}» — ${range} بالنص العربي مع درجة كل حديث.`,
  chapterH1: (title: string) => title,
  chapterIntro: (
    collection: string,
    title: string,
    n: number,
    hadiths: number,
    range: string,
    author: string,
  ) =>
    `«${title}» هو الكتاب ${n} من ${collection}، من جمع ${author}. يضم ${fmt(hadiths)} حديث — ${range} في الترقيم المعتمد. وكل حديث فيما يلي بنصه العربي ومرجعه كاملًا، ودرجته حيثما ذكرها العلماء.`,
  /** تُضاف إلى مقدمة الجزء الأول إذا تجاوز الكتاب صفحةً واحدة. */
  splitNote: (parts: number) =>
    `وهو طويل، فقُسِّم على ${parts} صفحات ليخفّ تحميل كل صفحة؛ وهي متسلسلة ومرتبطة في أسفل الصفحة.`,
  chapterIntroPart: (
    collection: string,
    title: string,
    n: number,
    part: number,
    total: number,
    range: string,
  ) =>
    `هذا هو الجزء ${part} من ${total} من «${title}»، الكتاب ${n} من ${collection} — ${range}. والكتاب طويل، فقُسِّم على ${total} صفحات ليخفّ تحميل كل صفحة؛ وهي متسلسلة ومرتبطة في أسفل الصفحة.`,

  // ---- صفحات الحديث المفرد (الأربعينيات) ----
  hadithTitle: (collection: string, n: number) => `الحديث ${n} من ${collection}`,
  hadithDesc: (collection: string, n: number, excerpt: string) =>
    `الحديث ${n} من ${collection}: «${excerpt}» — نصه العربي كاملًا مع مرجعه.`,
  hadithH1: (n: number) => `الحديث ${n}`,
  hadithIntro: (collection: string, n: number, total: number, author: string) =>
    `الحديث ${n} من الأحاديث الـ${total} التي جمعها ${author} في ${collection}، وفيما يلي نصه العربي كاملًا مع مرجعه.`,

  // ---- التنقل ----
  allBooks: (name: string) => `كتب ${name} كلها`,
  allCollections: "كتب الحديث كلها",
  prevBook: "الكتاب السابق",
  nextBook: "الكتاب التالي",
  prevHadith: "الحديث السابق",
  nextHadith: "الحديث التالي",
  prevPart: "الجزء السابق",
  nextPart: "الجزء التالي",
  moreCollections: "مجموعات أخرى",
  moreCollectionsP:
    "الحديث الواحد قد يرويه أكثر من إمام. وهذه بقية المجموعات المنشورة هنا كاملة.",
  onThisPage: "في هذه الصفحة",

  // ---- الأسئلة الشائعة (تُنشر أيضًا كبيانات منظّمة) ----
  faqH2: "عن كتب الحديث",
  hubFaq: [
    {
      q: "ما الحديث؟",
      a: "الحديث ما نُقل عن النبي ﷺ من قول أو فعل أو تقرير. ومجموع الأحاديث هو السنة، وهي المصدر الثاني للتشريع بعد القرآن الكريم.",
    },
    {
      q: "ما أصح كتب الحديث؟",
      a: "صحيحا البخاري ومسلم أعلى كتب الحديث توثيقًا، ويُعرفان بالصحيحين، وهما أول الكتب الستة.",
    },
    {
      q: "ما معنى صحيح وحسن وضعيف؟",
      a: "هي أحكام على إسناد الحديث. فالصحيح ما تمّت شروطه، والحسن ما خفّ ضبط رواته قليلًا، والضعيف ما فقد شرطًا من شروط القبول. والبخاري ومسلم التزما شرطهما فلم يذكرا درجة لكل حديث، بخلاف السنن الأربعة.",
    },
    {
      q: "من أين هذه النصوص؟",
      a: "النصوص العربية والدرجات من قاعدة بيانات hadith-api المفتوحة، وأسماء الكتب مقابَلة بقاعدة بيانات مستقلة أخرى قبل النشر. ولم يُحذف من النص شيء ولم يُختصر.",
    },
    {
      q: "هل الاستعمال مجاني؟",
      a: "نعم — كل مجموعة تُقرأ كاملة مجانًا، بلا إعلانات وبلا حساب وبلا اشتراك. وفلاح صدقة جارية.",
    },
  ],
  collectionFaq: (name: string, author: string, hadiths: number, books: number) => [
    {
      q: `كم حديثًا في ${name}؟`,
      a: `في هذه النسخة من ${name} ${fmt(hadiths)} حديث مرتَّبة في ${books} كتابًا. والترقيم يختلف بين النسخ المطبوعة، فقد يختلف رقم الحديث هنا عن نسختك بحديث أو حديثين.`,
    },
    {
      q: `من جمع ${name}؟`,
      a: `${name} من جمع ${author}، وهو منشور هنا كاملًا بنصه العربي.`,
    },
    {
      q: `هل يمكن قراءة ${name} مجانًا؟`,
      a: `نعم. كل كتاب من ${name} في صفحة مجانية على فلاح — بلا حساب وبلا إعلانات ودون حجب أي باب.`,
    },
  ],

  sourceNote:
    "النصوص من قاعدة بيانات hadith-api المفتوحة، والترقيم بحسبها وقد يختلف يسيرًا عن النسخ المطبوعة — فراجع النص في أصل معتمد قبل الاعتماد على رقم بعينه.",
};

/** فواصل الآلاف في السرد، فتُقرأ «7,580 حديث». وأرقام الأحاديث الكسرية
 * (402.2) تبقى بكسرها. */
function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
