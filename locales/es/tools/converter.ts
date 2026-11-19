import type { converter as en } from "../../en/tools/converter";

export const converter: typeof en = {
  meta: {
    title: "Conversor de fechas hégira ↔ gregoriano — al instante y exacto",
    description:
      "Convierte cualquier fecha entre el calendario de la hégira (Umm al-Qura) y el gregoriano al instante, en ambos sentidos, con el resultado en escritura árabe y latina. Gratis, privado y sin anuncios.",
  },
  title: "Conversor hégira ↔ gregoriano",
  side: "محول التاريخ",
  intro: "Conversión instantánea en ambos sentidos con el calendario Umm al-Qura, íntegramente en tu dispositivo.",
  loading: "Cargando el conversor…",
  g2h: "Gregoriano → Hégira",
  h2g: "Hégira → Gregoriano",
  gregDate: "Fecha gregoriana",
  day: "Día",
  month: "Mes",
  yearAH: "Año (H)",
  pick: "Elige una fecha para convertirla.",
  invalid: "No es una fecha válida del calendario Umm al-Qura: puede que este mes solo tenga 29 días.",
  faqEyebrow: "Preguntas frecuentes sobre el conversor de fechas",
  faqH2: "Acerca del conversor",
  faq: [
    {
      q: "¿Cómo convierto una fecha gregoriana a la hégira?",
      a: "Elige cualquier fecha gregoriana a la izquierda. Falah muestra al instante la fecha de la hégira (Umm al-Qura) correspondiente, en escritura latina y árabe.",
    },
    {
      q: "¿Cómo convierto una fecha de la hégira al calendario gregoriano?",
      a: "Elige el día, el mes y el año de la hégira a la derecha y aparecerá al momento la fecha gregoriana exacta.",
    },
    {
      q: "¿Qué calendario de la hégira usa el conversor?",
      a: "El calendario Umm al-Qura, que se usa en Arabia Saudí. Una fecha convertida puede diferir en un día de la que se anuncie localmente tras el avistamiento de la luna.",
    },
    {
      q: "¿Es fiable para cumpleaños y documentos oficiales?",
      a: "Es exacto en todo el intervalo admitido del calendario Umm al-Qura. Para trámites oficiales, compruébalo con el calendario reconocido en tu país.",
    },
  ],
};
