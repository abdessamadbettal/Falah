import type { prayer as en } from "../../en/tools/prayer";

export const prayer: typeof en = {
  meta: {
    title: "Horarios de oración hoy — horas exactas del salat por ciudad",
    description:
      "Horarios de oración gratis para cualquier ciudad y país: Fajr, Dhuhr, Asr, Maghrib e Isha de hoy, con cuenta atrás en directo hasta la próxima oración y 11 métodos de cálculo. Privado y calculado en tu navegador: sin anuncios, sin rastreo.",
  },
  title: "Horarios de oración",
  side: "مواقيت الصلاة",
  intro:
    "Los horarios de las cinco oraciones diarias de hoy en tu ciudad, con una cuenta atrás en directo hasta la próxima oración. Busca cualquier ciudad del mundo (tu ubicación se detecta automáticamente) y todos los horarios se calculan en tu dispositivo.",
  city: "Ciudad",
  detecting: "Detectando tu ubicación…",
  autoNote:
    "Tu ciudad se detecta automáticamente para mostrar la hora local; después, los horarios de oración se calculan en tu dispositivo.",
  remaining: "restante",
  calcMethod: "Método de cálculo",
  methods: {
    MuslimWorldLeague: "Liga Mundial Musulmana",
    UmmAlQura: "Umm al-Qura (La Meca)",
    Egyptian: "Autoridad General Egipcia",
    Karachi: "Universidad de Karachi",
    NorthAmerica: "ISNA (Norteamérica)",
    MoonsightingCommittee: "Comité de Avistamiento Lunar",
    Dubai: "Dubái",
    Kuwait: "Kuwait",
    Qatar: "Catar",
    Singapore: "Singapur",
    Turkey: "Turquía (Diyanet)",
  },
  nextPrayer: "Próxima oración",
  inLabel: "en",
  note: "Los horarios corresponden a hoy en la zona horaria de tu dispositivo. La salida del sol marca el final del Fajr; no es una oración.",
  prompt: "Comparte tu ubicación o introduce unas coordenadas para ver los horarios de hoy.",
  prayerNames: { fajr: "Fajr", sunrise: "Salida del sol", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha" },
  faqEyebrow: "Preguntas frecuentes sobre los horarios de oración",
  faqH2: "Acerca de estos horarios de oración",
  faq: [
    {
      q: "¿Cómo se calculan los horarios de oración?",
      a: "Falah calcula los horarios de las cinco oraciones diarias a partir de la posición del sol en las coordenadas de tu ciudad con la biblioteca astronómica adhan, y después aplica el método de cálculo que elijas (Liga Mundial Musulmana, Umm al-Qura, ISNA y otros).",
    },
    {
      q: "¿Cuáles son las cinco oraciones diarias?",
      a: "Fajr (alba), Dhuhr (mediodía), Asr (tarde), Maghrib (justo después de la puesta del sol) e Isha (noche). También se muestra la salida del sol porque marca el final del periodo del Fajr.",
    },
    {
      q: "¿Qué método de cálculo debo elegir?",
      a: "Usa el que siga tu mezquita o tu país; por ejemplo, Umm al-Qura en Arabia Saudí, ISNA en Norteamérica o la Autoridad General Egipcia en Egipto. Falah elige automáticamente un método adecuado por defecto para tu país.",
    },
    {
      q: "¿Son exactos los horarios para mi ciudad?",
      a: "Sí. Los horarios se calculan para las coordenadas de la ciudad que selecciones y se muestran en la zona horaria de tu dispositivo. Para obtener la mayor precisión, elige la ciudad más cercana a ti.",
    },
    {
      q: "¿Funciona sin conexión?",
      a: "Una vez cargada la página, los horarios de oración se calculan totalmente sin conexión en tu navegador. Solo la detección automática del país, que es opcional, usa la red.",
    },
  ],
};
