import type { cards as en } from "../../en/tools/cards";

export const cards: typeof en = {
  meta: {
    title: "صانع البطاقات القرآنية — صور آيات للمشاركة",
    description:
      "أنشئ بطاقات آيات قرآنية بمقاس 1080×1080 بخط عربي جميل، تُرسم في متصفحك عبر canvas. تنزيل PNG مجاني.",
  },
  title: "صانع البطاقات القرآنية",
  side: "Quran Cards",
  intro: "اختر أي آية وأنشئ بطاقة جاهزة للمشاركة، تُرسم بالكامل في متصفحك عبر واجهة canvas.",
  surah: "السورة",
  ayah: (max: number) => `الآية (1–${max})`,
  style: "النمط",
  styles: { emerald: "زمردي", night: "ليلي", parchment: "رَقّ" },
  generate: "إنشاء البطاقة",
  rendering: "جارٍ الرسم…",
  download: "تنزيل PNG",
  error: "تعذّر جلب هذه الآية. تحقق من رقم الآية ومن اتصالك.",
  sizeNote: "1080×1080 بكسل — بمقاس شبكات التواصل.",
  reference: (name: string, s: number, a: number) => `سورة ${name} · ${s}:${a}`,
};
