export const ramadan = {
  meta: {
    title: "Compte à rebours du Ramadan — combien de jours avant le Ramadan ?",
    description:
      "Compte à rebours en direct jusqu'au premier jour du Ramadan — jours, heures, minutes et secondes — basé sur le calendrier Umm al-Qura et calculé dans votre navigateur. Gratuit, privé, sans pubs.",
  },
  title: "Compte à rebours du Ramadan",
  side: "رمضان",
  intro:
    "Combien de temps avant le début du mois béni — calculé à partir du calendrier Umm al-Qura sur votre appareil. Le début réel peut être décalé d'un jour en fonction de l'observation locale de la lune.",
  loading: "Chargement du compte à rebours…",
  beginsIn: (year: number) => `Le Ramadan ${year} H commence dans`,
  units: { days: "jours", hours: "heures", minutes: "minutes", seconds: "secondes" },
  expected: "Début prévu le",
  mubarak: "Ramadan Moubarak",
  dayX: (d: number) => `Jour ${d}`,
  remain: (year: number, d: number) => `du Ramadan ${year} H · il reste ${d} jours`,
  companion: "Compagnon quotidien",
  tips: [
    "Le Souhour se termine au Fajr et l'Iftar est au Maghrib — vérifiez les heures exactes d'aujourd'hui pour votre ville.",
    "Les dix dernières nuits abritent Laylat al-Qadr ; intensifiez l'adoration à partir du 21e jour.",
    "Le jeûne des Jours Blancs (13e–15e) maintient l'habitude le reste de l'année.",
  ],
  linkPrayer: "Horaires de prière",
  linkCalendar: "Calendrier Hégirien",
  faqEyebrow: "FAQ du Ramadan",
  faqH2: "À propos du compte à rebours",
  faq: [
    {
      q: "Quand commence le Ramadan cette année ?",
      a: "Le compte à rebours cible le premier jour prévu du Ramadan selon le calendrier Umm al-Qura. Le début réel peut être décalé d'un jour en fonction de l'observation locale de la lune dans votre pays.",
    },
    {
      q: "Comment le compte à rebours est-il calculé ?",
      a: "Il compte à rebours jusqu'à minuit heure locale au début du 1er Ramadan, calculé à partir du calendrier Umm al-Qura entièrement sur votre appareil.",
    },
    {
      q: "Quelles sont les dix dernières nuits du Ramadan ?",
      a: "Les dix dernières nuits, qui incluent Laylat al-Qadr (la Nuit du Destin) — les nuits les plus précieuses de l'année, où l'adoration est particulièrement encouragée.",
    },
    {
      q: "Le compte à rebours fonctionne-t-il hors ligne ?",
      a: "Oui. Une fois la page chargée, il fonctionne entièrement dans votre navigateur sans aucune connexion nécessaire.",
    },
  ],
};
