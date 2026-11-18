import type { ramadan as en } from "../../en/tools/ramadan";

export const ramadan: typeof en = {
  meta: {
    title: "Cuenta atrás para Ramadán — ¿cuántos días faltan para Ramadán?",
    description:
      "Cuenta atrás en directo hasta el primer día de Ramadán (días, horas, minutos y segundos), basada en el calendario Umm al-Qura y calculada en tu navegador. Gratis, privada y sin anuncios.",
  },
  title: "Cuenta atrás para Ramadán",
  side: "رمضان",
  intro:
    "Cuánto falta para que empiece el mes bendito, calculado en tu dispositivo a partir del calendario Umm al-Qura. El inicio real puede variar un día según el avistamiento local de la luna.",
  loading: "Cargando la cuenta atrás…",
  beginsIn: (year: number) => `El Ramadán de ${year} H empieza dentro de`,
  units: { days: "días", hours: "horas", minutes: "minutos", seconds: "segundos" },
  expected: "Previsto para el",
  mubarak: "Ramadán Mubarak",
  dayX: (d: number) => `Día ${d}`,
  remain: (year: number, d: number) =>
    `de Ramadán de ${year} H · ${d === 1 ? "queda" : "quedan"} ${d} ${d === 1 ? "día" : "días"}`,
  companion: "Para el día a día",
  tips: [
    "El suhur termina con el Fajr y el iftar es al Maghrib: consulta los horarios exactos de hoy en tu ciudad.",
    "Laylat al-Qadr está en las diez últimas noches; intensifica la adoración a partir del día 21.",
    "El ayuno de los días blancos (del 13 al 15) mantiene vivo el hábito el resto del año.",
  ],
  linkPrayer: "Horarios de oración",
  linkCalendar: "Calendario de la hégira",
  faqEyebrow: "Preguntas frecuentes sobre Ramadán",
  faqH2: "Acerca de la cuenta atrás",
  faq: [
    {
      q: "¿Cuándo empieza el Ramadán este año?",
      a: "La cuenta atrás apunta al primer día previsto de Ramadán según el calendario Umm al-Qura. El inicio real puede variar un día según el avistamiento local de la luna en tu país.",
    },
    {
      q: "¿Cómo se calcula la cuenta atrás?",
      a: "Cuenta el tiempo que falta hasta la medianoche local con la que empieza el 1 de Ramadán, calculado a partir del calendario Umm al-Qura íntegramente en tu dispositivo.",
    },
    {
      q: "¿Qué son las diez últimas noches de Ramadán?",
      a: "Son las diez noches finales, que incluyen Laylat al-Qadr (la Noche del Decreto): las noches más valiosas del año, en las que se recomienda especialmente la adoración.",
    },
    {
      q: "¿La cuenta atrás funciona sin conexión?",
      a: "Sí. Una vez cargada la página, funciona íntegramente en tu navegador sin necesidad de conexión.",
    },
  ],
};
