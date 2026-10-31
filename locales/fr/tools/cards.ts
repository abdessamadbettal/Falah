import type { cards as en } from "../../en/tools/cards";

export const cards: typeof en = {
  meta: {
    title: "Créateur de Cartes Coraniques — images de versets pour les réseaux sociaux",
    description:
      "Générez des cartes de versets du Coran 1080×1080 avec une calligraphie arabe et une traduction, rendues dans votre navigateur avec canvas. Téléchargement gratuit en PNG.",
  },
  title: "Créateur de Cartes Coraniques",
  side: "بطاقات قرآنية",
  intro: "Choisissez n'importe quel verset et générez une carte prête à être partagée, rendue entièrement dans votre navigateur avec l'API canvas.",
  surah: "Sourate",
  ayah: (max: number) => `Verset (1–${max})`,
  style: "Style",
  styles: { emerald: "Émeraude", night: "Nuit", parchment: "Parchemin", royal: "Royal", sunset: "Coucher de soleil", ocean: "Océan", slate: "Ardoise" },
  includeTranslation: "Inclure la traduction",
  translationSource: "Source de la traduction",
  autoSizeFont: "Taille automatique de la police",
  arabicSize: "Taille arabe (px)",
  translationSize: "Taille de la traduction (px)",
  generate: "Générer la carte",
  rendering: "Rendu en cours…",
  download: "Télécharger PNG",
  error: "Impossible de récupérer ce verset. Vérifiez le numéro de verset et votre connexion.",
  sizeNote: "1080×1080 px — formaté pour les réseaux sociaux.",
  reference: (name: string, s: number, a: number) => `Sourate ${name} · ${s}:${a}`,
};
