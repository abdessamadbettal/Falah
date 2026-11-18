import type { namePage as en } from "../../en/tools/name-page";

export const namePage: typeof en = {
  number: (n: number) => `Nombre ${n} de 99`,
  h1: (word: string) => word,
  metaTitle: (word: string, meaning: string) => `${word} — ${meaning} | Significado del nombre de Allah`,
  metaDescription: (word: string, arabic: string, meaning: string) =>
    `${word}${arabic === word ? "" : ` (${arabic})`} significa «${meaning}». Qué significa este nombre de Allah, dónde aparece en el Corán y cómo invocar a Allah con él. Gratis, sin anuncios, sin rastreo.`,
  keywords: (word: string, arabic: string) => [
    `${word} significado`,
    `qué significa ${word}`,
    `${word} nombre de Allah`,
    `${arabic} معنى`,
    `${word} en el Corán`,
    "99 nombres de Allah",
    "asma ul husna",
  ],

  meaningLabel: "Significado",
  arabicLabel: "En árabe",
  transliterationLabel: "Transliteración",
  numberLabel: "Posición en la lista",

  inQuran: (word: string) => `${word} en el Corán`,
  inQuranBody: (word: string, n: number) =>
    n === 1
      ? `La aleya siguiente contiene este nombre. Cada referencia se coteja con el texto árabe del Corán antes de publicarse, así que ${word} figura de verdad en la aleya en la que se cita.`
      : `Las ${n} aleyas siguientes contienen este nombre. Cada referencia se coteja con el texto árabe del Corán antes de publicarse, así que ${word} figura de verdad en cada aleya en la que se cita.`,

  notInQuran: (word: string) => `El origen de ${word}`,
  notInQuranBody: (word: string) =>
    `${word} no aparece en el Corán como nombre independiente. Llega a la famosa lista de los noventa y nueve a través de la narración de at-Tirmidhi, y su significado lo establece el Corán con otras palabras: mediante verbos y formas relacionadas, no con el propio nombre. Los sabios aceptaron estos nombres sobre esa base; esta página señala la diferencia en lugar de ocultarla.`,

  readVerse: "Leer la sura completa",
  verseRef: (surah: string, s: number, a: number) => `Sura ${surah} ${s}:${a}`,

  related: "Cercanos en la lista",
  browseAll: "Los 99 nombres",
  browseAllBody: "Los Asma ul Husna completos, cada uno con su propia página.",

  indexEyebrow: "Explora los nombres",
  indexTitle: "Los 99 nombres de Allah",
  indexIntro:
    "Cada nombre con su texto árabe, su transliteración y su significado, y con su propia página, que explica qué significa, dónde aparece en el Corán y cómo invocar a Allah con él.",

  narrationEyebrow: "Sobre la propia lista",
  narrationTitle: "¿Qué fiabilidad tiene la lista de los noventa y nueve?",
  narrationBody:
    "Que Allah tiene noventa y nueve nombres está establecido en Sahih al-Bukhari y en Sahih Muslim: es un hadiz en el que ambos coinciden. La enumeración concreta (esta lista de noventa y nueve) procede de una narración de Jami' at-Tirmidhi que el propio at-Tirmidhi calificó de gharib y que muchos sabios del hadiz consideran débil; varios sostuvieron que fue un narrador quien reunió los nombres rastreando el Corán y la Sunna. Sabios clásicos como al-Khattabi, Ibn Hazm, al-Qurtubi y al-Ghazali elaboraron sus propias listas, distintas de esta. Nada de ello afecta a los nombres en sí, todos ellos establecidos por otras vías; solo significa que el recuento de exactamente estos noventa y nueve es una ordenación de los sabios y no una relación revelada, y que los nombres de Allah no se limitan a ellos.",

  faqEyebrow: "Sobre este nombre",
  faqH2: (word: string) => `Preguntas sobre ${word}`,
  faq: (word: string, arabic: string, meaning: string, n: number, verses: number) => [
    {
      q: `¿Qué significa ${word}?`,
      a: `${word}${arabic === word ? "" : ` (${arabic})`} significa «${meaning}». Como cada uno de los noventa y nueve nombres, describe un atributo de Allah y no es una simple etiqueta: los nombres son el modo en que el Corán enseña quién es Allah.`,
    },
    {
      q: `¿Aparece ${word} en el Corán?`,
      a:
        verses > 0
          ? `Sí. Esta página cita ${verses} ${verses === 1 ? "aleya que contiene" : "aleyas que contienen"} ${word}; todas las citas se cotejan con el texto árabe antes de publicarse.`
          : `No como nombre independiente. ${word} llega a la lista de los noventa y nueve a través de la narración de at-Tirmidhi, mientras que su significado lo establece el Corán mediante verbos y formas relacionadas. Esta página lo dice claramente en lugar de adjuntar una aleya que no lo contiene.`,
    },
    {
      q: `¿Cómo invoco a Allah con este nombre?`,
      a: `Dirígete a Allah anteponiendo «Ya» al nombre («Ya ${word.replace(/^(Al|Ar|As|Ad|Az|An)-/, "")}») y pide lo que ese atributo concede. El Corán lo ordena directamente: «A Allah pertenecen los nombres más bellos; invocadlo, pues, con ellos» (7:180).`,
    },
    {
      q: `¿Qué número ocupa este nombre entre los noventa y nueve?`,
      a: `Es el número ${n} de la lista más conocida. El orden procede de la narración de at-Tirmidhi y es una ordenación de los sabios, así que la numeración puede variar ligeramente entre listas impresas; los nombres en sí, no.`,
    },
  ],
};
