import type { quran as en } from "../../en/tools/quran";

export const quran: typeof en = {
  meta: {
    title: "اقرأ القرآن الكريم — الرسم العثماني مع الصوت والتفسير",
    description:
      "اقرأ سور القرآن الكريم الـ114 بالرسم العثماني الأصيل، واستمع لمشاهير القرّاء، وأظهِر التفسير عند المرور أو النقر. مجاني وخاص، بلا إعلانات وبلا حساب.",
  },
  title: "مستكشف القرآن الكريم",
  side: "Quran Explorer",
  intro:
    "اقرأ القرآن بالرسم العثماني، واستمع لقارئ تختاره، وأظهِر تفسير كل آية عند المرور أو النقر. النص والصوت من واجهة AlQuran.cloud المفتوحة.",
  surah: "السورة",
  reciter: "القارئ",
  translation: "التفسير",
  translationMode: "إظهار التفسير",
  modeHover: "عند المرور",
  modeClick: "عند النقر",
  modeOff: "إيقاف",
  textSize: "حجم الخط",
  playSurah: "تشغيل",
  pause: "إيقاف مؤقت",
  playVerse: "تشغيل هذه الآية",
  prev: "السورة السابقة",
  next: "السورة التالية",
  settings: "إعدادات القراءة",
  hoverHint: "مرّر فوق أي آية لإظهار تفسيرها.",
  clickHint: "انقر أي آية لإظهار تفسيرها.",
  offHint: "التفسير مخفي — اختر «عند المرور» أو «عند النقر» لإظهاره.",
  verseRef: (s: number, a: number) => `الآية ${s}:${a}`,
  loadingSurah: "جارٍ تحميل السورة…",
  errSurah: "تعذّر تحميل هذه السورة. تحقق من اتصالك وحاول مجددًا.",
  errList: "تعذّر تحميل قائمة السور. تحقق من اتصالك وحاول مجددًا.",
  ayahs: "آية",
  revelation: { Meccan: "مكية", Medinan: "مدنية" } as Record<string, string>,
  translationEdition: "ar.muyassar",
};
