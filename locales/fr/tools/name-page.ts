import type { namePage as en } from "../../en/tools/name-page";

const num = (n: number) => n.toLocaleString("fr-FR");

export const namePage: typeof en = {
  number: (n) => `Nom ${num(n)} sur 99`,
  h1: (word) => word,
  metaTitle: (word, meaning) => `${word} — ${meaning} | Signification et explication`,
  metaDescription: (word, arabic, meaning) =>
    `${word}${arabic === word ? "" : ` (${arabic})`} signifie « ${meaning} ». Ce que signifie ce nom d'Allah, où il apparaît dans le Coran, et comment invoquer Allah par lui. Gratuit, sans publicité ni suivi.`,
  keywords: (word, arabic) => [
    `${word} signification`,
    `que signifie ${word}`,
    `${word} nom d'Allah`,
    `${arabic} signification`,
    `${word} dans le Coran`,
    "99 noms d'Allah",
    "asma ul husna",
  ],

  meaningLabel: "Signification",
  arabicLabel: "En arabe",
  transliterationLabel: "Translittération",
  numberLabel: "Rang dans la liste",

  inQuran: (word) => `${word} dans le Coran`,
  inQuranBody: (word, n) =>
    n === 1
      ? `Le verset ci-dessous contient ce nom. Chaque référence est vérifiée sur le texte arabe du Coran avant publication : ${word} s'y trouve réellement.`
      : `Les ${num(n)} versets ci-dessous contiennent ce nom. Chaque référence est vérifiée sur le texte arabe du Coran avant publication : ${word} figure réellement dans chacun d'eux.`,

  notInQuran: (word) => `D'où vient le nom ${word} ?`,
  notInQuranBody: (word) =>
    `${word} n'apparaît pas dans le Coran comme nom autonome. Il entre dans la célèbre liste des quatre-vingt-dix-neuf par la narration d'at-Tirmidhi, et son sens est établi dans le Coran par d'autres mots — des verbes et des formes dérivées plutôt que le nom lui-même. C'est sur cette base que les savants ont retenu de tels noms ; cette page signale la distinction au lieu de la masquer.`,

  readVerse: "Lire la sourate entière",
  verseRef: (surah, s, a) => `Sourate ${surah} ${s}:${a}`,

  related: "Noms voisins dans la liste",
  browseAll: "Les 99 noms",
  browseAllBody: "L'ensemble des Asma ul Husna, chacun avec sa propre page.",

  indexEyebrow: "Parcourir les noms",
  indexTitle: "Les 99 noms d'Allah",
  indexIntro:
    "Chaque nom avec son arabe, sa translittération et sa signification — et sa propre page expliquant ce qu'il signifie, où il apparaît dans le Coran, et comment invoquer Allah par lui.",

  narrationEyebrow: "Sur la liste elle-même",
  narrationTitle: "Quelle est la fiabilité de la liste des quatre-vingt-dix-neuf ?",
  narrationBody:
    "Qu'Allah possède quatre-vingt-dix-neuf noms est établi dans Sahih al-Bukhari et Sahih Muslim, et fait l'objet d'un accord. L'énumération précise — cette liste — provient en revanche d'une narration de Jami' at-Tirmidhi qu'at-Tirmidhi lui-même a qualifiée de gharib et que de nombreux spécialistes du hadith jugent faible ; plusieurs ont estimé qu'un transmetteur avait composé la liste en parcourant le Coran et la Sunna. Des savants classiques comme al-Khattabi, Ibn Hazm, al-Qurtubi et al-Ghazali ont dressé des listes différentes. Rien de cela n'atteint les noms eux-mêmes, tous établis par ailleurs : cela signifie que le fait d'arrêter exactement ces quatre-vingt-dix-neuf relève d'un arrangement savant et non d'un texte révélé, et que les noms d'Allah ne s'y limitent pas.",

  faqEyebrow: "À propos de ce nom",
  faqH2: (word) => `Questions sur ${word}`,
  faq: (word, arabic, meaning, n, verses) => [
    {
      q: `Que signifie ${word} ?`,
      a: `${word}${arabic === word ? "" : ` (${arabic})`} signifie « ${meaning} ». Comme chacun des quatre-vingt-dix-neuf noms, il décrit un attribut d'Allah plutôt qu'il ne sert d'étiquette : c'est par les noms que le Coran enseigne qui est Allah.`,
    },
    {
      q: `${word} figure-t-il dans le Coran ?`,
      a:
        verses > 0
          ? `Oui. Cette page cite ${num(verses)} ${verses === 1 ? "verset" : "versets"} contenant ${word}, chacun vérifié sur le texte arabe avant publication.`
          : `Pas comme nom autonome. ${word} entre dans la liste des quatre-vingt-dix-neuf par la narration d'at-Tirmidhi, tandis que son sens est établi dans le Coran par des verbes et des formes dérivées. Cette page le dit clairement plutôt que de lui rattacher un verset qui ne le contient pas.`,
    },
    {
      q: "Comment invoquer Allah par ce nom ?",
      a: `Adressez-vous à Allah avec « Ya » devant le nom — « Ya ${word.replace(/^(Al|Ar|As|Ad|Az|An)-/, "")} » — et demandez ce que cet attribut accorde. Le Coran l'ordonne directement : « C'est à Allah qu'appartiennent les noms les plus beaux. Invoquez-Le donc par ces noms » (7:180).`,
    },
    {
      q: "Quel est le rang de ce nom ?",
      a: `C'est le numéro ${num(n)} de la liste bien connue. L'ordre provient de la narration d'at-Tirmidhi et relève d'un arrangement savant : la numérotation peut donc varier légèrement d'une édition à l'autre, mais non les noms eux-mêmes.`,
    },
  ],
};
