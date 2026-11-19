import type { quranBrowse as en } from "../../en/tools/quran-browse";

export const quranBrowse: typeof en = {
  quran: "Corán",
  surah: "Sura",
  juz: "Yuz",
  hizb: "Hizb",
  page: "Página",
  verses: "aleyas",
  verse: "Aleya",
  meccan: "Mequí",
  medinan: "Medinense",
  readInReader: "Abrir en el lector interactivo",
  listen: "Escuchar esta recitación",
  prev: "Anterior",
  next: "Siguiente",
  backToQuran: "Todo el Corán",

  navigate: "Navegar",
  browseBy: "Explorar por",
  bySurah: "Sura",
  byJuz: "Yuz",
  byHizb: "Hizb",
  byPage: "Página",
  translationList: "Traducción, aleya por aleya",

  hubSurahsTitle: "Las 114 suras",
  hubSurahsP:
    "Todas las suras del Sagrado Corán, en el orden del mushaf. Cada una se abre en una página completa con el texto árabe en escritura uthmani, una traducción al español y audio aleya por aleya.",
  hubJuzTitle: "Los 30 yuz",
  hubJuzP:
    "El Corán dividido en sus 30 yuz: las partes de lectura con las que se completa el Corán en un mes, sobre todo en Ramadán.",
  hubHizbTitle: "Los 60 hizb",
  hubHizbP: "Cada yuz dividido en dos, para quienes llevan su lectura diaria por hizb.",
  hubPagesTitle: "Las 604 páginas del mushaf",
  hubPagesP:
    "Todas las páginas del mushaf de Medina estándar, numeradas exactamente como en la edición impresa: útil para memorizar y para seguir la lectura con un ejemplar en papel.",
  showAllPages: "Ver las 604 páginas",

  surahTitle: (name: string, meaning: string, n: number) =>
    `Sura ${name} (${meaning}) — capítulo ${n} del Corán`,
  surahDesc: (
    translit: string,
    n: number,
    meaning: string,
    ayahs: number,
    revelation: string,
    juz: number,
  ) =>
    `Lee la sura ${translit} (sura ${n} del Corán, «${meaning}») en escritura uthmani con traducción al español. ${revelation}, ${ayahs} aleyas, empieza en el yuz ${juz}. Gratis, sin anuncios, sin cuentas.`,
  surahH1: (translit: string) => `Sura ${translit}`,
  surahIntro: (
    translit: string,
    n: number,
    meaning: string,
    ayahs: number,
    revelation: string,
    juz: number,
    page: number,
  ) =>
    `La sura ${translit} es la ${ordinalF(n)} sura del Corán. Su nombre significa «${meaning}». Es una sura ${revelation.toLowerCase()} de ${ayahs} aleyas que comienza en el yuz ${juz}, en la página ${page} del mushaf. A continuación tienes el texto árabe completo en escritura uthmani con la traducción al español de cada aleya.`,

  juzTitle: (n: number, name: string) => `Yuz ${n} (${name}) — texto completo y traducción`,
  juzDesc: (n: number, translit: string, from: string, to: string, ayahs: number) =>
    `Lee el yuz ${n} del Corán (${translit}), desde ${from} hasta ${to}: ${ayahs} aleyas en escritura uthmani con traducción al español y audio. Gratis, sin anuncios, sin cuentas.`,
  juzH1: (n: number) => `Yuz ${n}`,
  juzIntro: (n: number, translit: string, from: string, to: string, ayahs: number, surahs: number) =>
    `El yuz ${n}, conocido como ${translit} por sus primeras palabras, es el ${ordinalM(n)} de los 30 yuz en que se divide la lectura del Corán. Va desde ${from} hasta ${to} y abarca ${ayahs} aleyas de ${surahs === 1 ? "una sola sura" : `${surahs} suras`}. Leyendo un yuz al día se completa el Corán en un mes.`,

  hizbTitle: (n: number, juz: number) => `Hizb ${n} (Yuz ${juz}) — texto completo y traducción`,
  hizbDesc: (n: number, juz: number, from: string, to: string, ayahs: number) =>
    `Lee el hizb ${n} del Corán, la ${n % 2 === 1 ? "primera" : "segunda"} mitad del yuz ${juz}, desde ${from} hasta ${to}: ${ayahs} aleyas en escritura uthmani con traducción al español.`,
  hizbH1: (n: number) => `Hizb ${n}`,
  hizbIntro: (n: number, juz: number, from: string, to: string, ayahs: number) =>
    `El hizb ${n} es la ${n % 2 === 1 ? "primera" : "segunda"} mitad del yuz ${juz} y uno de los 60 hizb en que se divide el Corán. Va desde ${from} hasta ${to} y contiene ${ayahs} aleyas.`,

  pageTitle: (n: number, surahs: string, juz: number) =>
    `Página ${n} del Corán — ${surahs}, yuz ${juz}`,
  pageDesc: (n: number, juz: number, surahs: string, ayahs: number) =>
    `Lee la página ${n} del Corán (${surahs}, yuz ${juz}) tal como aparece en el mushaf de Medina impreso: ${ayahs} aleyas en escritura uthmani con traducción al español y audio.`,
  pageH1: (n: number) => `Página ${n} del Corán`,
  pageIntro: (n: number, juz: number, surahs: string, ayahs: number) =>
    `La página ${n} del mushaf de Medina estándar, de 604 páginas, está en el yuz ${juz} y contiene ${ayahs} aleyas de ${surahs}. El salto de página coincide con el del mushaf impreso, así que puedes seguir la lectura con un ejemplar en papel o llevar un plan de memorización página a página.`,

  alsoIn: "También en esta parte del Corán",
  juzOfSurah: (n: number) => `Yuz ${n}`,
  pageOfSurah: (n: number) => `Página ${n}`,
  surahsOnThisPage: "Suras de esta página",
  startsAt: "Empieza en",
  ayahCount: (n: number) => `${n} ${n === 1 ? "aleya" : "aleyas"}`,
};

/** Spanish ordinal indicators: feminine for surahs ("la 18.ª sura"),
 * masculine for juz ("el 30.º"). */
function ordinalF(n: number): string {
  return `${n}.ª`;
}

function ordinalM(n: number): string {
  return `${n}.º`;
}
