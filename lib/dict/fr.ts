import type { en } from "./en";

export const fr: typeof en = {
  code: "fr",
  name: "Français",

  common: {
    nav: { toolkit: "Outils", principles: "Principes", contribute: "Contribuer" },
    allTools: "Tous les outils",
    themeToLight: "Passer en mode clair",
    themeToDark: "Passer en mode sombre",
    githubAria: "Falah.io sur GitHub",
    langAria: "Changer de langue",
    tagline: "Venez à la prière, venez au succès.",
    footerDua: "Qu'Allah accepte cet effort et le rende bénéfique pour la Oumma. Amine.",
    mit: "Licence MIT",
    clientSide: "100 % côté client · aucun traçage",
    loading: "Chargement…",
    latitude: "Latitude",
    longitude: "Longitude",
    latPh: "ex. 33.5731",
    lngPh: "ex. -7.5898",
    useMyLocation: "Utiliser ma position",
    locating: "Localisation…",
    geoUnavailable: "La géolocalisation n'est pas disponible dans ce navigateur. Saisissez les coordonnées ci-dessous.",
    geoDenied: "Localisation refusée. Saisissez les coordonnées manuellement — elles restent sur cet appareil.",
  },

  meta: {
    siteTitle: "Falah.io — La boîte à outils islamique",
    titleTemplate: "%s — Falah.io",
    siteDescription:
      "15 outils islamiques gratuits qui fonctionnent entièrement dans votre navigateur : horaires de prière, Qibla, calendrier hégirien, Zakat, Coran, héritage et plus. Open source, sans publicité, sans compte, sans traçage.",
  },

  home: {
    eyebrow: "Open source · Sadaqa Jariya",
    h1a: (n: number) => `${n} outils islamiques.`,
    h1b: "Zéro traçage.",
    heroP:
      "Horaires de prière, Qibla, Zakat, Coran et plus — chaque calcul s'exécute dans votre navigateur. Pas de compte, pas de publicité, pas de contenu payant. Des outils précis pour la Oumma, conçus comme une aumône continue.",
    ctaExplore: "Découvrir les outils",
    ctaGithub: "Étoiler sur GitHub",
    todayIs: "Nous sommes le",
    falahCaption: "falāḥ — la réussite",
    heroQuote: "« Venez à la prière, venez au succès. » — l'appel qui a donné son nom à ce projet.",
    principlesEyebrow: "Différent par conception",
    principles: [
      {
        icon: "ph:shield-check",
        title: "100 % privé, côté client",
        body: "Horaires de prière, Zakat, Qibla et héritage sont tous calculés sur votre appareil. Vos données ne quittent jamais le navigateur.",
      },
      {
        icon: "ph:hand-heart",
        title: "Ni publicité, ni contenu payant",
        body: "La foi n'est jamais monétisée ici. Aucune publicité, aucun référencement sponsorisé, aucune fonction premium.",
      },
      {
        icon: "ph:lightning",
        title: "Rapide et disponible hors ligne",
        body: "Une architecture Next.js statique garde chaque outil ultra-rapide et disponible même sans connexion.",
      },
      {
        icon: "ph:user-circle-minus",
        title: "Aucun compte requis",
        body: "Ouvrez l'application et utilisez chaque fonction instantanément. Il n'y a rien à créer.",
      },
    ],
    toolkitEyebrow: "Les outils",
    toolkitH2: "Chaque outil est gratuit, pour toujours.",
    toolkitP: (n: number) =>
      `${n} utilitaires pour l'adoration, la direction, le savoir, le calcul et la créativité — tous exécutés entièrement sur votre appareil.`,
    contributeEyebrow: "Sadaqa Jariya",
    contributeH2: "Construit par la communauté, pour la Oumma.",
    contributeP:
      "Falah.io restera toujours open source, respectueux de la vie privée, sans publicité et sans offre premium. Si vous souhaitez aider à couvrir l'hébergement et le domaine, les dons volontaires sont bienvenus comme Sadaqa Jariya — mais la contribution la plus précieuse est votre temps.",
    contributeCta: "Ouvrir une pull request",
    contributions: [
      { icon: "ph:code", label: "Proposer des améliorations de code" },
      { icon: "ph:translate", label: "Aider à traduire le projet" },
      { icon: "ph:bug-beetle", label: "Signaler des bugs" },
      { icon: "ph:book-bookmark", label: "Améliorer la documentation" },
      { icon: "ph:megaphone", label: "Le partager autour de vous" },
    ],
    categories: [
      { label: "Temps et adoration quotidienne", side: "العبادة اليومية" },
      { label: "Direction et communauté locale", side: "القبلة والمساجد" },
      { label: "Coran et savoir islamique", side: "القرآن والعلم" },
      { label: "Calculateurs islamiques", side: "الحاسبات الشرعية" },
      { label: "Outils créatifs et utilitaires", side: "أدوات إبداعية" },
    ],
    toolCards: {
      prayer: { name: "Horaires de prière", description: "Horaires précis pour votre position ou n'importe quel point du monde, avec compte à rebours de la prochaine prière." },
      calendar: { name: "Calendrier hégirien intelligent", description: "Calendrier islamique avec les Jours Blancs (Ayyam al-Bid) mis en évidence et export de calendrier." },
      ramadan: { name: "Compte à rebours du Ramadan", description: "Compte à rebours en direct jusqu'au Ramadan et compagnon quotidien du mois béni." },
      converter: { name: "Convertisseur hégirien ↔ grégorien", description: "Conversion instantanée entre les deux calendriers, dans les deux sens." },
      qibla: { name: "Boussole Qibla", description: "Direction de la Qibla via les capteurs de votre appareil — en local, jamais envoyée." },
      mosque: { name: "Trouver une mosquée", description: "Trouvez les mosquées proches grâce à la seule géolocalisation du navigateur." },
      quran: { name: "Explorateur du Coran", description: "Un lecteur du Coran épuré en écriture othmanienne avec traduction." },
      tafseer: { name: "Explorateur de Tafsir", description: "Lisez les explications et commentaires savants en regard de chaque verset." },
      names: { name: "99 Noms d'Allah", description: "Sens et translittérations d'al-Asma ul-Husna — fonctionne entièrement hors ligne." },
      hisnul: { name: "Hisnul Muslim", description: "Invocations quotidiennes authentiques de la Citadelle du Musulman, classées par moment." },
      zakat: { name: "Calculateur de Zakat", description: "Espèces, or, argent, investissements et actifs commerciaux — comparés au nisab." },
      inheritance: { name: "Calculateur d'héritage (Fara'id)", description: "Répartition d'une succession selon les parts coraniques fixes, 'awl et radd." },
      age: { name: "Calculateur d'âge hégirien", description: "Votre âge hégirien exact, votre prochain anniversaire hégirien et vos étapes islamiques." },
      cards: { name: "Créateur de cartes coraniques", description: "Générez de belles cartes de versets du Coran, prêtes à partager." },
      stamp: { name: "En-tête de date arabe", description: "En-têtes de date hégirienne professionnels pour vos documents islamiques." },
    },
  },

  tools: {
    prayer: {
      meta: {
        title: "Horaires de prière — salat précise pour toute ville",
        description:
          "Calculateur gratuit des horaires de prière : Fajr, Dhuhr, Asr, Maghrib et Isha pour toutes coordonnées, avec 11 méthodes de calcul. Calculé dans votre navigateur — sans traçage.",
      },
      title: "Horaires de prière",
      side: "مواقيت الصلاة",
      intro:
        "Les horaires de prière du jour pour n'importe quel point du globe, calculés sur votre appareil avec la bibliothèque astronomique adhan. Vos coordonnées ne quittent jamais le navigateur.",
      calcMethod: "Méthode de calcul",
      methods: {
        MuslimWorldLeague: "Ligue islamique mondiale",
        UmmAlQura: "Umm al-Qura (La Mecque)",
        Egyptian: "Autorité générale égyptienne",
        Karachi: "Université de Karachi",
        NorthAmerica: "ISNA (Amérique du Nord)",
        MoonsightingCommittee: "Comité d'observation lunaire",
        Dubai: "Dubaï",
        Kuwait: "Koweït",
        Qatar: "Qatar",
        Singapore: "Singapour",
        Turkey: "Turquie (Diyanet)",
      },
      nextPrayer: "Prochaine prière",
      inLabel: "dans",
      note: "Horaires du jour dans le fuseau de votre appareil. Le lever du soleil marque la fin du Fajr, ce n'est pas une prière.",
      prompt: "Partagez votre position ou saisissez des coordonnées pour voir les horaires du jour.",
      prayerNames: { fajr: "Fajr", sunrise: "Lever du soleil", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha" },
    },

    calendar: {
      meta: {
        title: "Calendrier hégirien — Umm al-Qura et Jours Blancs",
        description:
          "Parcourez le calendrier islamique (Umm al-Qura) mois par mois avec les dates grégoriennes, les rappels de jeûne des Jours Blancs et l'export .ics. Gratuit et côté client.",
      },
      title: "Calendrier hégirien intelligent",
      side: "التقويم الهجري",
      intro:
        "Le calendrier Umm al-Qura, mois par mois. Les Jours Blancs (Ayyam al-Bid) — les 13, 14 et 15, où le jeûne est recommandé — sont marqués en or et exportables vers votre propre calendrier.",
      weekdays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      today: "Aujourd'hui",
      prevMonth: "Mois précédent",
      nextMonth: "Mois suivant",
      loading: "Chargement du calendrier…",
      outOfRange: "Ce mois est hors de la plage prise en charge.",
      legend: "Jours Blancs — jeûne recommandé les 13, 14 et 15",
      exportBtn: (year: number) => `Exporter les Jours Blancs ${year} AH (.ics)`,
      icsSummary: (month: string, year: number) => `Jours Blancs (Ayyam al-Bid) — ${month} ${year} AH`,
      icsDescription: "Jeûne recommandé les 13, 14 et 15 du mois hégirien.",
    },

    ramadan: {
      meta: {
        title: "Compte à rebours du Ramadan — jours restants",
        description:
          "Compte à rebours en direct jusqu'au début du Ramadan selon le calendrier Umm al-Qura, calculé dans votre navigateur. Avec un compagnon quotidien du mois béni.",
      },
      title: "Compte à rebours du Ramadan",
      side: "رمضان",
      intro:
        "Combien de temps avant le début du mois béni — calculé depuis le calendrier Umm al-Qura sur votre appareil. Le début réel peut varier d'un jour selon l'observation locale de la lune.",
      loading: "Chargement du compte à rebours…",
      beginsIn: (year: number) => `Le Ramadan ${year} AH commence dans`,
      units: { days: "jours", hours: "heures", minutes: "minutes", seconds: "secondes" },
      expected: "Début prévu le",
      mubarak: "Ramadan Moubarak",
      dayX: (d: number) => `Jour ${d}`,
      remain: (year: number, d: number) => `du Ramadan ${year} AH · ${d} jours restants`,
      companion: "Compagnon quotidien",
      tips: [
        "Le souhour se termine au Fajr et l'iftar est au Maghrib — vérifiez les horaires exacts pour votre ville.",
        "Les dix dernières nuits portent Laylat al-Qadr ; intensifiez l'adoration à partir du 21e jour.",
        "Le jeûne des Jours Blancs (13–15) entretient l'habitude le reste de l'année.",
      ],
      linkPrayer: "Horaires de prière",
      linkCalendar: "Calendrier hégirien",
    },

    converter: {
      meta: {
        title: "Convertisseur de dates hégirien ↔ grégorien",
        description:
          "Convertissez instantanément les dates entre les calendriers hégirien (Umm al-Qura) et grégorien, dans les deux sens. Gratuit, précis et entièrement côté client.",
      },
      title: "Convertisseur hégirien ↔ grégorien",
      side: "محول التاريخ",
      intro: "Conversion instantanée dans les deux sens avec le calendrier Umm al-Qura, entièrement sur votre appareil.",
      loading: "Chargement du convertisseur…",
      g2h: "Grégorien → Hégirien",
      h2g: "Hégirien → Grégorien",
      gregDate: "Date grégorienne",
      day: "Jour",
      month: "Mois",
      yearAH: "Année (AH)",
      pick: "Choisissez une date à convertir.",
      invalid: "Date Umm al-Qura invalide — ce mois ne compte peut-être que 29 jours.",
    },

    qibla: {
      meta: {
        title: "Boussole Qibla — direction de la Kaaba",
        description:
          "Trouvez la direction de la Qibla depuis n'importe quelles coordonnées : cap exact depuis le nord vrai, distance jusqu'à la Kaaba et boussole en direct sur mobile. Aucune donnée ne quitte votre appareil.",
      },
      title: "Boussole Qibla",
      side: "اتجاه القبلة",
      intro:
        "Le cap orthodromique de votre position vers la Kaaba, calculé en local. Sur les téléphones équipés d'une boussole, l'aiguille tourne en direct.",
      enableCompass: "Activer la boussole",
      compassActive: "Boussole active",
      noCompass: "Pas de capteur boussole ici — utilisez le cap depuis le nord vrai.",
      fromNorth: "depuis le nord vrai",
      needleLive: "L'aiguille est en direct — elle pointe vers la Qibla quand vous tournez.",
      faceNorth: "Faites face au nord vrai, puis tournez de l'angle indiqué.",
      distance: (km: string) => `Distance jusqu'à la Kaaba : ${km} km.`,
      prompt: "Partagez votre position ou saisissez des coordonnées pour trouver la Qibla.",
    },

    mosque: {
      meta: {
        title: "Trouver une mosquée — mosquées proches sur OpenStreetMap",
        description:
          "Trouvez les mosquées près de chez vous grâce aux données communautaires d'OpenStreetMap. Votre position sert à une seule recherche et n'est jamais stockée. Gratuit, sans compte, sans traçage.",
      },
      title: "Trouver une mosquée",
      side: "أقرب مسجد",
      intro:
        "Les mosquées proches, issues des données communautaires d'OpenStreetMap. Votre position sert uniquement à cette recherche — rien n'est stocké nulle part.",
      radius: "Rayon de recherche",
      find: "Chercher des mosquées",
      searching: "Recherche…",
      errorService: "Le service cartographique n'a pas répondu. Réessayez dans un instant.",
      unnamed: "Mosquée sans nom",
      away: (km: string) => `à ${km} km`,
      directions: "Itinéraire",
      osm: "OpenStreetMap",
      noResults: (r: number) =>
        `Aucune mosquée référencée à moins de ${r} km ici. Essayez un rayon plus large — la couverture cartographique varie selon les régions.`,
    },

    quran: {
      meta: {
        title: "Explorateur du Coran — lire le Coran en ligne",
        description:
          "Lisez les 114 sourates du Coran en écriture othmanienne avec traduction française. Typographie arabe soignée, gratuit, sans compte, sans publicité.",
      },
      title: "Explorateur du Coran",
      side: "القرآن الكريم",
      intro:
        "Lisez le Coran en écriture othmanienne avec la traduction de Muhammad Hamidullah. Le texte provient de l'API ouverte AlQuran.cloud — sans compte, sans traçage.",
      surah: "Sourate",
      showTranslation: "Afficher la traduction",
      loadingSurah: "Chargement de la sourate…",
      errSurah: "Impossible de charger cette sourate. Vérifiez votre connexion et réessayez.",
      errList: "Impossible de charger la liste des sourates. Vérifiez votre connexion et réessayez.",
      ayahs: "versets",
      revelation: { Meccan: "Mecquoise", Medinan: "Médinoise" } as Record<string, string>,
      translationEdition: "fr.hamidullah",
    },

    tafseer: {
      meta: {
        title: "Explorateur de Tafsir — commentaire du Coran verset par verset",
        description:
          "Lisez les versets coraniques avec le tafsir classique : Al-Muyassar et Al-Jalalayn en arabe, plus une traduction. Gratuit et côté client.",
      },
      title: "Explorateur de Tafsir",
      side: "التفسير",
      intro:
        "Lisez chaque verset accompagné d'un commentaire classique — Al-Muyassar et Al-Jalalayn en arabe, ou une traduction.",
      commentary: "Commentaire",
      loadingTafseer: "Chargement du commentaire…",
      tafsirs: [
        { id: "ar.muyassar", label: "Al-Muyassar (arabe)" },
        { id: "ar.jalalayn", label: "Al-Jalalayn (arabe)" },
        { id: "fr.hamidullah", label: "Hamidullah (traduction française)" },
      ],
    },

    names: {
      meta: {
        title: "99 Noms d'Allah — al-Asma ul-Husna avec leurs sens",
        description:
          "Les 99 Noms d'Allah avec l'arabe, la translittération et le sens. Recherche instantanée, intégrés à la page et disponibles hors ligne.",
      },
      title: "99 Noms d'Allah",
      side: "أسماء الله الحسنى",
      intro:
        "Al-Asma ul-Husna — les plus beaux noms — avec translittération et sens. Les 99 sont intégrés à la page : tout fonctionne hors ligne.",
      searchPh: "Rechercher par nom ou par sens…",
      searchAria: "Rechercher parmi les 99 noms",
      noMatch: (q: string) => `Aucun nom ne correspond à « ${q} ». Essayez une recherche plus courte.`,
    },

    hisnul: {
      meta: {
        title: "Hisnul Muslim — invocations quotidiennes authentiques",
        description:
          "Invocations authentiques de la Citadelle du Musulman (Hisnul Muslim) avec texte arabe, traduction et sources, classées par moment de la journée.",
      },
      title: "Hisnul Muslim",
      side: "حصن المسلم",
      intro:
        "Invocations quotidiennes authentiques de la Citadelle du Musulman, classées par moment de la journée. Une sélection croissante — tout est intégré, tout est hors ligne.",
      categories: ["Matin et soir", "Sommeil et réveil", "Maison et mosquée", "Repas", "Détresse et anxiété", "Voyage"],
    },

    zakat: {
      meta: {
        title: "Calculateur de Zakat — nisab et 2,5 % simplifiés",
        description:
          "Calculez la Zakat sur les espèces, l'or, l'argent, les investissements et les actifs commerciaux face au nisab or ou argent. S'exécute entièrement dans votre navigateur.",
      },
      title: "Calculateur de Zakat",
      side: "حاسبة الزكاة",
      intro:
        "Additionnez votre patrimoine zakatable, comparez-le au nisab et obtenez les 2,5 % dus — le tout calculé sur votre appareil. Rien de ce que vous saisissez n'est envoyé.",
      currency: "Devise",
      cash: "Espèces et comptes bancaires",
      goldGrams: "Or (grammes)",
      goldPrice: (c: string) => `Prix de l'or au gramme (${c})`,
      goldPriceHint: "Vérifiez le cours du jour auprès de votre bijoutier.",
      silverGrams: "Argent (grammes)",
      silverPrice: (c: string) => `Prix de l'argent au gramme (${c})`,
      investments: "Investissements et actions",
      investmentsHint: "Actions, fonds, crypto détenus pour le gain.",
      business: "Actifs commerciaux",
      businessHint: "Marchandises et créances.",
      liabilities: "Dettes à court terme",
      liabilitiesHint: "Dettes exigibles maintenant — soustraites du total.",
      nisabBasis: "Base du nisab",
      nisabHint: "Le nisab argent est plus bas ; beaucoup de savants le préfèrent pour que plus de zakat atteigne les pauvres.",
      silverOpt: (g: number) => `Argent (${g} g)`,
      goldOpt: (g: number) => `Or (${g} g)`,
      totalWealth: "Patrimoine zakatable",
      nisabLabel: (basis: string) => `Nisab (${basis})`,
      basisNames: { gold: "or", silver: "argent" },
      due: "Zakat due (2,5 %)",
      belowNisab: "Votre patrimoine est sous le nisab — aucune zakat n'est due. L'aumône volontaire (sadaqa) est toujours récompensée.",
      disclaimer:
        "La zakat est due après une année lunaire (hawl) au-dessus du nisab. Ce calculateur couvre les cas courants ; pour un patrimoine complexe, consultez un savant qualifié.",
    },

    inheritance: {
      meta: {
        title: "Calculateur d'héritage islamique (Fara'id)",
        description:
          "Répartissez une succession entre les héritiers selon les parts coraniques fixes avec les ajustements 'awl et radd. Fractions exactes, calculées localement dans votre navigateur.",
      },
      title: "Calculateur d'héritage",
      side: "حاسبة الفرائض",
      intro:
        "Répartition d'une succession entre les héritiers les plus courants, selon les parts fixes de la sourate An-Nisa avec les ajustements 'awl et radd. Tout est calculé localement.",
      estate: "Valeur nette de la succession",
      estateHint: "Après frais funéraires, dettes et legs éventuel (wasiyya, au plus un tiers).",
      spouse: "Conjoint",
      husband: "Époux",
      wivesLabel: "Épouses",
      descendants: "Descendants",
      sonsLabel: "Fils",
      daughtersLabel: "Filles",
      ascendants: "Ascendants",
      father: "Père",
      mother: "Mère",
      grandfather: "Grand-père",
      grandmother: "Grand-mère",
      siblings: "Frères et sœurs germains",
      brothersLabel: "Frères",
      sistersLabel: "Sœurs",
      heir: "Héritier",
      share: "Part",
      amount: "Montant",
      each: (f: string) => `(${f} chacun)`,
      selectPrompt: "Sélectionnez les héritiers survivants pour voir la répartition.",
      hWife: "Épouse",
      hWives: (n: number) => `Épouses (${n}, part commune)`,
      hSon: "Fils",
      hSons: (n: number) => `Fils (${n}, part commune)`,
      hDaughter: "Fille",
      hDaughters: (n: number) => `Filles (${n}, part commune)`,
      hBrother: "Frère germain",
      hBrothers: (n: number) => `Frères germains (${n}, part commune)`,
      hSister: "Sœur germaine",
      hSisters: (n: number) => `Sœurs germaines (${n}, part commune)`,
      hGrandfather: "Grand-père (à la place du père)",
      noteBlocked: "Les frères et sœurs sont exclus ici (écartés par un fils, le père ou le grand-père).",
      note411: "Fils et filles se partagent le reliquat, un fils recevant le double d'une fille (Coran 4:11).",
      noteFatherResidue: (label: string) => `${label} reçoit 1/6 plus le reliquat (en présence de filles seulement).`,
      noteAwl: (f: string) => `Les parts fixes dépassaient le tout (${f}) : toutes ont été réduites proportionnellement ('awl).`,
      noteRadd: "Le reliquat a été rendu proportionnellement aux héritiers par le sang (radd).",
      noteRaddSpouse: "Sans autre héritier, le reliquat a été rendu au conjoint.",
      noteBaytAlMal: "Sans héritier désigné, la succession revient au trésor public (bayt al-mal).",
      disclaimer:
        "Ceci couvre les héritiers courants et les règles sunnites standard ('awl, radd, hijb). Les cas plus rares — demi-frères et sœurs, petits-enfants d'un fils décédé, grands-mères multiples — nécessitent un savant qualifié. Vérifiez toujours avant de partager une succession réelle.",
    },

    age: {
      meta: {
        title: "Calculateur d'âge hégirien — votre âge dans le calendrier islamique",
        description:
          "Convertissez votre date de naissance vers le calendrier hégirien, obtenez votre âge hégirien exact, votre prochain anniversaire hégirien et vos étapes islamiques. Calculé sur votre appareil.",
      },
      title: "Calculateur d'âge hégirien",
      side: "العمر الهجري",
      intro:
        "Votre âge exact dans le calendrier islamique, votre prochain anniversaire hégirien et les étapes du chemin — calculés sur votre appareil.",
      dob: "Date de naissance (grégorienne)",
      hijriAge: "Âge hégirien",
      gregAge: "Âge grégorien",
      born: "Né(e) le",
      shorterYear: "L'année hégirienne est ~11 jours plus courte : votre âge hégirien est en avance.",
      nextBirthday: "Prochain anniversaire hégirien",
      todayBirthday: "Aujourd'hui — joyeux anniversaire hégirien !",
      inDays: (date: string, days: number) => `${date} · dans ${days} jours`,
      hijriYears: (n: number) => `${n} années hégiriennes`,
      milestones: [
        "Autour de l'âge de la maturité légale (bulugh) dans plusieurs écoles",
        "L'âge auquel le Prophète ﷺ a reçu la révélation",
        "L'âge du Prophète ﷺ à son décès — un rappel de multiplier les bonnes œuvres",
      ],
      prompt: "Saisissez votre date de naissance pour voir votre âge hégirien.",
    },

    cards: {
      meta: {
        title: "Créateur de cartes coraniques — images de versets",
        description:
          "Générez des cartes de versets du Coran en 1080×1080 avec calligraphie arabe et traduction, rendues dans votre navigateur avec canvas. Téléchargement PNG gratuit.",
      },
      title: "Créateur de cartes coraniques",
      side: "بطاقات قرآنية",
      intro: "Choisissez un verset et générez une carte prête à partager, rendue entièrement dans votre navigateur avec l'API canvas.",
      surah: "Sourate",
      ayah: (max: number) => `Verset (1–${max})`,
      style: "Style",
      styles: { emerald: "Émeraude", night: "Nuit", parchment: "Parchemin" },
      generate: "Générer la carte",
      rendering: "Rendu…",
      download: "Télécharger le PNG",
      error: "Impossible de récupérer ce verset. Vérifiez le numéro du verset et votre connexion.",
      sizeNote: "1080×1080 px — au format des réseaux sociaux.",
      reference: (name: string, s: number, a: number) => `Sourate ${name} · ${s}:${a}`,
    },

    stamp: {
      meta: {
        title: "En-tête de date arabe — dates hégiriennes pour documents",
        description:
          "Créez des en-têtes professionnels avec la date hégirienne et grégorienne en calligraphie arabe. Rendus dans votre navigateur, téléchargeables en PNG.",
      },
      title: "En-tête de date arabe",
      side: "ترويسة التاريخ",
      intro:
        "Un en-tête de date hégirienne professionnel pour documents et certificats — rendu dans votre navigateur, téléchargeable en PNG ou copiable en texte.",
      loading: "Chargement du générateur…",
      heading: "Titre (optionnel)",
      headingHint: "Organisation, mosquée ou titre du document.",
      headingPh: "ex. Mosquée An-Nour",
      date: "Date",
      download: "Télécharger le PNG",
      copy: "Copier le texte",
      copied: "Copié",
      sizeNote: "1400×460 px — s'insère proprement dans les en-têtes A4 et Letter.",
    },
  },
};
