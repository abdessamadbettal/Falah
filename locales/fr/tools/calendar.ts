export const calendar = {
  meta: {
    title: "Calendrier Hégirien — date islamique d'aujourd'hui & Jours Blancs",
    description:
      "Consultez la date hégirienne d'aujourd'hui et parcourez le calendrier islamique (Umm al-Qura) mois par mois avec les dates grégoriennes, les rappels de jeûne des Jours Blancs et l'exportation .ics. Gratuit, privé, sans pubs.",
  },
  title: "Calendrier Hégirien",
  side: "التقويم الهجري",
  intro:
    "Le calendrier Umm al-Qura, mois par mois. Les Jours Blancs (Ayyam al-Bid) — les 13, 14 et 15, où le jeûne est recommandé — sont marqués en or, et vous pouvez les exporter vers votre propre calendrier.",
  todayIs: "Aujourd'hui est",
  weekdays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  today: "Aujourd'hui",
  prevMonth: "Mois précédent",
  nextMonth: "Mois suivant",
  loading: "Chargement du calendrier…",
  outOfRange: "Ce mois est en dehors de la plage prise en charge.",
  legend: "Jours Blancs — jeûne recommandé les 13, 14 et 15",
  exportBtn: (year: number) => `Exporter les Jours Blancs ${year} H (.ics)`,
  icsSummary: (month: string, year: number) => `Jours Blancs (Ayyam al-Bid) — ${month} ${year} H`,
  icsDescription: "Jeûne recommandé les 13, 14 et 15 du mois hégirien.",
  faqEyebrow: "FAQ du Calendrier Hégirien",
  faqH2: "À propos du calendrier islamique",
  faq: [
    {
      q: "Qu'est-ce que le calendrier hégirien ?",
      a: "Le calendrier hégirien est le calendrier lunaire islamique de douze mois dans une année de 354–355 jours. Falah utilise le calcul d'Umm al-Qura, la norme suivie en Arabie Saoudite.",
    },
    {
      q: "Que sont les Jours Blancs (Ayyam al-Bid) ?",
      a: "Ce sont les 13, 14 et 15 de chaque mois hégirien — les nuits de pleine lune, lorsque le Prophète ﷺ a encouragé le jeûne. Falah les marque en or et peut les exporter vers votre calendrier.",
    },
    {
      q: "Pourquoi la date hégirienne est-elle parfois décalée d'un jour par rapport à d'autres applications ?",
      a: "Un mois hégirien peut commencer un jour plus tôt ou plus tard selon l'observation locale de la lune. Falah utilise le calendrier astronomique Umm al-Qura, qui peut différer d'une annonce locale d'un jour.",
    },
    {
      q: "Quelle est la date hégirienne d'aujourd'hui ?",
      a: "La date hégirienne d'aujourd'hui est affichée en haut de la page et la case d'aujourd'hui est mise en évidence dans la grille — elle se met à jour automatiquement sur votre appareil.",
    },
    {
      q: "Puis-je ajouter les Jours Blancs à Google ou Apple Calendar ?",
      a: "Oui. Utilisez « Exporter les Jours Blancs » pour télécharger un fichier .ics que vous pouvez importer dans Google Calendar, Apple Calendar ou Outlook.",
    },
  ],
};
