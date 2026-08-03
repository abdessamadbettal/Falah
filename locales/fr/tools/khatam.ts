export const khatam = {
  meta: {
    title: "Planificateur de Khatam — terminez le Coran à la date de votre choix",
    description:
      "Planifiez un Khatam en pages, juz ou hizb. Voyez la portion du jour, ouvrez-la dans le lecteur et suivez votre progression jour après jour — le plan se réajuste si vous prenez du retard.",
  },
  title: "Planificateur de Khatam",
  side: "مخطط الختمة",
  intro:
    "Choisissez le temps que vous voulez y consacrer : le planificateur découpe le mushaf en une portion quotidienne que vous pouvez ouvrir et lire tout de suite. Votre progression reste sur cet appareil, et le plan répartit à nouveau ce qui reste dès qu'un jour est manqué ou pris d'avance.",

  // Setup
  setupTitle: "Planifiez votre khatam",
  readBy: "Compter ma lecture en",
  units: { page: "Pages", juz: "Juz", hizb: "Hizb" },
  unitOf: { page: "pages", juz: "juz", hizb: "hizb" },
  unitOne: { page: "Page", juz: "Juz", hizb: "Hizb" },
  unitTotals: { page: "604 pages", juz: "30 juz", hizb: "60 hizb" },
  goalType: "Définir la durée",
  byDays: "Par nombre de jours",
  byDate: "Par date cible",
  presets: "Plans courants",
  presetLabels: {
    7: "Une semaine",
    30: "Un mois",
    90: "3 mois",
    365: "Un an",
  } as Record<number, string>,
  totalDays: "Jours pour terminer",
  startDate: "Commencer le",
  endDate: "Terminer le",
  perDay: "par jour",
  aboutPages: (n: number) => `environ ${n} page${n === 1 ? "" : "s"} par jour`,
  perPrayer: (n: number) => `≈ ${n} page${n === 1 ? "" : "s"} après chaque prière`,
  finishesOn: "Fin le",
  startKhatam: "Commencer ce khatam",
  invalidDate: "La date de fin doit être postérieure à la date de début.",
  tooFast: "Un khatam demande au moins un jour.",
  tooSlow: "Choisissez une durée plus courte — 365 jours au maximum.",

  // Tracking
  progressTitle: "Votre khatam",
  ofTotal: (done: number, total: number, unit: string) => `${done} sur ${total} ${unit}`,
  dayOf: (day: number, days: number) => `Jour ${day} sur ${days}`,
  daysLeft: (n: number) => (n === 1 ? "1 jour restant" : `${n} jours restants`),
  overdue: "Date cible dépassée",
  onTrack: "Dans les temps",
  ahead: (n: number, unit: string) => `${n} ${unit} d'avance`,
  behind: (n: number, unit: string) => `${n} ${unit} de retard`,
  todayPortion: "Portion du jour",
  range: (unit: string, from: number, to: number) =>
    from === to ? `${unit} ${from}` : `${unit} ${from}–${to}`,
  todayDone: "La portion du jour est terminée",
  readToday: (n: number, unit: string) => `${n} ${unit} aujourd'hui`,
  readNow: "Lire maintenant",
  readAhead: "Prendre de l'avance",
  markRead: (n: number, unit: string) => `Valider ${n} ${unit}`,
  undo: "Annuler",
  finishedTitle: "Khatam terminé",
  finishedBody: "Vous avez lu le Coran d'un bout à l'autre. Qu'il soit accepté de vous.",
  newKhatam: "Commencer un nouveau khatam",

  // Reader bookmark
  resumeTitle: "Vous en étiez à",
  syncFromReader: (unit: string, n: number) => `Compter jusqu'à ${unit} ${n} comme lu`,

  // Stats
  thisWeek: "Cette semaine",
  streak: (n: number) => (n === 1 ? "1 jour d'affilée" : `${n} jours d'affilée`),
  atThisPace: "À ce rythme",
  nothingYet: "Aucune lecture enregistrée",
  changePlan: "Modifier le plan",
  resetPlan: "Supprimer le plan",
  resetConfirm: "Supprimer ce plan et toute sa progression ?",
  keepPlan: "Le garder",
  savedLocally: "Enregistré sur cet appareil uniquement.",
};
