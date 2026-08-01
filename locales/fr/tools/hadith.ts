export const hadith = {
  meta: {
    title: "Recueils de Hadiths — Sahih al-Bukhari, Mouslim et les Sounan",
    description:
      "Lisez plus de 36 000 hadiths des six recueils canoniques, de la Mouwatta de l'Imam Malik et des Quarante Hadiths — texte intégral en arabe avec traduction et grades d'authentification. Gratuit, sans publicité, sans compte.",
  },
  title: "Hadith",
  side: "الحديث الشريف",
  intro:
    "Les paroles et les pratiques du Prophète Muhammad ﷺ, telles que consignées par les grands compilateurs. Chaque recueil est ici dans son intégralité — l'arabe original aux côtés d'une traduction, avec le grade d'authentification indiqué partout où les savants en ont enregistré un.",

  // ---- reader chrome ----
  display: "Affichage",
  showBoth: "Arabe & traduction",
  showArabic: "Arabe uniquement",
  showTranslation: "Traduction uniquement",
  textSize: "Taille du texte",
  reading: "Lecture",
  controls: "Paramètres de lecture",
  openControls: "Ouvrir les paramètres de lecture",
  close: "Fermer",
  filterPh: "Filtrer ces hadiths…",
  filterAria: "Filtrer les hadiths sur cette page",
  noMatch: (q: string) => `Aucun hadith sur cette page ne contient « ${q} ».`,
  clearFilter: "Effacer le filtre",
  matchCount: (n: number) => (n === 1 ? "1 correspondance" : `${n} correspondances`),
  copy: "Copier",
  copied: "Copié",
  copyAria: "Copier ce hadith",
  linkAria: "Lien vers ce hadith",
  untranslated: "Aucune traduction n'est disponible pour ce hadith.",

  // ---- the hub search ----
  searchPh: "Rechercher un recueil ou un livre de hadiths…",
  searchAria: "Rechercher des recueils et des livres de hadiths",
  searchEmpty: (q: string) => `Aucun résultat pour « ${q} ». Essayez un nom de livre comme « prière » ou « jeûne ».`,
  searchHint: "Tapez un recueil, un livre de hadiths, ou un sujet.",
  resultsIn: "dans",
};
