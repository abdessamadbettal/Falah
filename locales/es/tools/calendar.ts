import type { calendar as en } from "../../en/tools/calendar";

export const calendar: typeof en = {
  meta: {
    title: "Calendario de la hégira — fecha islámica de hoy y días blancos",
    description:
      "Consulta la fecha de la hégira de hoy y recorre el calendario islámico (Umm al-Qura) mes a mes con las fechas gregorianas, recordatorios del ayuno de los días blancos y exportación a .ics. Gratis, privado y sin anuncios.",
  },
  title: "Calendario inteligente de la hégira",
  side: "التقويم الهجري",
  intro:
    "El calendario Umm al-Qura, mes a mes. Los días blancos (Ayyam al-Bid) —los días 13, 14 y 15, en los que se recomienda ayunar— aparecen marcados en dorado, y puedes exportarlos a tu propio calendario.",
  todayIs: "Hoy es",
  weekdays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy",
  prevMonth: "Mes anterior",
  nextMonth: "Mes siguiente",
  loading: "Cargando el calendario…",
  outOfRange: "Este mes está fuera del intervalo admitido.",
  legend: "Días blancos: ayuno recomendado los días 13, 14 y 15",
  exportBtn: (year: number) => `Exportar los días blancos de ${year} H (.ics)`,
  icsSummary: (month: string, year: number) => `Días blancos (Ayyam al-Bid) — ${month} ${year} H`,
  icsDescription: "Ayuno recomendado los días 13, 14 y 15 del mes de la hégira.",
  faqEyebrow: "Preguntas frecuentes sobre el calendario de la hégira",
  faqH2: "Acerca del calendario islámico",
  faq: [
    {
      q: "¿Qué es el calendario de la hégira?",
      a: "El calendario de la hégira es el calendario lunar islámico, con doce meses en un año de 354 o 355 días. Falah usa el cálculo Umm al-Qura, el estándar que se sigue en Arabia Saudí.",
    },
    {
      q: "¿Qué son los días blancos (Ayyam al-Bid)?",
      a: "Son los días 13, 14 y 15 de cada mes de la hégira, que coinciden con las noches de luna llena, y en ellos el Profeta ﷺ animaba a ayunar. Falah los marca en dorado y puede exportarlos a tu calendario.",
    },
    {
      q: "¿Por qué a veces la fecha de la hégira difiere en un día de la de otras aplicaciones?",
      a: "Un mes de la hégira puede empezar un día antes o después según el avistamiento local de la luna. Falah usa el calendario astronómico Umm al-Qura, que puede diferir en un día de un anuncio local.",
    },
    {
      q: "¿Qué fecha de la hégira es hoy?",
      a: "La fecha de la hégira de hoy aparece en la parte superior de la página y la casilla de hoy está resaltada en la cuadrícula; se actualiza automáticamente en tu dispositivo.",
    },
    {
      q: "¿Puedo añadir los días blancos a Google Calendar o a Apple Calendar?",
      a: "Sí. Usa «Exportar los días blancos» para descargar un archivo .ics que puedes importar en Google Calendar, Apple Calendar u Outlook.",
    },
  ],
};
