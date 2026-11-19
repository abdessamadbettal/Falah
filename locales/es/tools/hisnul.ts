import type { hisnul as en } from "../../en/tools/hisnul";

export const hisnul: typeof en = {
  meta: {
    title: "Hisnul Muslim: súplicas (duas) y adhkar diarios auténticos con audio",
    description:
      "La fortaleza del musulmán (Hisnul Muslim) completa: todas las súplicas y los dhikr diarios auténticos con texto árabe, traducción (en inglés), número de repeticiones y recitación en audio. Gratis, sin cuentas, sin anuncios.",
  },
  title: "Hisnul Muslim",
  side: "حصن المسلم",
  intro:
    "La fortaleza del musulmán completa: todos los capítulos de súplicas diarias auténticas, con traducción (en inglés), número de repeticiones y recitación en audio de cada dua.",
  chapters: "Capítulos",
  searchPh: "Buscar un capítulo…",
  loading: "Cargando…",
  error: "No se han podido cargar los adhkar. Comprueba tu conexión e inténtalo de nuevo.",
  playChapter: "Reproducir capítulo",
  pause: "Pausa",
  selectPrompt: "Elige un capítulo para leer sus adhkar.",
  count: (n: number) => (n === 1 ? "1 dhikr" : `${n} adhkar`),
  repeat: (n: number) => `Repetir ×${n}`,
  copy: "Copiar",
  copied: "Copiado",
  faqEyebrow: "Preguntas frecuentes sobre Hisnul Muslim",
  faqH2: "Sobre estos adhkar",
  faq: [
    {
      q: "¿Qué es Hisnul Muslim?",
      a: "Hisnul Muslim («La fortaleza del musulmán») es una colección muy difundida de súplicas diarias auténticas (adhkar), recopilada por el jeque Sa'id bin Ali al-Qahtani a partir del Corán y la Sunna.",
    },
    {
      q: "¿Puedo escuchar las súplicas?",
      a: "Sí. Cada capítulo tiene una recitación completa en audio, y cada súplica tiene además su propio audio: solo tienes que tocar el botón de reproducción.",
    },
    {
      q: "¿Qué significa el número de repeticiones?",
      a: "Algunos adhkar se recitan un número determinado de veces (por ejemplo, tres o cien). La etiqueta «Repetir ×N» indica cuántas veces se dice una súplica, siguiendo la Sunna.",
    },
    {
      q: "¿Cuándo debo leer los adhkar de la mañana y de la tarde?",
      a: "Los adhkar de la mañana se leen después de Fajr y hasta la salida del sol, y los de la tarde, después de Asr y hasta la puesta del sol (o después de Maghrib). La constancia importa más que la hora exacta.",
    },
    {
      q: "¿Funciona sin cuenta?",
      a: "Sí: sin registro, sin anuncios y sin rastreo. El texto y el audio se cargan desde la API abierta de HisnMuslim.com.",
    },
  ],
};
