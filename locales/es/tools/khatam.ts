import type { khatam as en } from "../../en/tools/khatam";

export const khatam: typeof en = {
  meta: {
    title: "Planificador de khatam — termina el Corán cuando tú elijas",
    description:
      "Planifica un khatam por páginas, yuz o hizb. Consulta la lectura de hoy, ábrela en el lector y sigue tu progreso día a día: el plan se reajusta solo si te retrasas.",
  },
  title: "Planificador de khatam",
  side: "مخطط الختمة",
  intro:
    "Elige cuánto tiempo quieres tardar y el planificador divide el mushaf en una lectura diaria que puedes abrir y leer al momento. Tu progreso se guarda en este dispositivo, y el plan vuelve a repartir lo que queda cada vez que te saltas un día o lees por adelantado.",

  // Setup
  setupTitle: "Planifica tu khatam",
  readBy: "Contar mi lectura en",
  units: { page: "Páginas", juz: "Yuz", hizb: "Hizb" },
  unitOf: { page: "páginas", juz: "yuz", hizb: "hizb" },
  unitOne: { page: "Página", juz: "Yuz", hizb: "Hizb" },
  unitTotals: { page: "604 páginas", juz: "30 yuz", hizb: "60 hizb" },
  goalType: "Fija la duración",
  byDays: "Por número de días",
  byDate: "Por fecha objetivo",
  presets: "Planes habituales",
  presetLabels: {
    7: "Una semana",
    30: "Un mes",
    90: "3 meses",
    365: "Un año",
  } as Record<number, string>,
  totalDays: "Días para terminar",
  startDate: "Empezar el",
  endDate: "Terminar el",
  perDay: "al día",
  aboutPages: (n: number) => `alrededor de ${n} ${n === 1 ? "página" : "páginas"} al día`,
  perPrayer: (n: number) => `≈ ${n} ${n === 1 ? "página" : "páginas"} después de cada oración`,
  finishesOn: "Terminas el",
  startKhatam: "Empezar este khatam",
  invalidDate: "La fecha de fin tiene que ser posterior a la de inicio.",
  tooFast: "Un khatam necesita al menos un día.",
  tooSlow: "Prueba con un plan más corto: el máximo son 365 días.",

  // Tracking
  progressTitle: "Tu khatam",
  ofTotal: (done: number, total: number, unit: string) => `${done} de ${total} ${unit}`,
  dayOf: (day: number, days: number) => `Día ${day} de ${days}`,
  daysLeft: (n: number) => (n === 1 ? "Queda 1 día" : `Quedan ${n} días`),
  overdue: "Fecha objetivo superada",
  onTrack: "Vas al día",
  ahead: (n: number, unit: string) => `${n} ${unit} de adelanto`,
  behind: (n: number, unit: string) => `${n} ${unit} de retraso`,
  todayPortion: "Lectura de hoy",
  range: (unit: string, from: number, to: number) =>
    from === to ? `${unit} ${from}` : `${unit} ${from}–${to}`,
  todayDone: "Has completado la lectura de hoy",
  readToday: (n: number, unit: string) => `${n} ${unit} hoy`,
  readNow: "Leer ahora",
  readAhead: "Adelantar lectura",
  markRead: (n: number, unit: string) => `He leído ${n} ${unit}`,
  undo: "Deshacer",
  finishedTitle: "Khatam completado",
  finishedBody: "Has leído el Corán de principio a fin. Que Allah te lo acepte.",
  newKhatam: "Empezar un nuevo khatam",

  // Reader bookmark
  resumeTitle: "Te quedaste en",
  syncFromReader: (unit: string, n: number) => `Marcar como leído hasta ${unit} ${n}`,

  // Stats
  thisWeek: "Esta semana",
  streak: (n: number) => (n === 1 ? "Racha de 1 día" : `Racha de ${n} días`),
  atThisPace: "A este ritmo",
  nothingYet: "Aún no has registrado ninguna lectura",
  changePlan: "Cambiar plan",
  resetPlan: "Eliminar plan",
  resetConfirm: "¿Eliminar este plan y todo su progreso?",
  keepPlan: "Conservarlo",
  savedLocally: "Guardado solo en este dispositivo.",
};
