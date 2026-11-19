import type { hadithBrowse as en } from "../../en/tools/hadith-browse";

/** Collection names, compilers and kitab titles reach these strings in their
 * English (Latin-script) form, and the translation shown beside the Arabic is
 * the English one, so the copy says "traducción al inglés". */
export const hadithBrowse: typeof en = {
  // ---- shared labels ----
  hadith: "Hadiz",
  collections: "Colecciones",
  collection: "Colección",
  book: "Libro",
  books: "Libros",
  compiler: "Compilador",
  died: (ah: number, ce: number) => `m. ${ah} H / ${ce} d. C.`,
  grade: "Grado de autenticidad",
  gradedBy: (grader: string) => `${grader}`,
  reference: "Referencia",
  hadithCount: (n: number) => `${fmt(n)} ${n === 1 ? "hadiz" : "hadices"}`,
  bookCount: (n: number) => `${n} ${n === 1 ? "libro" : "libros"}`,
  numbered: (n: number) => `Hadiz ${fmt(n)}`,
  inBook: (n: number) => `Libro ${n}`,
  arabicNumbering: (n: number) => `Numeración árabe ${fmt(n)}`,
  range: (first: number, last: number) => `hadices ${fmt(first)}–${fmt(last)}`,
  partOf: (part: number, total: number) => `Parte ${part} de ${total}`,
  genre: "Hadiz",
  alsoKnownAs: "También conocido como",

  // ---- how a collection is described ----
  kind: {
    sahih: "Sahih",
    sunan: "Sunan",
    muwatta: "Muwatta",
    forty: "Cuarenta Hadices",
  } as Record<string, string>,
  kindNote: {
    sahih: "Todos los hadices de esta colección cumplen la condición de autenticidad que se impuso el propio compilador.",
    sunan: "Ordenada por capítulos de fiqh y con grados de autenticidad: cada hadiz lleva el veredicto de los sabios del hadiz.",
    muwatta: "La colección más antigua que se conserva; combina el hadiz con la práctica de Medina.",
    forty: "Una colección breve y fácil de memorizar que reúne hadices que resumen la religión.",
  } as Record<string, string>,
  sixBooks: "Kutub as-Sitta",
  sixBooksNote: "Una de las seis colecciones canónicas",

  // ---- the hub: /hadith ----
  hubSixTitle: "Las seis colecciones canónicas",
  hubSixP:
    "Los Kutub as-Sitta son los seis libros que los sabios suníes consideran el núcleo de la Sunna recopilada. Sahih al-Bukhari y Sahih Muslim son las dos colecciones autentificadas con mayor rigor; los cuatro Sunan ordenan los hadices por capítulos de derecho y recogen un grado de autenticidad para cada uno.",
  hubOtherTitle: "Colecciones anteriores y más breves",
  hubOtherP:
    "El Muwatta del imam Malik es anterior a los seis y combina el hadiz con la práctica establecida de Medina. Las colecciones de los Cuarenta Hadices son breves a propósito: se reunieron para memorizarlas y, tradicionalmente, son los primeros hadices que aprende un estudiante.",
  hubStatsTitle: (hadiths: number, collections: number) =>
    `${fmt(hadiths)} hadices en ${collections} colecciones`,
  browseBooks: (n: number) => `Ver los ${n} libros`,
  openCollection: "Leer esta colección",

  // ---- collection pages ----
  collectionTitle: (name: string, hadiths: number) => `${name} — los ${fmt(hadiths)} hadices completos`,
  collectionDesc: (name: string, author: string, hadiths: number, books: number) =>
    `Lee ${name} íntegramente: los ${fmt(hadiths)} hadices compilados por ${author}, distribuidos en ${books} libros, en árabe con traducción al inglés. Gratis, sin anuncios, sin cuentas.`,
  collectionH1: (name: string) => name,
  collectionIntro: (
    name: string,
    author: string,
    hadiths: number,
    books: number,
    era: string,
    note: string,
  ) =>
    `${name} es obra de ${author} (${era}). Reúne ${fmt(hadiths)} hadices distribuidos en ${books} libros de la Sunna. ${note} Todos los hadices se ofrecen en el árabe original con traducción al inglés, y cada libro se abre en su propia página.`,
  collectionBooksTitle: (name: string) => `Los libros de ${name}`,
  collectionBooksP: (books: number) =>
    `Los ${books} libros, en el orden de la edición impresa. Cada uno se abre en una página completa con el texto árabe, la traducción y la referencia de cada hadiz que contiene.`,

  // ---- chapter (kitab) pages ----
  chapterTitle: (collection: string, title: string) => `${collection}: ${title}`,
  chapterTitlePart: (collection: string, title: string, part: number) =>
    `${collection}: ${title} — parte ${part}`,
  chapterDesc: (collection: string, title: string, n: number, hadiths: number, range: string) =>
    `Libro ${n} de ${collection}, «${title}»: ${fmt(hadiths)} hadices (${range}) en árabe con traducción al inglés y el grado de autenticidad de cada uno.`,
  chapterDescPart: (
    collection: string,
    title: string,
    n: number,
    part: number,
    total: number,
    range: string,
  ) =>
    `Parte ${part} de ${total} del libro ${n} de ${collection}, «${title}»: ${range} en árabe con traducción al inglés y grado de autenticidad.`,
  chapterH1: (title: string) => title,
  chapterIntro: (
    collection: string,
    title: string,
    n: number,
    hadiths: number,
    range: string,
    author: string,
  ) =>
    `«${title}» es el libro ${n} de ${collection}, la colección de ${author}. Contiene ${fmt(hadiths)} hadices (${range} en la numeración estándar). Cada uno se presenta a continuación en el árabe original con traducción al inglés, su referencia completa y, cuando consta, el grado de autenticidad que le dieron los sabios del hadiz.`,
  /** Appended to part 1's intro when the kitab runs past one page. */
  splitNote: (parts: number) =>
    `Por su extensión, se divide en ${parts} páginas para que cada una cargue rápido; las partes van en orden y están enlazadas al pie de la página.`,
  chapterIntroPart: (
    collection: string,
    title: string,
    n: number,
    part: number,
    total: number,
    range: string,
  ) =>
    `Esta es la parte ${part} de ${total} de «${title}», libro ${n} de ${collection}: ${range}. Por su extensión, el libro se divide en ${total} páginas para que cada una cargue rápido; las partes van en orden y están enlazadas al pie de la página.`,

  // ---- single hadith pages (the "forty" collections) ----
  hadithTitle: (collection: string, n: number) => `Hadiz ${n} de ${collection}`,
  hadithDesc: (collection: string, n: number, excerpt: string) =>
    `Hadiz ${n} de ${collection}: «${excerpt}». Texto árabe completo con traducción al inglés y su referencia.`,
  hadithH1: (n: number) => `Hadiz ${n}`,
  hadithIntro: (collection: string, n: number, total: number, author: string) =>
    `El ${ordinal(n)} de los ${total} hadices reunidos por ${author} en ${collection}, que se ofrece a continuación en el árabe original con traducción al inglés y su referencia.`,

  // ---- navigation ----
  allBooks: (name: string) => `Todos los libros de ${name}`,
  allCollections: "Todas las colecciones de hadices",
  prevBook: "Libro anterior",
  nextBook: "Libro siguiente",
  prevHadith: "Hadiz anterior",
  nextHadith: "Hadiz siguiente",
  prevPart: "Parte anterior",
  nextPart: "Parte siguiente",
  moreCollections: "Otras colecciones",
  moreCollectionsP:
    "Un mismo hadiz suele estar recogido por más de un compilador. Estas son las demás colecciones publicadas aquí íntegramente.",
  onThisPage: "En esta página",

  // ---- FAQ (also emitted as FAQPage structured data) ----
  faqH2: "Sobre las colecciones de hadices",
  hubFaq: [
    {
      q: "¿Qué es un hadiz?",
      a: "Un hadiz es el relato transmitido de lo que el profeta Muhammad ﷺ dijo, hizo o aprobó. En conjunto, los hadices forman la Sunna, la segunda fuente de guía islámica después del Corán.",
    },
    {
      q: "¿Qué colecciones de hadices son las más auténticas?",
      a: "Sahih al-Bukhari y Sahih Muslim se consideran las autentificadas con mayor rigor, y juntas se conocen como los Sahihayn. Son las dos primeras de las seis colecciones canónicas, los Kutub as-Sitta.",
    },
    {
      q: "¿Qué significan los grados Sahih, Hasan y Da'if?",
      a: "Son veredictos sobre la cadena de transmisión de un hadiz. Sahih significa auténtico; Hasan, bueno, aunque con una cadena algo más débil; y Da'if, débil. Bukhari y Muslim solo admitieron hadices que cumplían sus propias condiciones, por lo que sus colecciones no indican un grado para cada hadiz; los cuatro Sunan, sí.",
    },
    {
      q: "¿De dónde procede este texto?",
      a: "El texto árabe, las traducciones al inglés y los grados de autenticidad proceden del conjunto de datos abierto hadith-api, y los títulos de los libros se cotejan con un segundo conjunto de datos independiente antes de publicarse. No se edita ni se resume nada.",
    },
    {
      q: "¿Es gratis?",
      a: "Sí. Todas las colecciones se pueden leer gratis e íntegramente, sin anuncios, sin cuentas y sin muros de pago. Falah se ha creado únicamente como Sadaqah Jariyah.",
    },
  ],
  collectionFaq: (name: string, author: string, hadiths: number, books: number) => [
    {
      q: `¿Cuántos hadices hay en ${name}?`,
      a: `Esta edición de ${name} contiene ${fmt(hadiths)} hadices distribuidos en ${books} libros. La numeración varía entre ediciones impresas, así que el número de un hadiz aquí puede diferir en uno o dos del de otro ejemplar.`,
    },
    {
      q: `¿Quién compiló ${name}?`,
      a: `${name} es obra de ${author} y se publica aquí íntegramente, en el árabe original con traducción al inglés.`,
    },
    {
      q: `¿Puedo leer ${name} gratis?`,
      a: `Sí. Cada libro de ${name} es una página gratuita en Falah.io: sin cuentas, sin anuncios y sin ningún capítulo reservado.`,
    },
  ],

  // ---- honesty note shown under every collection ----
  sourceNote:
    "Texto del conjunto de datos abierto hadith-api. La numeración de los hadices sigue esa edición y puede diferir ligeramente de la de un ejemplar impreso: coteja el árabe con una edición de hadices de confianza antes de basarte en una referencia.",
};

/** Thousands separators in prose, so "36104 hadiths" reads as "36.104 hadices"
 * (es-ES, like the RAE, leaves four-digit numbers such as 7580 ungrouped).
 * Fractional hadith numbers (402.2) keep their decimal, written 402,2. */
function fmt(n: number): string {
  return n.toLocaleString("es-ES", { maximumFractionDigits: 2 });
}

/** Masculine ordinal, since it always counts a hadiz: 1 → "1.º". */
function ordinal(n: number): string {
  return `${n}.º`;
}
