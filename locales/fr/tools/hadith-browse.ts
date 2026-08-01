/** Copy for the prerendered hadith routes — /hadith, /hadith/[collection],
 * /hadith/[collection]/[chapter] and its parts.
 *
 * Kept apart from the reader's UI strings for the same reason quran-browse is:
 * almost all of it is search-facing — titles, meta descriptions and body prose
 * that Google reads, not chrome. */
export const hadithBrowse = {
  // ---- shared labels ----
  hadith: "Hadith",
  collections: "Recueils",
  collection: "Recueil",
  /** A kitab. "Book" is the term English translations and citations use. */
  book: "Livre",
  books: "Livres",
  compiler: "Compilateur",
  died: (ah: number, ce: number) => `m. ${ah} AH / ${ce} CE`,
  grade: "Authentification",
  gradedBy: (grader: string) => `${grader}`,
  reference: "Référence",
  hadithCount: (n: number) => `${fmt(n)} ${n === 1 ? "hadith" : "hadiths"}`,
  bookCount: (n: number) => `${n} ${n === 1 ? "livre" : "livres"}`,
  numbered: (n: number) => `Hadith ${fmt(n)}`,
  inBook: (n: number) => `Livre ${n}`,
  arabicNumbering: (n: number) => `Numérotation arabe ${fmt(n)}`,
  range: (first: number, last: number) => `Hadith ${fmt(first)}–${fmt(last)}`,
  partOf: (part: number, total: number) => `Partie ${part} sur ${total}`,
  genre: "Hadith",
  alsoKnownAs: "Également connu sous le nom de",

  // ---- how a collection is described ----
  kind: {
    sahih: "Sahih",
    sunan: "Sounan",
    muwatta: "Mouwatta",
    forty: "Quarante Hadiths",
  } as Record<string, string>,
  kindNote: {
    sahih: "Chaque hadith de ce recueil répondait à la condition d'authenticité du compilateur.",
    sunan: "Classé par chapitres de fiqh, et authentifié — chaque hadith porte le verdict des savants du hadith.",
    muwatta: "Le plus ancien recueil qui nous soit parvenu, combinant le hadith avec la pratique de Médine.",
    forty: "Un recueil court et mémorisable rassemblant des hadiths qui résument la religion.",
  } as Record<string, string>,
  sixBooks: "Kutub as-Sittah",
  sixBooksNote: "L'un des six recueils canoniques",

  // ---- the hub: /hadith ----
  hubSixTitle: "Les six recueils canoniques",
  hubSixP:
    "Les Kutub as-Sittah — les six livres que l'érudition sunnite considère comme le cœur de la Sounna enregistrée. Le Sahih al-Bukhari et le Sahih Mouslim sont les deux recueils les plus rigoureusement authentifiés ; les quatre Sounan classent les hadiths par chapitres de droit et indiquent une authentification pour chacun.",
  hubOtherTitle: "Recueils antérieurs et plus courts",
  hubOtherP:
    "La Mouwatta de l'Imam Malik est antérieure aux six autres et associe les hadiths à la pratique établie de Médine. Les recueils des Quarante Hadiths sont courts par conception — rassemblés pour être mémorisés, et constituent traditionnellement les premiers hadiths qu'un étudiant apprend.",
  hubStatsTitle: (hadiths: number, collections: number) =>
    `${fmt(hadiths)} hadiths répartis dans ${collections} recueils`,
  browseBooks: (n: number) => `Parcourir les ${n} livres`,
  openCollection: "Lire ce recueil",

  // ---- collection pages ----
  collectionTitle: (name: string, hadiths: number) => `${name} — tous les ${fmt(hadiths)} hadiths`,
  collectionDesc: (name: string, author: string, hadiths: number, books: number) =>
    `Lisez ${name} dans son intégralité — les ${fmt(hadiths)} hadiths compilés par ${author}, répartis en ${books} livres, en arabe avec une traduction. Gratuit, sans publicité, sans compte.`,
  collectionH1: (name: string) => name,
  collectionIntro: (
    name: string,
    author: string,
    hadiths: number,
    books: number,
    era: string,
    note: string,
  ) =>
    `${name} a été compilé par ${author} (${era}). Il rassemble ${fmt(hadiths)} hadiths répartis en ${books} livres de la Sounna. ${note} Chaque hadith ci-dessous est donné en arabe original avec une traduction, et chaque livre s'ouvre sur sa propre page.`,
  collectionBooksTitle: (name: string) => `Les livres de ${name}`,
  collectionBooksP: (books: number) =>
    `Les ${books} livres, dans l'ordre de l'édition imprimée. Chacun s'ouvre sur une page complète avec le texte arabe, la traduction et la référence pour chaque hadith qu'il contient.`,

  // ---- chapter (kitab) pages ----
  chapterTitle: (collection: string, title: string) => `${collection} : ${title}`,
  chapterTitlePart: (collection: string, title: string, part: number) =>
    `${collection} : ${title} — partie ${part}`,
  chapterDesc: (collection: string, title: string, n: number, hadiths: number, range: string) =>
    `Livre ${n} de ${collection}, « ${title} » — ${fmt(hadiths)} hadiths (${range}) en arabe avec une traduction et le grade d'authentification pour chacun.`,
  chapterDescPart: (
    collection: string,
    title: string,
    n: number,
    part: number,
    total: number,
    range: string,
  ) =>
    `Partie ${part} sur ${total} du livre ${n} de ${collection}, « ${title} » — ${range} en arabe avec une traduction et son authentification.`,
  chapterH1: (title: string) => title,
  chapterIntro: (
    collection: string,
    title: string,
    n: number,
    hadiths: number,
    range: string,
    author: string,
  ) =>
    `« ${title} » est le livre ${n} de ${collection}, le recueil de ${author}. Il contient ${fmt(hadiths)} hadiths — ${range} selon la numérotation standard. Chacun est présenté ci-dessous dans l'arabe original avec une traduction, sa référence complète, et l'authentification donnée par les savants du hadith lorsqu'elle a été enregistrée.`,
  /** Appended to part 1's intro when the kitab runs past one page. */
  splitNote: (parts: number) =>
    `Il est suffisamment long pour être divisé en ${parts} pages afin que chacune se charge rapidement ; les parties se suivent dans l'ordre et sont liées au bas de la page.`,
  chapterIntroPart: (
    collection: string,
    title: string,
    n: number,
    part: number,
    total: number,
    range: string,
  ) =>
    `Ceci est la partie ${part} sur ${total} de « ${title} », livre ${n} de ${collection} — ${range}. Le livre est suffisamment long pour être divisé en ${total} pages afin que chacune se charge rapidement ; les parties se suivent dans l'ordre et sont liées au bas de la page.`,

  // ---- single hadith pages (the "forty" collections) ----
  hadithTitle: (collection: string, n: number) => `Hadith ${n} de ${collection}`,
  hadithDesc: (collection: string, n: number, excerpt: string) =>
    `Hadith ${n} de ${collection} : « ${excerpt} » — le texte intégral en arabe avec une traduction et sa référence.`,
  hadithH1: (n: number) => `Hadith ${n}`,
  hadithIntro: (collection: string, n: number, total: number, author: string) =>
    `Le ${ordinal(n)} des ${total} hadiths rassemblés par ${author} dans ${collection}, donné ci-dessous dans l'arabe original avec une traduction et sa référence.`,

  // ---- navigation ----
  allBooks: (name: string) => `Tous les livres de ${name}`,
  allCollections: "Tous les recueils de hadiths",
  prevBook: "Livre précédent",
  nextBook: "Livre suivant",
  prevHadith: "Hadith précédent",
  nextHadith: "Hadith suivant",
  prevPart: "Partie précédente",
  nextPart: "Partie suivante",
  moreCollections: "Autres recueils",
  moreCollectionsP:
    "Le même hadith est souvent enregistré par plus d'un compilateur. Voici les autres recueils publiés ici dans leur intégralité.",
  onThisPage: "Sur cette page",

  // ---- FAQ (also emitted as FAQPage structured data) ----
  faqH2: "À propos des recueils de hadiths",
  hubFaq: [
    {
      q: "Qu'est-ce qu'un hadith ?",
      a: "Un hadith est un récit enregistré de ce que le Prophète Muhammad ﷺ a dit, fait ou approuvé. Ensemble, les hadiths constituent la Sounna, la deuxième source de guidance islamique après le Coran.",
    },
    {
      q: "Quels recueils de hadiths sont les plus authentiques ?",
      a: "Le Sahih al-Bukhari et le Sahih Mouslim sont considérés comme les plus rigoureusement authentifiés, et sont ensemble appelés les Sahihayn. Ils constituent les deux premiers des six recueils canoniques, les Kutub as-Sittah.",
    },
    {
      q: "Que signifient les grades Sahih, Hasan et Da'if ?",
      a: "Ce sont des verdicts sur la chaîne de transmission d'un hadith. Sahih signifie authentique, Hasan signifie bon mais avec une chaîne légèrement plus faible, et Da'if signifie faible. Bukhari et Mouslim n'ont admis que des hadiths répondant à leurs propres conditions, leurs recueils ne comportent donc pas de grade par hadith ; les quatre Sounan en ont un.",
    },
    {
      q: "D'où vient ce texte ?",
      a: "Le texte arabe, les traductions et les authentifications proviennent de l'ensemble de données ouvert hadith-api, et les titres des livres sont vérifiés avec un deuxième ensemble de données indépendant avant publication. Rien n'est édité ou abrégé.",
    },
    {
      q: "L'utilisation est-elle gratuite ?",
      a: "Oui — chaque recueil peut être lu gratuitement dans son intégralité, sans publicité, sans compte et sans mur payant. Falah est construit purement comme une Sadaqah Jariyah.",
    },
  ],
  collectionFaq: (name: string, author: string, hadiths: number, books: number) => [
    {
      q: `Combien de hadiths y a-t-il dans ${name} ?`,
      a: `Cette édition de ${name} contient ${fmt(hadiths)} hadiths répartis en ${books} livres. La numérotation diffère selon les éditions imprimées, un hadith peut donc avoir un numéro qui diffère de un ou deux par rapport à une autre copie.`,
    },
    {
      q: `Qui a compilé ${name} ?`,
      a: `${name} a été compilé par ${author}, et est publié ici dans son intégralité dans l'arabe original avec une traduction.`,
    },
    {
      q: `Puis-je lire ${name} gratuitement ?`,
      a: `Oui. Chaque livre de ${name} est une page gratuite sur Falah.io — sans compte, sans publicité, et aucun chapitre n'est retenu.`,
    },
  ],

  // ---- honesty note shown under every collection ----
  sourceNote:
    "Texte issu de l'ensemble de données ouvert hadith-api. La numérotation des hadiths suit cette édition et peut différer légèrement d'une copie imprimée — vérifiez l'arabe avec un moushaf de hadith fiable avant de vous fier à une référence.",
};

/** Thousands separators in prose, so "7580 hadiths" reads as "7 580 hadiths".
 * Fractional hadith numbers (402.2) keep their decimal. */
function fmt(n: number): string {
  return n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}

function ordinal(n: number): string {
  if (n === 1) return "1er";
  return `${n}e`;
}
