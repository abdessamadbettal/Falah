import type { hadith as en } from "../../en/tools/hadith";

export const hadith: typeof en = {
  meta: {
    title: "Colecciones de hadices: Sahih al-Bukhari, Muslim y los Sunan",
    description:
      "Lee más de 36.000 hadices de las seis colecciones canónicas, el Muwatta del imam Malik y los Cuarenta Hadices: texto árabe completo con traducción al inglés y grado de autenticidad. Gratis, sin anuncios, sin cuentas.",
  },
  title: "Hadices",
  side: "الحديث الشريف",
  intro:
    "Los dichos y la práctica del profeta Muhammad ﷺ, tal como los recogieron los grandes compiladores. Aquí están todas las colecciones completas: el árabe original junto a una traducción al inglés, con el grado de autenticidad allí donde los sabios lo dejaron registrado.",

  // ---- reader chrome ----
  display: "Mostrar",
  showBoth: "Árabe y traducción",
  showArabic: "Solo árabe",
  showTranslation: "Solo traducción",
  textSize: "Tamaño del texto",
  reading: "Lectura",
  controls: "Ajustes de lectura",
  openControls: "Abrir los ajustes de lectura",
  close: "Cerrar",
  filterPh: "Filtrar estos hadices…",
  filterAria: "Filtrar los hadices de esta página",
  noMatch: (q: string) => `Ningún hadiz de esta página contiene «${q}».`,
  clearFilter: "Borrar filtro",
  matchCount: (n: number) => (n === 1 ? "1 resultado" : `${n} resultados`),
  copy: "Copiar",
  copied: "Copiado",
  copyAria: "Copiar este hadiz",
  linkAria: "Enlace a este hadiz",
  untranslated: "No hay traducción al inglés disponible para este hadiz.",

  // ---- the hub search ----
  searchPh: "Buscar una colección o un libro de hadices…",
  searchAria: "Buscar colecciones y libros de hadices",
  searchEmpty: (q: string) => `No hay resultados para «${q}». Prueba con el nombre de un libro en inglés, como «prayer» (oración) o «fasting» (ayuno).`,
  searchHint: "Escribe una colección, un libro de hadices o un tema.",
  resultsIn: "en",
};
