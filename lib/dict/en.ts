export const en = {
  code: "en",
  name: "English",

  common: {
    nav: { toolkit: "Toolkit", principles: "Principles", contribute: "Contribute" },
    allTools: "All tools",
    themeToLight: "Switch to light mode",
    themeToDark: "Switch to dark mode",
    githubAria: "Falah.io on GitHub",
    langAria: "Change language",
    tagline: "Come to prayer, come to success.",
    footerDua: "May Allah accept this effort and make it beneficial for the Ummah. Ameen.",
    mit: "MIT License",
    clientSide: "100% client-side · no tracking",
    loading: "Loading…",
    latitude: "Latitude",
    longitude: "Longitude",
    latPh: "e.g. 33.5731",
    lngPh: "e.g. -7.5898",
    useMyLocation: "Use my location",
    locating: "Locating…",
    geoUnavailable: "Geolocation is unavailable in this browser. Enter coordinates below.",
    geoDenied: "Location was denied. Enter coordinates manually — they stay on this device.",
  },

  meta: {
    siteTitle: "Falah.io — The Islamic Toolkit",
    titleTemplate: "%s — Falah.io",
    siteDescription:
      "15 free Islamic tools that run entirely in your browser: prayer times, Qibla, Hijri calendar, Zakat, Quran, inheritance and more. Open source, no ads, no accounts, no tracking.",
  },

  home: {
    eyebrow: "Open source · Sadaqah Jariyah",
    h1a: (n: number) => `${n} Islamic tools.`,
    h1b: "Zero tracking.",
    heroP:
      "Prayer times, Qibla, Zakat, Quran, and more — every calculation runs in your browser. No accounts, no ads, no paywalls. Just clean, accurate tools for the Ummah, built as continuous charity.",
    ctaExplore: "Explore the toolkit",
    ctaGithub: "Star on GitHub",
    todayIs: "Today is",
    falahCaption: "falāḥ — success",
    heroQuote: "“Come to prayer, come to success.” — the call this project is named after.",
    principlesEyebrow: "Different by design",
    principles: [
      {
        icon: "ph:shield-check",
        title: "100% private, client-side",
        body: "Calculation is done on your device. Your data never leaves the browser.",
      },
      {
        icon: "ph:hand-heart",
        title: "No ads, no paywalls",
        body: "Faith is never monetized here. No advertisements, no sponsored listings, no premium-only features.",
      },
      {
        icon: "ph:lightning",
        title: "Offline-ready and fast",
        body: "A static architecture keeps every tool lightning fast and available even without a connection.",
      },
      {
        icon: "ph:user-circle-minus",
        title: "No accounts required",
        body: "Open the app and use every feature instantly. There is nothing to sign up for.",
      },
    ],
    toolkitEyebrow: "The toolkit",
    toolkitH2: "Every tool ships free, forever.",
    toolkitP: (n: number) =>
      `${n} utilities across worship, direction, knowledge, calculation, and creativity — all running entirely on your device.`,
    contributeEyebrow: "Sadaqah Jariyah",
    contributeH2: "Built by the community, for the Ummah.",
    contributeP:
      "Falah.io will always remain open source, privacy-first, ad-free, and without a premium tier. If you'd like to help cover hosting and domain costs, voluntary donations are welcome as Sadaqah Jariyah — but the most valuable contribution is your time.",
    contributeCta: "Open a pull request",
    contributions: [
      { icon: "ph:code", label: "Submit code improvements" },
      { icon: "ph:translate", label: "Help translate the project" },
      { icon: "ph:bug-beetle", label: "Report bugs" },
      { icon: "ph:book-bookmark", label: "Improve documentation" },
      { icon: "ph:megaphone", label: "Share it with others" },
    ],
    categories: [
      { label: "Time & Daily Worship", side: "العبادة اليومية" },
      { label: "Direction & Local Community", side: "القبلة والمساجد" },
      { label: "Quran & Islamic Knowledge", side: "القرآن والعلم" },
      { label: "Islamic Calculators", side: "الحاسبات الشرعية" },
      { label: "Creative & Utility Tools", side: "أدوات إبداعية" },
    ],
    toolCards: {
      prayer: { name: "Prayer Times", description: "Accurate prayer times for your location or any point worldwide, with a live next-prayer countdown." },
      calendar: { name: "Hijri Smart Calendar", description: "Islamic calendar with White Days (Ayyam al-Bid) highlighted and calendar export support." },
      ramadan: { name: "Ramadan Countdown", description: "Live countdown to Ramadan and a daily companion for the blessed month." },
      converter: { name: "Hijri ↔ Gregorian Converter", description: "Instant conversion between the two calendars, both ways." },
      qibla: { name: "Qibla Finder", description: "Compass-based Qibla direction using your device sensors — locally, never uploaded." },
      mosque: { name: "Mosque Finder", description: "Find nearby mosques and prayer spaces using browser geolocation only." },
      quran: { name: "Al-Qur'an Explorer", description: "A clean Quran reader in the Uthmani script with translation." },
      tafseer: { name: "Tafseer Explorer", description: "Read explanations and scholarly commentary alongside every verse." },
      names: { name: "99 Names of Allah", description: "Meanings and transliterations of al-Asma ul-Husna — works fully offline." },
      hisnul: { name: "Hisnul Muslim", description: "Authentic daily Duas from the Fortress of the Muslim, organized by moment." },
      zakat: { name: "Zakat Calculator", description: "Cash, gold, silver, investments, and business assets — checked against the nisab." },
      inheritance: { name: "Inheritance Calculator (Fara'id)", description: "Estate distribution with fixed Quranic shares, 'awl, and radd." },
      age: { name: "Hijri Age Calculator", description: "Your exact Hijri age, next Hijri birthday, and Islamic milestones." },
      cards: { name: "Quran Card Maker", description: "Generate beautiful Quran verse cards, ready to share anywhere." },
      stamp: { name: "Arabic Letterhead Date Stamp", description: "Professional Hijri date headers and stamps for Islamic documents." },
    },
  },

  tools: {
    prayer: {
      meta: {
        title: "Prayer Times — accurate salah times for any city",
        description:
          "Free prayer times calculator: Fajr, Dhuhr, Asr, Maghrib and Isha for any coordinates, with 11 calculation methods. Computed in your browser — no tracking.",
      },
      title: "Prayer Times",
      side: "مواقيت الصلاة",
      intro:
        "Today's prayer times for any point on Earth, computed on your device with the adhan astronomical library. Your coordinates never leave the browser.",
      calcMethod: "Calculation method",
      methods: {
        MuslimWorldLeague: "Muslim World League",
        UmmAlQura: "Umm al-Qura (Makkah)",
        Egyptian: "Egyptian General Authority",
        Karachi: "University of Karachi",
        NorthAmerica: "ISNA (North America)",
        MoonsightingCommittee: "Moonsighting Committee",
        Dubai: "Dubai",
        Kuwait: "Kuwait",
        Qatar: "Qatar",
        Singapore: "Singapore",
        Turkey: "Turkey (Diyanet)",
      },
      nextPrayer: "Next prayer",
      inLabel: "in",
      note: "Times are for today in your device's timezone. Sunrise marks the end of Fajr, not a prayer.",
      prompt: "Share your location or enter coordinates to see today's times.",
      prayerNames: { fajr: "Fajr", sunrise: "Sunrise", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha" },
    },

    calendar: {
      meta: {
        title: "Hijri Calendar — Umm al-Qura with White Days",
        description:
          "Browse the Islamic (Umm al-Qura) calendar month by month with Gregorian dates, White Days fasting reminders, and .ics calendar export. Free and client-side.",
      },
      title: "Hijri Smart Calendar",
      side: "التقويم الهجري",
      intro:
        "The Umm al-Qura calendar, month by month. White Days (Ayyam al-Bid) — the 13th, 14th and 15th, when fasting is recommended — are marked in gold, and you can export them to your own calendar.",
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      today: "Today",
      prevMonth: "Previous month",
      nextMonth: "Next month",
      loading: "Loading the calendar…",
      outOfRange: "This month is outside the supported range.",
      legend: "White Days — recommended fasting on the 13th, 14th, 15th",
      exportBtn: (year: number) => `Export White Days ${year} AH (.ics)`,
      icsSummary: (month: string, year: number) => `White Days (Ayyam al-Bid) — ${month} ${year} AH`,
      icsDescription: "Recommended fasting on the 13th, 14th and 15th of the Hijri month.",
    },

    ramadan: {
      meta: {
        title: "Ramadan Countdown — days until Ramadan",
        description:
          "Live countdown to the start of Ramadan based on the Umm al-Qura calendar, computed in your browser. Includes a daily companion for the blessed month.",
      },
      title: "Ramadan Countdown",
      side: "رمضان",
      intro:
        "How long until the blessed month begins — computed from the Umm al-Qura calendar on your device. Actual start may shift by a day with local moonsighting.",
      loading: "Loading the countdown…",
      beginsIn: (year: number) => `Ramadan ${year} AH begins in`,
      units: { days: "days", hours: "hours", minutes: "minutes", seconds: "seconds" },
      expected: "Expected to begin",
      mubarak: "Ramadan Mubarak",
      dayX: (d: number) => `Day ${d}`,
      remain: (year: number, d: number) => `of Ramadan ${year} AH · ${d} days remain`,
      companion: "Daily companion",
      tips: [
        "Suhoor ends at Fajr and iftar is at Maghrib — check today's exact times for your city.",
        "The last ten nights carry Laylat al-Qadr; increase worship from day 21.",
        "White Days fasting (13th–15th) keeps the habit alive the rest of the year.",
      ],
      linkPrayer: "Prayer times",
      linkCalendar: "Hijri calendar",
    },

    converter: {
      meta: {
        title: "Hijri ↔ Gregorian Date Converter",
        description:
          "Convert dates between the Hijri (Umm al-Qura) and Gregorian calendars instantly, in both directions. Free, accurate, and fully client-side.",
      },
      title: "Hijri ↔ Gregorian Converter",
      side: "محول التاريخ",
      intro: "Instant conversion in both directions using the Umm al-Qura calendar, entirely on your device.",
      loading: "Loading the converter…",
      g2h: "Gregorian → Hijri",
      h2g: "Hijri → Gregorian",
      gregDate: "Gregorian date",
      day: "Day",
      month: "Month",
      yearAH: "Year (AH)",
      pick: "Pick a date to convert.",
      invalid: "Not a valid Umm al-Qura date — this month may have only 29 days.",
    },

    qibla: {
      meta: {
        title: "Qibla Finder — direction to the Kaaba",
        description:
          "Find the Qibla direction from any coordinates: exact bearing from true north, distance to the Kaaba, and a live compass on supported phones. No data leaves your device.",
      },
      title: "Qibla Finder",
      side: "اتجاه القبلة",
      intro:
        "The great-circle bearing from your position to the Kaaba, computed locally. On phones with a compass, the needle turns live as you rotate.",
      enableCompass: "Enable live compass",
      compassActive: "Compass active",
      noCompass: "No compass sensor here — use the bearing from true north instead.",
      fromNorth: "from true north",
      needleLive: "Needle is live — it points at the Qibla as you turn.",
      faceNorth: "Face true north, then turn by the angle shown.",
      distance: (km: string) => `Distance to the Kaaba: ${km} km.`,
      prompt: "Share your location or enter coordinates to find the Qibla.",
    },

    mosque: {
      meta: {
        title: "Mosque Finder — nearby mosques on OpenStreetMap",
        description:
          "Find mosques near you using OpenStreetMap community data. Your location is used for a single search and never stored. Free, no account, no tracking.",
      },
      title: "Mosque Finder",
      side: "أقرب مسجد",
      intro:
        "Nearby mosques from OpenStreetMap's community data. Your position is used only for this one search — nothing is stored anywhere.",
      radius: "Search radius",
      find: "Find mosques",
      searching: "Searching…",
      errorService: "The map service didn't respond. Try again in a moment.",
      unnamed: "Unnamed mosque",
      away: (km: string) => `${km} km away`,
      directions: "Directions",
      osm: "OpenStreetMap",
      noResults: (r: number) =>
        `No mosques tagged within ${r} km here. Try a wider radius — community map coverage varies by area.`,
    },

    quran: {
      meta: {
        title: "Quran Explorer — read the Quran online",
        description:
          "Read all 114 surahs of the Quran in the Uthmani script with translation. Clean Arabic typography, free, no account, no ads.",
      },
      title: "Al-Qur'an Explorer",
      side: "القرآن الكريم",
      intro:
        "Read the Quran in the Uthmani script with translation. Text is fetched from the open AlQuran.cloud API — no account, no tracking.",
      surah: "Surah",
      showTranslation: "Show translation",
      loadingSurah: "Loading surah…",
      errSurah: "Could not load this surah. Check your connection and try again.",
      errList: "Could not load the surah list. Check your connection and try again.",
      ayahs: "ayahs",
      revelation: { Meccan: "Meccan", Medinan: "Medinan" } as Record<string, string>,
      translationEdition: "en.sahih",
    },

    tafseer: {
      meta: {
        title: "Tafseer Explorer — Quran commentary verse by verse",
        description:
          "Read Quranic verses alongside classical tafsir: Al-Muyassar and Al-Jalalayn in Arabic, plus translation. Free and client-side.",
      },
      title: "Tafseer Explorer",
      side: "التفسير",
      intro:
        "Read each verse alongside classical commentary — Al-Muyassar and Al-Jalalayn in Arabic, or a translation rendering.",
      commentary: "Commentary",
      loadingTafseer: "Loading commentary…",
      tafsirs: [
        { id: "ar.muyassar", label: "Al-Muyassar (Arabic)" },
        { id: "ar.jalalayn", label: "Al-Jalalayn (Arabic)" },
        { id: "en.sahih", label: "Saheeh International (English translation)" },
      ],
    },

    names: {
      meta: {
        title: "99 Names of Allah — al-Asma ul-Husna with meanings",
        description:
          "All 99 Names of Allah with Arabic, transliteration and meaning. Searchable, embedded in the page, and fully offline-capable.",
      },
      title: "99 Names of Allah",
      side: "أسماء الله الحسنى",
      intro:
        "Al-Asma ul-Husna — the most beautiful names — with transliteration and meaning. All 99 are embedded in the page, so this works fully offline.",
      searchPh: "Search by name or meaning…",
      searchAria: "Search the 99 names",
      noMatch: (q: string) => `No name matches “${q}”. Try a shorter search.`,
    },

    hisnul: {
      meta: {
        title: "Hisnul Muslim — authentic daily duas",
        description:
          "Authentic supplications from Fortress of the Muslim (Hisnul Muslim) with Arabic text, translation and sources, organized by moment of the day.",
      },
      title: "Hisnul Muslim",
      side: "حصن المسلم",
      intro:
        "Authentic daily supplications from the Fortress of the Muslim, organized by moment of the day. A growing selection — all embedded, all offline.",
      categories: ["Morning & evening", "Sleep & waking", "Home & mosque", "Food", "Distress & anxiety", "Travel"],
    },

    zakat: {
      meta: {
        title: "Zakat Calculator — nisab and 2.5% made simple",
        description:
          "Calculate Zakat on cash, gold, silver, investments and business assets against the gold or silver nisab. Runs entirely in your browser — nothing is sent anywhere.",
      },
      title: "Zakat Calculator",
      side: "حاسبة الزكاة",
      intro:
        "Add up your zakatable wealth, compare it with the nisab, and get the 2.5% due — all computed on your device. Nothing you type is sent anywhere.",
      currency: "Currency",
      cash: "Cash & bank balances",
      goldGrams: "Gold (grams)",
      goldPrice: (c: string) => `Gold price per gram (${c})`,
      goldPriceHint: "Check today's price with your local dealer.",
      silverGrams: "Silver (grams)",
      silverPrice: (c: string) => `Silver price per gram (${c})`,
      investments: "Investments & shares",
      investmentsHint: "Stocks, funds, crypto held for gain.",
      business: "Business assets",
      businessHint: "Trade goods and receivables.",
      liabilities: "Short-term liabilities",
      liabilitiesHint: "Debts due now — subtracted from the total.",
      nisabBasis: "Nisab basis",
      nisabHint: "The silver nisab is lower; many scholars prefer it so more zakat reaches the poor.",
      silverOpt: (g: number) => `Silver (${g} g)`,
      goldOpt: (g: number) => `Gold (${g} g)`,
      totalWealth: "Zakatable wealth",
      nisabLabel: (basis: string) => `Nisab (${basis})`,
      basisNames: { gold: "gold", silver: "silver" },
      due: "Zakat due (2.5%)",
      belowNisab: "Your wealth is below the nisab — no zakat is due. Voluntary charity (sadaqah) is always rewarded.",
      disclaimer:
        "Zakat is due after one lunar year (hawl) above the nisab. This calculator covers the common cases; for complex holdings, ask a qualified scholar.",
    },

    inheritance: {
      meta: {
        title: "Islamic Inheritance Calculator (Fara'id)",
        description:
          "Distribute an estate among heirs using the fixed Quranic shares with 'awl and radd adjustments. Exact fractions, computed locally in your browser.",
      },
      title: "Inheritance Calculator",
      side: "حاسبة الفرائض",
      intro:
        "Distribution of an estate among the most common heirs, following the fixed shares of Surah An-Nisa with 'awl and radd adjustments. Everything is computed locally.",
      estate: "Net estate value",
      estateHint: "After funeral costs, debts, and any bequest (wasiyyah, at most one third).",
      spouse: "Spouse",
      husband: "Husband",
      wivesLabel: "Wives",
      descendants: "Descendants",
      sonsLabel: "Sons",
      daughtersLabel: "Daughters",
      ascendants: "Ascendants",
      father: "Father",
      mother: "Mother",
      grandfather: "Grandfather",
      grandmother: "Grandmother",
      siblings: "Full siblings",
      brothersLabel: "Brothers",
      sistersLabel: "Sisters",
      heir: "Heir",
      share: "Share",
      amount: "Amount",
      each: (f: string) => `(${f} each)`,
      selectPrompt: "Select the surviving heirs to see the distribution.",
      hWife: "Wife",
      hWives: (n: number) => `Wives (${n}, shared)`,
      hSon: "Son",
      hSons: (n: number) => `Sons (${n}, shared)`,
      hDaughter: "Daughter",
      hDaughters: (n: number) => `Daughters (${n}, shared)`,
      hBrother: "Full brother",
      hBrothers: (n: number) => `Full brothers (${n}, shared)`,
      hSister: "Full sister",
      hSisters: (n: number) => `Full sisters (${n}, shared)`,
      hGrandfather: "Grandfather (in place of the father)",
      noteBlocked: "Brothers and sisters are excluded here (blocked by a son, father, or grandfather).",
      note411: "Sons and daughters share the remainder, a son receiving twice a daughter's portion (Quran 4:11).",
      noteFatherResidue: (label: string) => `${label} takes 1/6 plus the remainder (with only daughters present).`,
      noteAwl: (f: string) => `The fixed shares exceeded the whole (${f}), so all were proportionally reduced ('awl).`,
      noteRadd: "The remainder was returned proportionally to the blood-relative sharers (radd).",
      noteRaddSpouse: "With no other heirs, the remainder was returned to the spouse.",
      noteBaytAlMal: "With no listed heirs, the estate passes to the public treasury (bayt al-mal).",
      disclaimer:
        "This covers the common heirs and standard Sunni rules ('awl, radd, hijb). Rarer cases — paternal/maternal half-siblings, grandchildren of a deceased son, multiple grandmothers — need a qualified scholar. Always verify before dividing an actual estate.",
    },

    age: {
      meta: {
        title: "Hijri Age Calculator — your age in the Islamic calendar",
        description:
          "Convert your date of birth to the Hijri calendar, get your exact Hijri age, your next Hijri birthday, and Islamic milestones. Computed on your device.",
      },
      title: "Hijri Age Calculator",
      side: "العمر الهجري",
      intro:
        "Your exact age in the Islamic calendar, your next Hijri birthday, and milestones along the way — computed on your device.",
      dob: "Date of birth (Gregorian)",
      hijriAge: "Hijri age",
      gregAge: "Gregorian age",
      born: "Born",
      shorterYear: "The Hijri year is ~11 days shorter, so your Hijri age runs ahead.",
      nextBirthday: "Next Hijri birthday",
      todayBirthday: "Today — happy Hijri birthday!",
      inDays: (date: string, days: number) => `${date} · in ${days} days`,
      hijriYears: (n: number) => `${n} Hijri years`,
      milestones: [
        "Around the age of legal maturity (bulugh) in many schools",
        "The age at which the Prophet ﷺ received revelation",
        "The Prophet's ﷺ age at passing — a reminder to increase good deeds",
      ],
      prompt: "Enter your date of birth to see your Hijri age.",
    },

    cards: {
      meta: {
        title: "Quran Card Maker — verse images for social media",
        description:
          "Generate 1080×1080 Quran verse cards with Arabic calligraphy and translation, rendered in your browser with canvas. Free download as PNG.",
      },
      title: "Quran Card Maker",
      side: "بطاقات قرآنية",
      intro: "Pick any verse and generate a share-ready card, rendered entirely in your browser with the canvas API.",
      surah: "Surah",
      ayah: (max: number) => `Ayah (1–${max})`,
      style: "Style",
      styles: { emerald: "Emerald", night: "Night", parchment: "Parchment" },
      generate: "Generate card",
      rendering: "Rendering…",
      download: "Download PNG",
      error: "Could not fetch that verse. Check the ayah number and your connection.",
      sizeNote: "1080×1080 px — sized for social media.",
      reference: (name: string, s: number, a: number) => `Surah ${name} · ${s}:${a}`,
    },

    stamp: {
      meta: {
        title: "Arabic Letterhead Date Stamp — Hijri date headers",
        description:
          "Create professional letterhead headers with the Hijri and Gregorian date in Arabic calligraphy. Rendered in your browser, downloadable as PNG.",
      },
      title: "Arabic Letterhead Date Stamp",
      side: "ترويسة التاريخ",
      intro:
        "A professional Hijri date header for documents and certificates — rendered in your browser, downloadable as a PNG or copied as plain text.",
      loading: "Loading the stamp maker…",
      heading: "Heading (optional)",
      headingHint: "Organization, masjid, or document title.",
      headingPh: "e.g. Masjid An-Noor",
      date: "Date",
      download: "Download PNG",
      copy: "Copy as text",
      copied: "Copied",
      sizeNote: "1400×460 px — crops cleanly into A4 and Letter headers.",
    },
  },
};
