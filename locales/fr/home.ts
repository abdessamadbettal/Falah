export const home = {
  eyebrow: "Open Source | Sadaqah Jariyah",
  h1a: (n: number) => `${n} Outils Islamiques`,
  h1b: "Tout ce dont un musulman a besoin en un seul endroit.",
  heroP:
    "Heures de prière, Qibla, Zakat, Coran, calendrier Hégirien, Héritage, et plus — pas de pubs, pas d'abonnements. Conçu purement comme Sadaqah Jariyah.",
  ctaExplore: "Explorer les Outils",
  ctaGithub: "Mettre une étoile sur GitHub",
  todayIs: "Aujourd'hui est",
  falahCaption: "L'appel au succès dans cette vie et dans l'au-delà (Akhira)",
  heroQuote: "« Venez au succès (Falah) » — l'appel quotidien auquel nous répondons, et une plateforme conçue pour servir votre adoration.",

  toolkitEyebrow: "La Boîte à Outils",
  toolkitH2: "Chaque outil gratuit, pour toujours.",
  toolkitP: (n: number) =>
    `${n} outils couvrant l'adoration, la direction, la connaissance, la finance et la créativité — fonctionnant tous à 100% localement sur votre appareil.`,
  searchPh: "Rechercher des outils…",
  searchAria: "Rechercher dans la boîte à outils",
  openTool: "Ouvrir",
  noMatch: (q: string) => `Aucun outil ne correspond à « ${q} ». Essayez un autre mot.`,
  faqEyebrow: "Questions Fréquentes",
  faqH2: "Des réponses, avant même de demander.",
  faq: [
    {
      q: "Est-ce que Falah.io est vraiment gratuit ?",
      a: "Oui — chaque outil est gratuit pour toujours, sans publicité, sans abonnement, et sans version premium. Falah est conçu purement comme Sadaqah Jariyah (charité continue).",
    },
    {
      q: "Dois-je créer un compte ?",
      a: "Non. Il n'y a pas d'inscription, pas d'email, et pas de connexion. Ouvrez n'importe quel outil et utilisez-le instantanément, comme une calculatrice intégrée.",
    },
    {
      q: "Ma localisation et mes données personnelles sont-elles privées ?",
      a: "Totalement. Les heures de prière, la Qibla, la Zakat et tous les autres calculs s'exécutent localement dans votre navigateur — vos coordonnées et vos entrées ne quittent jamais votre appareil.",
    },
    {
      q: "Les outils fonctionnent-ils hors ligne ?",
      a: "La plupart, oui. Falah est un site statique léger, donc une fois qu'une page est chargée, les calculatrices comme les heures de prière, le calendrier Hégirien et la Zakat continuent de fonctionner sans connexion.",
    },
    {
      q: "Quelle est la précision des heures de prière et des calculs ?",
      a: "Ils utilisent des méthodes bien établies — la bibliothèque astronomique adhan pour les prières et la Qibla, le calendrier Umm al-Qura pour les dates Hégiriennes, et les parts coraniques fixes pour l'héritage.",
    },
    {
      q: "Falah est-il open source ?",
      a: "Oui. Le code source complet est public sur GitHub, donc n'importe qui peut l'inspecter, vérifier sa confidentialité ou contribuer à des améliorations.",
    },
  ],
  contributeEyebrow: "Devenez Contributeur",
  contributeH2: "La Zakat de votre savoir construit l'avenir de votre Oumma.",
  contributeP:
    "Falah est pour toujours open-source, sans publicité, et sans versions premium. Bien que les dons aident à couvrir les coûts du serveur, donner de votre temps est votre plus grande contribution.",
  contributeCta: "Ouvrir une Pull Request",
  contributeStar: "Mettre une étoile sur GitHub",
  contributions: [
    { key: "code", icon: "ph:code", label: "Contribuer à des améliorations de code" },
    { key: "translate", icon: "ph:translate", label: "Aider à traduire le projet" },
    { key: "bugs", icon: "ph:bug-beetle", label: "Signaler des bugs & problèmes" },
    { key: "docs", icon: "ph:book-bookmark", label: "Améliorer la documentation" },
    { key: "share", icon: "ph:megaphone", label: "Partager le projet avec d'autres" },
  ],
  shareCopied: "Lien copié",
  contributorsTitle: "Les mains derrière Falah",
  contributorsP:
    "Nous demandons à Allah d'accepter chaque effort dans ce dépôt comme une charité continue et un savoir bénéfique.",
  commits: (n: number) => `${n} commit${n === 1 ? "" : "s"}`,
  joinTitle: "Votre nom ici",
  joinHint: "Ouvrir une PR",
  statStars: "étoiles",
  statForks: "forks",
  statPeople: "contributeurs",
  categories: [
    { label: "Adoration Quotidienne", side: "Temps & Adoration" },
    { label: "Qibla & Mosquées", side: "Direction" },
    { label: "Coran & Connaissance", side: "Coran & Connaissance" },
    { label: "Calculatrices Islamiques", side: "Calculatrices" },
    { label: "Outils Créatifs", side: "Créatif" },
  ],
  toolCards: {
    prayer: {
      name: "Horaires de Prière & Adhan",
      description: "Horaires de prière précis pour votre position exacte ou n'importe quelle ville du monde, comprenant un compte à rebours en direct et des alertes personnalisées."
    },
    calendar: {
      name: "Calendrier Hégirien Intelligent",
      description: "Un calendrier islamique complet mettant en évidence les Jours Blancs (Ayyam al-Bid) et les événements religieux clés, avec une exportation facile."
    },
    ramadan: {
      name: "Compagnon & Compte à Rebours du Ramadan",
      description: "Un compte à rebours en direct vers le mois béni du Ramadan, avec un planificateur quotidien pour maximiser votre adoration."
    },
    converter: {
      name: "Convertisseur de Dates (Hégirien ↔ Grégorien)",
      description: "Conversion instantanée et précise des dates entre les calendriers Hégirien et Grégorien en un seul clic."
    },
    qibla: {
      name: "Boussole Qibla Intelligente",
      description: "Recherche précise de la direction de la Kaaba à l'aide des capteurs intégrés de votre appareil, entièrement hors ligne — aucun partage de données de localisation."
    },
    mosque: {
      name: "Recherche de Mosquées à Proximité",
      description: "Localisez instantanément les mosquées et salles de prière autour de vous en utilisant la géolocalisation locale de votre navigateur en toute confidentialité."
    },
    quran: {
      name: "Explorateur Al-Qur'an (Outhmani)",
      description: "Lisez et parcourez le Saint Coran dans une écriture Outhmanie authentique, avec un lecteur épuré axé sur la typographie et sans distraction."
    },
    tafseer: {
      name: "Explorateur de Tafsir Coranique",
      description: "Lisez des explications authentiques et des commentaires savants verset par verset pour approfondir votre compréhension du Coran."
    },
    names: {
      name: "99 Noms d'Allah (Asma ul Husna)",
      description: "Explorez les Noms Divins avec leurs significations profondes, leur portée spirituelle et des prononciations audio — complètement hors ligne."
    },
    hisnul: {
      name: "Hisnul Muslim (La Citadelle du Musulman)",
      description: "Une vaste collection catégorisée d'invocations authentiques et d'Azkar quotidiens pour chaque occasion et circonstance."
    },
    zakat: {
      name: "Calculatrice Complète de Zakat",
      description: "Un outil rapide et précis pour calculer la Zakat sur l'argent, l'or, l'argent, les investissements et les actifs commerciaux en fonction du Nissab en temps réel."
    },
    inheritance: {
      name: "Calculatrice d'Héritage (Fara'id)",
      description: "Calculez avec précision la répartition de la succession selon les parts coraniques fixes et la jurisprudence islamique."
    },
    age: {
      name: "Âge Hégirien & Suivi des Étapes",
      description: "Calculez votre âge exact en années Hégiriennes, découvrez votre prochain anniversaire Hégirien et suivez les étapes importantes de votre vie."
    },
    cards: {
      name: "Créateur de Cartes Coraniques",
      description: "Concevez de superbes cartes typographiques pour les versets du Coran et les citations islamiques, optimisées pour le partage instantané sur les réseaux sociaux."
    },
    stamp: {
      name: "En-tête Arabe & Tampon de Date",
      description: "Générez des en-têtes de date Hégirienne professionnels et des tampons officiels pour ajouter une touche soignée à vos documents."
    },
  },
};
