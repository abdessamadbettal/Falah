export const hisnul = {
  meta: {
    title: "La Citadelle du Musulman — invocations et adhkar authentiques avec audio",
    description:
      "La Citadelle du Musulman (Hisnul Muslim) complète : chaque invocation et dhikr authentique quotidien avec texte arabe, traduction, nombre de répétitions et récitation audio. Gratuit, sans compte, sans pubs.",
  },
  title: "La Citadelle du Musulman",
  side: "حصن المسلم",
  intro:
    "La Citadelle du Musulman complète — chaque chapitre d'invocations quotidiennes authentiques, avec traduction, nombre de répétitions et récitation audio pour chaque invocation.",
  chapters: "Chapitres",
  searchPh: "Rechercher un chapitre…",
  loading: "Chargement…",
  error: "Impossible de charger les adhkar. Vérifiez votre connexion et réessayez.",
  playChapter: "Lire le chapitre",
  pause: "Pause",
  selectPrompt: "Choisissez un chapitre pour lire ses adhkar.",
  count: (n: number) => (n === 1 ? "1 dhikr" : `${n} adhkar`),
  repeat: (n: number) => `Répéter ×${n}`,
  copy: "Copier",
  copied: "Copié",
  faqEyebrow: "FAQ de La Citadelle du Musulman",
  faqH2: "À propos de ces adhkar",
  faq: [
    {
      q: "Qu'est-ce que La Citadelle du Musulman (Hisnul Muslim) ?",
      a: "La Citadelle du Musulman (Hisnul Muslim) est un recueil très utilisé d'invocations (adhkar) quotidiennes authentiques compilées par le Cheikh Sa'id bin Ali al-Qahtani à partir du Coran et de la Sunna.",
    },
    {
      q: "Puis-je écouter les invocations ?",
      a: "Oui. Chaque chapitre a une récitation audio complète, et chaque invocation individuelle a son propre audio — touchez simplement le bouton de lecture.",
    },
    {
      q: "Que signifie le nombre de répétitions ?",
      a: "Certains adhkar sont récités un nombre précis de fois (par exemple trois ou cent). Le badge « Répéter ×N » indique combien de fois une invocation est dite, suivant la Sunna.",
    },
    {
      q: "Quand dois-je lire les adhkar du matin et du soir ?",
      a: "Les adhkar du matin sont lus après le Fajr jusqu'au lever du soleil, et les adhkar du soir après le Asr jusqu'au coucher du soleil (ou après le Maghrib). La constance compte plus que l'heure exacte.",
    },
    {
      q: "Cela fonctionne-t-il sans compte ?",
      a: "Oui — pas d'inscription, pas de publicités, pas de suivi. Le texte et l'audio sont chargés depuis l'API ouverte HisnMuslim.com.",
    },
  ],
};
