/** Copy for the prerendered Quran routes — /quran/surah/…, /juz/…, /hizb/…
 * and /page/…. Kept apart from the reader's UI strings because almost all of
 * it is search-facing: titles, meta descriptions and body prose that Google
 * reads, not chrome. */
export const quranBrowse = {
  // ---- shared labels ----
  quran: "Coran",
  surah: "Sourate",
  juz: "Jouz",
  hizb: "Hizb",
  page: "Page",
  verses: "versets",
  verse: "Verset",
  meccan: "Mecquoise",
  medinan: "Médinoise",
  readInReader: "Ouvrir dans le lecteur interactif",
  listen: "Écouter cette récitation",
  prev: "Précédent",
  next: "Suivant",
  backToQuran: "Tout le Coran",

  // ---- reader navigation ----
  navigate: "Naviguer",
  browseBy: "Parcourir par",
  bySurah: "Sourate",
  byJuz: "Jouz",
  byHizb: "Hizb",
  byPage: "Page",
  translationList: "Traduction, verset par verset",

  // ---- the hub: /quran ----
  hubSurahsTitle: "Les 114 sourates",
  hubSurahsP:
    "Chaque sourate du Saint Coran, dans l'ordre du moushaf. Chacune s'ouvre sur une page complète avec l'arabe outhmani, une traduction en français et l'audio verset par verset.",
  hubJuzTitle: "Les 30 jouz (para)",
  hubJuzP:
    "Le Coran divisé en ses 30 jouz — les portions de lecture utilisées pour terminer le Coran en un mois, en particulier pendant le Ramadan.",
  hubHizbTitle: "Les 60 hizb",
  hubHizbP: "Chaque jouz divisé en deux, pour les lecteurs qui suivent leur portion quotidienne par hizb.",
  hubPagesTitle: "Les 604 pages du moushaf",
  hubPagesP:
    "Chaque page du moushaf de Médine standard, numérotée exactement comme sur papier — utile pour la mémorisation et pour suivre avec une copie physique.",
  showAllPages: "Parcourir les 604 pages",

  // ---- surah pages ----
  surahTitle: (name: string, meaning: string, n: number) =>
    `Sourate ${name} (${meaning}) — chapitre ${n} du Coran`,
  surahDesc: (
    translit: string,
    n: number,
    meaning: string,
    ayahs: number,
    revelation: string,
    juz: number,
  ) =>
    `Lisez la Sourate ${translit} — sourate ${n} du Coran, « ${meaning} » — en arabe outhmani avec une traduction en français. ${ayahs} versets, ${revelation.toLowerCase()}, commence au jouz ${juz}. Gratuit, sans pubs, sans compte.`,
  surahH1: (translit: string) => `Sourate ${translit}`,
  surahIntro: (
    translit: string,
    n: number,
    meaning: string,
    ayahs: number,
    revelation: string,
    juz: number,
    page: number,
  ) =>
    `La Sourate ${translit} est la ${ordinal(n)} sourate du Coran. Son nom signifie « ${meaning} ». C'est une sourate ${revelation.toLowerCase()} de ${ayahs} versets, commençant au jouz ${juz} à la page ${page} du moushaf. Ci-dessous se trouve le texte arabe complet en écriture outhmanie avec une traduction en français pour chaque verset.`,

  // ---- juz pages ----
  juzTitle: (n: number, name: string) => `Jouz ${n} (${name}) — texte complet & traduction`,
  juzDesc: (n: number, translit: string, from: string, to: string, ayahs: number) =>
    `Lisez le jouz ${n} du Coran (${translit}), de ${from} à ${to} — ${ayahs} versets en arabe outhmani avec une traduction en français et de l'audio. Gratuit, sans pubs, sans compte.`,
  juzH1: (n: number) => `Jouz ${n}`,
  juzIntro: (n: number, translit: string, from: string, to: string, ayahs: number, surahs: number) =>
    `Le jouz ${n} — connu sous le nom de ${translit} d'après ses premiers mots — est la ${ordinal(n)} des 30 portions de lecture du Coran. Il va de ${from} à ${to}, couvrant ${ayahs} versets à travers ${surahs === 1 ? "une sourate" : `${surahs} sourates`}. Lire un jouz par jour permet de terminer le Coran en un mois.`,

  // ---- hizb pages ----
  hizbTitle: (n: number, juz: number) => `Hizb ${n} (Jouz ${juz}) — texte complet & traduction`,
  hizbDesc: (n: number, juz: number, from: string, to: string, ayahs: number) =>
    `Lisez le hizb ${n} du Coran, la ${n % 2 === 1 ? "première" : "seconde"} moitié du jouz ${juz}, de ${from} à ${to} — ${ayahs} versets en arabe outhmani avec une traduction en français.`,
  hizbH1: (n: number) => `Hizb ${n}`,
  hizbIntro: (n: number, juz: number, from: string, to: string, ayahs: number) =>
    `Le hizb ${n} est la ${n % 2 === 1 ? "première" : "seconde"} moitié du jouz ${juz}, l'un des 60 hizb dans lesquels le Coran est divisé. Il va de ${from} à ${to} et contient ${ayahs} versets.`,

  // ---- mushaf page routes ----
  pageTitle: (n: number, surahs: string, juz: number) =>
    `Page ${n} du Coran — ${surahs}, jouz ${juz}`,
  pageDesc: (n: number, juz: number, surahs: string, ayahs: number) =>
    `Lisez la page ${n} du Coran (${surahs}, jouz ${juz}) exactement comme imprimée dans le moushaf de Médine — ${ayahs} versets en arabe outhmani avec une traduction en français et de l'audio.`,
  pageH1: (n: number) => `Page ${n} du Coran`,
  pageIntro: (n: number, juz: number, surahs: string, ayahs: number) =>
    `La page ${n} du moushaf standard de 604 pages de Médine tombe dans le jouz ${juz} et contient ${ayahs} versets de la ${surahs}. Le saut de page correspond au moushaf imprimé, vous pouvez donc suivre avec une copie physique ou suivre un plan de mémorisation page par page.`,

  // ---- cross-links between the four views ----
  alsoIn: "Également dans cette partie du Coran",
  juzOfSurah: (n: number) => `Jouz ${n}`,
  pageOfSurah: (n: number) => `Page ${n}`,
  surahsOnThisPage: "Sourates sur cette page",
  startsAt: "Commence à",
  ayahCount: (n: number) => `${n} ${n === 1 ? "verset" : "versets"}`,
};

function ordinal(n: number): string {
  if (n === 1) return "1re";
  return `${n}e`;
}
