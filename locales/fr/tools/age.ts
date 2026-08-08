export const age = {
  meta: {
    title: "Calculatrice d'Âge Hégirien — votre âge dans le calendrier islamique",
    description:
      "Convertissez votre date de naissance au calendrier hégirien, obtenez votre âge hégirien exact, votre prochain anniversaire hégirien et les étapes islamiques. Calculé sur votre appareil.",
  },
  title: "Calculatrice d'Âge Hégirien",
  side: "العمر الهجري",
  intro:
    "Votre âge exact dans le calendrier islamique, votre prochain anniversaire hégirien et les étapes clés de votre vie — calculé sur votre appareil.",
  dob: "Date de naissance (Grégorienne)",
  hijriAge: "Âge hégirien",
  gregAge: "Âge grégorien",
  born: "Né le",
  shorterYear: "L'année hégirienne est plus courte d'environ 11 jours, votre âge hégirien est donc en avance.",
  nextBirthday: "Prochain anniversaire hégirien",
  todayBirthday: "Aujourd'hui — joyeux anniversaire hégirien !",
  inDays: (date: string, days: number) => `${date} · dans ${days} jours`,
  hijriYears: (n: number) => `${n} ans (H)`,
  milestones: [
    "Autour de l'âge de la maturité légale (bulugh) dans de nombreuses écoles",
    "L'âge auquel le Prophète ﷺ a reçu la révélation",
    "L'âge du Prophète ﷺ à son décès — un rappel pour multiplier les bonnes actions",
  ],
  prompt: "Entrez votre date de naissance pour voir votre âge hégirien.",
};
