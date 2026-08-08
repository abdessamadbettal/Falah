export const prayer = {
  meta: {
    title: "Horaires de Prière Aujourd'hui — heures de Salat précises par ville",
    description:
      "Horaires de prière gratuits pour n'importe quelle ville et pays : Fajr, Dhohr, Asr, Maghrib et Icha d'aujourd'hui avec un compte à rebours en direct jusqu'à la prochaine prière et 11 méthodes de calcul. Privé et calculé dans votre navigateur — sans pubs, sans suivi.",
  },
  title: "Horaires de Prière",
  side: "مواقيت الصلاة",
  intro:
    "Les cinq heures de prière quotidiennes d'aujourd'hui pour votre ville, avec un compte à rebours en direct jusqu'à la prochaine prière. Recherchez n'importe quelle ville dans le monde — votre position est détectée automatiquement — et chaque heure est calculée sur votre appareil.",
  city: "Ville",
  detecting: "Détection de votre position…",
  autoNote:
    "Votre ville est détectée automatiquement pour afficher les heures locales ; les heures de prière sont ensuite calculées sur votre appareil.",
  remaining: "restant",
  calcMethod: "Méthode de calcul",
  methods: {
    MuslimWorldLeague: "Ligue Musulmane Mondiale",
    UmmAlQura: "Umm al-Qura (La Mecque)",
    Egyptian: "Autorité Générale Égyptienne",
    Karachi: "Université de Karachi",
    NorthAmerica: "ISNA (Amérique du Nord)",
    MoonsightingCommittee: "Comité d'Observation de la Lune",
    Dubai: "Dubaï",
    Kuwait: "Koweït",
    Qatar: "Qatar",
    Singapore: "Singapour",
    Turkey: "Turquie (Diyanet)",
  },
  nextPrayer: "Prochaine prière",
  inLabel: "dans",
  note: "Les heures sont pour aujourd'hui dans le fuseau horaire de votre appareil. Le lever du soleil marque la fin du Fajr, pas une prière.",
  prompt: "Partagez votre position ou entrez des coordonnées pour voir les heures d'aujourd'hui.",
  prayerNames: { fajr: "Fajr", sunrise: "Chourouq", dhuhr: "Dhohr", asr: "Asr", maghrib: "Maghrib", isha: "Icha" },
  faqEyebrow: "FAQ sur les Horaires de Prière",
  faqH2: "À propos de ces heures",
  faq: [
    {
      q: "Comment les heures de prière sont-elles calculées ?",
      a: "Falah calcule les cinq heures de prière quotidiennes à partir de la position du soleil aux coordonnées de votre ville à l'aide de la bibliothèque astronomique adhan, puis applique la méthode de calcul que vous avez choisie (Ligue Musulmane Mondiale, Umm al-Qura, ISNA, etc.).",
    },
    {
      q: "Quelles sont les cinq prières quotidiennes ?",
      a: "Fajr (aube), Dhohr (midi), Asr (après-midi), Maghrib (juste après le coucher du soleil) et Icha (nuit). Le lever du soleil (Chourouq) est également affiché car il marque la fin de la période du Fajr.",
    },
    {
      q: "Quelle méthode de calcul dois-je choisir ?",
      a: "Utilisez celle que votre mosquée locale ou votre pays suit — par exemple Umm al-Qura en Arabie Saoudite, l'ISNA en Amérique du Nord, ou l'autorité égyptienne en Égypte. Falah sélectionne automatiquement un choix par défaut sensé pour votre pays.",
    },
    {
      q: "Les heures sont-elles exactes pour ma ville ?",
      a: "Oui. Les heures sont calculées pour les coordonnées de la ville que vous sélectionnez et affichées dans le fuseau horaire de votre appareil. Pour le résultat le plus proche, choisissez la ville la plus proche de chez vous.",
    },
    {
      q: "Est-ce que cela fonctionne hors ligne ?",
      a: "Une fois la page chargée, les heures de prière sont calculées entièrement hors ligne dans votre navigateur. Seule la détection facultative du pays utilise le réseau.",
    },
  ],
};
