import type { tafseer as en } from "../../en/tools/tafseer";

export const tafseer: typeof en = {
  meta: {
    title: "Explorador de tafsir — comentario del Corán aleya por aleya",
    description:
      "Lee las aleyas del Corán junto al tafsir clásico: Al-Muyassar y Al-Jalalayn en árabe, además de una traducción. Gratis y en tu navegador.",
  },
  title: "Explorador de tafsir",
  side: "التفسير",
  intro:
    "Lee cada aleya junto a un comentario clásico: Al-Muyassar y Al-Jalalayn en árabe, o una traducción.",
  commentary: "Comentario",
  loadingTafseer: "Cargando comentario…",
  tafsirs: [
    { id: "ar.muyassar", label: "Al-Muyassar (árabe)" },
    { id: "ar.jalalayn", label: "Al-Jalalayn (árabe)" },
    { id: "es.cortes", label: "Julio Cortés (traducción al español)" },
  ],
};
