import type { tafseer as en } from "../../en/tools/tafseer";

export const tafseer: typeof en = {
  meta: {
    title: "مستكشف التفسير — تفسير القرآن آية آية",
    description:
      "اقرأ آيات القرآن مع التفسير الكلاسيكي: الميسر والجلالين بالعربية. مجاني ويعمل على جهازك.",
  },
  title: "مستكشف التفسير",
  side: "Tafseer",
  intro: "اقرأ كل آية مع تفسير كلاسيكي — الميسر أو الجلالين بالعربية.",
  commentary: "التفسير",
  loadingTafseer: "جارٍ تحميل التفسير…",
  tafsirs: [
    { id: "ar.muyassar", label: "التفسير الميسر" },
    { id: "ar.jalalayn", label: "تفسير الجلالين" },
    { id: "ar.qurtubi", label: "تفسير القرطبي" },
  ],
};
