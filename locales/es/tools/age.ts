import type { age as en } from "../../en/tools/age";

export const age: typeof en = {
  meta: {
    title: "Calculadora de edad según la hégira — tu edad en el calendario islámico",
    description:
      "Convierte tu fecha de nacimiento al calendario de la hégira y descubre tu edad exacta según la hégira, tu próximo cumpleaños según la hégira y algunos hitos islámicos. Calculado en tu dispositivo.",
  },
  title: "Calculadora de edad según la hégira",
  side: "العمر الهجري",
  intro:
    "Tu edad exacta en el calendario islámico, tu próximo cumpleaños según la hégira y los hitos del camino, calculados en tu dispositivo.",
  dob: "Fecha de nacimiento (gregoriana)",
  hijriAge: "Edad según la hégira",
  gregAge: "Edad gregoriana",
  born: "Naciste el",
  shorterYear: "El año de la hégira es unos 11 días más corto, así que tu edad según la hégira va por delante.",
  nextBirthday: "Próximo cumpleaños según la hégira",
  todayBirthday: "Hoy: ¡feliz cumpleaños según la hégira!",
  inDays: (date: string, days: number) => `${date} · dentro de ${days} ${days === 1 ? "día" : "días"}`,
  hijriYears: (n: number) => `${n} años de la hégira`,
  milestones: [
    "En torno a la edad de madurez legal (bulugh) según muchas escuelas jurídicas",
    "La edad a la que el Profeta ﷺ recibió la revelación",
    "La edad del Profeta ﷺ al fallecer: un recordatorio para aumentar las buenas obras",
  ],
  prompt: "Introduce tu fecha de nacimiento para ver tu edad según la hégira.",
};
