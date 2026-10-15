import type { tafseer as en } from "../../en/tools/tafseer";

export const tafseer: typeof en = {
  meta: {
    title: "Jelajah Tafsir — kajian Al-Qur'an ayat demi ayat",
    description:
      "Baca ayat Al-Qur'an bersama tafsir klasik: Al-Muyassar dan Al-Jalalayn dalam bahasa Arab, serta terjemahan. Gratis dan berjalan di perangkat Anda.",
  },
  title: "Jelajah Tafsir",
  side: "التفسير",
  intro:
    "Baca setiap ayat bersama tafsir klasik — Al-Muyassar dan Al-Jalalayn dalam bahasa Arab, atau terjemahannya.",
  commentary: "Tafsir",
  loadingTafseer: "Memuat tafsir…",
  tafsirs: [
    { id: "ar.muyassar", label: "Al-Muyassar (bahasa Arab)" },
    { id: "ar.jalalayn", label: "Al-Jalalayn (bahasa Arab)" },
    { id: "en.sahih", label: "Saheeh International (terjemahan bahasa Inggris)" },
  ],
};
