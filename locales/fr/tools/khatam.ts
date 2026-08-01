export const khatam = {
  meta: {
    title: "Planificateur de Khatam Al-Coran — Fixez vos objectifs de lecture",
    description:
      "Planifiez votre lecture du Coran pour le terminer (Khatam) à une date précise. Calculez exactement combien de pages vous devez lire par jour et par prière pour atteindre votre objectif.",
  },
  title: "Planificateur de Khatam",
  side: "مخطط الختمة",
  intro:
    "Fixez votre objectif de lecture et découvrez exactement quelle quantité du Coran vous devez lire chaque jour pour terminer à temps. Vous pouvez choisir de lire au jour le jour ou de répartir la lecture après chaque prière quotidienne.",

  // Inputs
  goalType: "Comment souhaitez-vous planifier ?",
  byDays: "Par nombre de jours",
  byDate: "Par date cible",
  startDate: "Commencer la lecture le",
  endDate: "Terminer le",
  totalDays: "Nombre total de jours pour terminer",
  
  // Results
  summary: (days: number) => `Pour terminer le Coran en ${days} ${days === 1 ? 'jour' : 'jours'}, vous devez lire :`,
  pagesPerDay: "Pages par jour",
  pagesPerPrayer: "Pages par prière",
  pagesTotal: "604 pages au total",
  approximate: "(approximatif)",
  
  // States
  invalidDate: "La date de fin doit être postérieure à la date de début.",
  tooFast: "Vous ne pouvez pas terminer le Coran en moins d'un jour.",
};
