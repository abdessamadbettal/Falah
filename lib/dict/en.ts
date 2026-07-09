export const en = {
  code: "en",
  name: "English",

  common: {
    nav: { toolkit: "Toolkit", principles: "Principles", contribute: "Contribute", about: "About" },
    allTools: "All tools",
    skipToContent: "Skip to content",
    themeToLight: "Switch to light mode",
    themeToDark: "Switch to dark mode",
    githubAria: "Falah.io on GitHub",
    langAria: "Change language",
    tagline: "Your daily guide to worship and success",
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
    searchCityPh: "Search for your city…",
    searching: "Searching…",
    noCityMatch: "No matching city found. Try another spelling.",
  },

  meta: {
    siteTitle: "Falah.io — The Islamic Toolkit",
    titleTemplate: "%s — Falah.io",
    siteDescription:
      "15 free Islamic tools that run entirely in your browser: prayer times, Qibla, Hijri calendar, Zakat, Quran, inheritance and more. Open source, no ads, no accounts, no tracking.",
  },

  home: {
    eyebrow: "Open Source | Sadaqah Jariyah",
    h1a: (n: number) => `${n} Islamic Tools`,
    h1b: "Everything a Muslim needs in one place.",
    heroP:
      "Prayer times, Qibla, Zakat, Quran, Hijri calendar, Inheritance, and more — no ads, no subscriptions. Built purely as Sadaqah Jariyah.",
    ctaExplore: "Explore Tools",
    ctaGithub: "Star on GitHub",
    todayIs: "Today is",
    falahCaption: "The call to success in this life and the next (Akhira)",
    heroQuote: "“Come to success (Falah)” — the daily call we answer, and a platform built to serve your worship.",

    toolkitEyebrow: "The Toolkit",
    toolkitH2: "Every tool free, forever.",
    toolkitP: (n: number) =>
      `${n} tools spanning worship, direction, knowledge, finance, and creativity — all running 100% locally on your device.`,
    searchPh: "Search tools…",
    searchAria: "Search the toolkit",
    openTool: "Open",
    noMatch: (q: string) => `No tool matches “${q}”. Try a different word.`,
    faqEyebrow: "Common Questions",
    faqH2: "Answers, before you ask.",
    faq: [
      {
        q: "Is Falah.io really free?",
        a: "Yes — every tool is free forever, with no ads, no subscriptions, and no premium tier. Falah is built purely as Sadaqah Jariyah (continuous charity).",
      },
      {
        q: "Do I need to create an account?",
        a: "No. There is no sign-up, no email, and no login. Open any tool and use it instantly, like a built-in calculator.",
      },
      {
        q: "Is my location and personal data private?",
        a: "Completely. Prayer times, Qibla, Zakat and every other calculation run locally in your browser — your coordinates and inputs never leave your device.",
      },
      {
        q: "Do the tools work offline?",
        a: "Most do. Falah is a lightweight static site, so once a page has loaded, calculators like prayer times, the Hijri calendar and Zakat keep working without a connection.",
      },
      {
        q: "How accurate are the prayer times and calculations?",
        a: "They use well-established methods — the adhan astronomical library for prayer times and Qibla, the Umm al-Qura calendar for Hijri dates, and the fixed Quranic shares for inheritance.",
      },
      {
        q: "Is Falah open source?",
        a: "Yes. The full source code is public on GitHub, so anyone can inspect it, verify its privacy, or contribute improvements.",
      },
    ],
    contributeEyebrow: "Sadaqah Jariyah",
    contributeH2: "Built by the community, for the Ummah.",
    contributeP:
      "Falah will always remain open-source, privacy-first, ad-free, and without a premium tier. While voluntary donations to help cover hosting and domain costs are welcomed as Sadaqah Jariyah, your most valuable contribution is your time.",
    contributeCta: "Open a Pull Request",
    contributions: [
      { icon: "ph:code", label: "Contribute code improvements" },
      { icon: "ph:translate", label: "Help translate the project" },
      { icon: "ph:bug-beetle", label: "Report bugs & issues" },
      { icon: "ph:book-bookmark", label: "Improve documentation" },
      { icon: "ph:megaphone", label: "Share the project with others" },
    ],
    categories: [
      { label: "Daily Worship", side: "Time & Worship" },
      { label: "Qibla & Mosques", side: "Direction" },
      { label: "Quran & Knowledge", side: "Quran & Knowledge" },
      { label: "Islamic Calculators", side: "Calculators" },
      { label: "Creative Tools", side: "Creative" },
    ],
    toolCards: {
      prayer: { 
        name: "Prayer Times & Adhan", 
        description: "Accurate prayer schedules for your precise location or any city worldwide, featuring a live countdown to the next prayer and custom alerts." 
      },
      calendar: { 
        name: "Smart Hijri Calendar", 
        description: "A comprehensive Islamic calendar highlighting the White Days (Ayyam al-Bid) and key religious events, with easy scheduling export." 
      },
      ramadan: { 
        name: "Ramadan Companion & Countdown", 
        description: "A live countdown to the blessed month of Ramadan, complete with a daily planner and guide to maximize your worship." 
      },
      converter: { 
        name: "Date Converter (Hijri ↔ Gregorian)", 
        description: "Instant and accurate two-way date conversion between the Hijri and Gregorian calendars with a single click." 
      },
      qibla: { 
        name: "Smart Qibla Compass", 
        description: "Precise Kaaba direction finding using your device's built-in sensors entirely offline — zero location tracking or server data sharing." 
      },
      mosque: { 
        name: "Nearby Mosque Finder", 
        description: "Locate mosques and prayer rooms around you instantly using local browser geolocation with complete privacy." 
      },
      quran: { 
        name: "Al-Qur'an Explorer (Uthmani)", 
        description: "Read and navigate the Holy Quran in authentic Uthmani script with a clean, typography-focused, distraction-free reader." 
      },
      tafseer: { 
        name: "Quranic Tafseer Explorer", 
        description: "Read authoritative explanations and scholarly commentary verse by verse to deepen your understanding of the Quran." 
      },
      names: { 
        name: "99 Names of Allah (Asma ul Husna)", 
        description: "Explore the Divine Names with deep meanings, spiritual significance, and audio pronunciations — completely offline." 
      },
      hisnul: { 
        name: "Hisnul Muslim (Fortress of the Muslim)", 
        description: "An extensive, categorized collection of authentic daily Duas and Azkar for every occasion and circumstance." 
      },
      zakat: { 
        name: "Comprehensive Zakat Calculator", 
        description: "A fast, precise tool to calculate Zakat on cash, gold, silver, investments, and business assets against live Nisab values." 
      },
      inheritance: { 
        name: "Inheritance Calculator (Fara'id)", 
        description: "Accurately calculate estate distribution according to fixed Quranic shares and Islamic jurisprudence, handling complex cases." 
      },
      age: { 
        name: "Hijri Age & Milestone Tracker", 
        description: "Calculate your exact age in Hijri years, find out your next Hijri birthday, and track significant life milestones." 
      },
      cards: { 
        name: "Quranic Quote & Card Maker", 
        description: "Design stunning typography cards for Quran verses and Islamic quotes, optimized and ready for instant social media sharing." 
      },
      stamp: { 
        name: "Arabic Letterhead & Date Stamp", 
        description: "Generate professional Hijri date headers and official stamps to add a polished touch to correspondence and documents." 
      },
    },
  },

  about: {
    meta: {
      title: "About — why Falah.io exists",
      description:
        "Falah.io is a free, open-source, privacy-first Islamic toolkit built as Sadaqah Jariyah. No ads, no accounts, no tracking — every tool runs entirely in your browser.",
    },
    eyebrow: "Our Mission",
    h1a: "An Islamic toolkit,",
    h1b: "built as Sadaqah Jariyah.",
    lead: "Most Islamic apps track your location, bury tools under ads, or lock daily necessities behind a paywall. Falah is different by design — a free, open-source suite of essential tools that runs entirely in your browser, offered for the sake of Allah.",
    storyTitle: "Faith, never monetized",
    story: [
      "Every calculation — prayer times, Qibla, Zakat, inheritance — happens locally on your device. Nothing you type is sent to a server, because there is no server collecting it.",
      "There are no accounts to create, no emails to hand over, and no premium tier. Open the site and every tool is simply there, like a built-in calculator.",
    ],
    principlesEyebrow: "Different by Design",
    principles: [
      {
        icon: "ph:shield-check-duotone",
        title: "100% Private & Secure",
        body: "All calculations happen locally in your browser. We never track your GPS location, and your personal data never leaves your device.",
      },
      {
        icon: "ph:hand-heart-duotone",
        title: "Always Free, No Ads",
        body: "We believe faith should never be monetized. Our platform is completely free of intrusive ads, paywalls, and sponsored results.",
      },
      {
        icon: "ph:lightning-duotone",
        title: "Lightning Fast & Offline",
        body: "Built with a lightweight static architecture for instant response times. Use the tools anywhere, anytime — even without an internet connection.",
      },
      {
        icon: "ph:user-focus-duotone",
        title: "No Account Required",
        body: "No registration or emails needed. Open the app and instantly use any tool just like a standard built-in calculator.",
      },
      {
        icon: "ph:hands-praying",
        title: "Built as Sadaqah Jariyah",
        body: "A non-profit project crafted with care to serve Muslims worldwide. It will remain free and accessible to everyone for the sake of Allah.",
      },
      {
        icon: "ph:code-duotone",
        title: "Open Source & Transparent",
        body: "Our source code is publicly available on GitHub. You can inspect the code yourself, verify its security, or contribute to its development.",
      },
      {
        icon: "ph:scales-duotone",
        title: "Scholarly & Mathematical Accuracy",
        body: "Reliable algorithms for prayer times, Qibla direction, Zakat, and Inheritance, built according to verified Islamic jurisprudence and standards.",
      },
      {
        icon: "ph:moon-stars-duotone",
        title: "Modern & Eye-Friendly UI",
        body: "A clean, distraction-free interface that supports full Dark Mode for a comfortable reading experience at any hour.",
      },
      {
        icon: "ph:squares-four-duotone",
        title: "All-in-One Toolkit",
        body: "Over 15 utilities covering daily worship, financial transactions, and creative needs — saving you from installing multiple bloated apps.",
      },
    ],
  },

  tools: {
    prayer: {
      meta: {
        title: "Prayer Times Today — accurate Salah times by city",
        description:
          "Free prayer times for any city and country: today's Fajr, Dhuhr, Asr, Maghrib and Isha with a live countdown to the next prayer and 11 calculation methods. Private and computed in your browser — no ads, no tracking.",
      },
      title: "Prayer Times",
      side: "مواقيت الصلاة",
      intro:
        "Today's five daily prayer times for your city, with a live countdown to the next prayer. Search any city in the world — your location is detected automatically — and every time is computed on your device.",
      city: "City",
      detecting: "Detecting your location…",
      autoNote:
        "Your city is detected automatically to show local times; prayer times are then calculated on your device.",
      remaining: "remaining",
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
      faqEyebrow: "Prayer Times FAQ",
      faqH2: "About these prayer times",
      faq: [
        {
          q: "How are prayer times calculated?",
          a: "Falah computes the five daily prayer times from the sun's position at your city's coordinates using the adhan astronomical library, then applies the calculation method you choose (Muslim World League, Umm al-Qura, ISNA and more).",
        },
        {
          q: "What are the five daily prayers?",
          a: "Fajr (dawn), Dhuhr (midday), Asr (afternoon), Maghrib (just after sunset) and Isha (night). Sunrise is also shown because it marks the end of the Fajr window.",
        },
        {
          q: "Which calculation method should I choose?",
          a: "Use the one your local mosque or country follows — for example Umm al-Qura in Saudi Arabia, ISNA in North America, or the Egyptian authority in Egypt. Falah selects a sensible default for your country automatically.",
        },
        {
          q: "Are the times accurate for my city?",
          a: "Yes. Times are calculated for the coordinates of the city you select and shown in your device's timezone. For the closest match, pick the city nearest to you.",
        },
        {
          q: "Does this work offline?",
          a: "Once the page has loaded, prayer times are calculated entirely offline in your browser. Only the optional country auto-detection uses the network.",
        },
      ],
    },

    calendar: {
      meta: {
        title: "Hijri Calendar — today's Islamic date & White Days",
        description:
          "See today's Hijri date and browse the Islamic (Umm al-Qura) calendar month by month with Gregorian dates, White Days fasting reminders, and .ics export. Free, private, no ads.",
      },
      title: "Hijri Smart Calendar",
      side: "التقويم الهجري",
      intro:
        "The Umm al-Qura calendar, month by month. White Days (Ayyam al-Bid) — the 13th, 14th and 15th, when fasting is recommended — are marked in gold, and you can export them to your own calendar.",
      todayIs: "Today is",
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
      faqEyebrow: "Hijri Calendar FAQ",
      faqH2: "About the Islamic calendar",
      faq: [
        {
          q: "What is the Hijri calendar?",
          a: "The Hijri calendar is the Islamic lunar calendar of twelve months in a year of 354–355 days. Falah uses the Umm al-Qura calculation, the standard followed in Saudi Arabia.",
        },
        {
          q: "What are the White Days (Ayyam al-Bid)?",
          a: "They are the 13th, 14th and 15th of each Hijri month — nights of the full moon, when the Prophet ﷺ encouraged fasting. Falah marks them in gold and can export them to your calendar.",
        },
        {
          q: "Why is the Hijri date sometimes a day off from other apps?",
          a: "A Hijri month can begin a day earlier or later depending on local moon sighting. Falah uses the astronomical Umm al-Qura calendar, which can differ from a local announcement by a day.",
        },
        {
          q: "What is today's Hijri date?",
          a: "Today's Hijri date is shown at the top of the page and today's cell is highlighted in the grid — it updates automatically on your device.",
        },
        {
          q: "Can I add the White Days to Google or Apple Calendar?",
          a: "Yes. Use “Export White Days” to download an .ics file you can import into Google Calendar, Apple Calendar, or Outlook.",
        },
      ],
    },

    ramadan: {
      meta: {
        title: "Ramadan Countdown — how many days until Ramadan?",
        description:
          "Live countdown to the first day of Ramadan — days, hours, minutes and seconds — based on the Umm al-Qura calendar and computed in your browser. Free, private, no ads.",
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
      faqEyebrow: "Ramadan FAQ",
      faqH2: "About the countdown",
      faq: [
        {
          q: "When does Ramadan start this year?",
          a: "The countdown targets the expected first day of Ramadan from the Umm al-Qura calendar. The actual start can shift by a day depending on the local moon sighting in your country.",
        },
        {
          q: "How is the countdown calculated?",
          a: "It counts down to local midnight at the start of 1 Ramadan, computed from the Umm al-Qura calendar entirely on your device.",
        },
        {
          q: "What are the last ten nights of Ramadan?",
          a: "The final ten nights, which include Laylat al-Qadr (the Night of Decree) — the most valuable nights of the year, when worship is especially encouraged.",
        },
        {
          q: "Does the countdown work offline?",
          a: "Yes. Once the page has loaded it runs entirely in your browser with no connection needed.",
        },
      ],
    },

    converter: {
      meta: {
        title: "Hijri ↔ Gregorian Date Converter — instant & accurate",
        description:
          "Convert any date between the Hijri (Umm al-Qura) and Gregorian calendars instantly, in both directions, with the result in Arabic and Latin script. Free, private, no ads.",
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
      faqEyebrow: "Date Converter FAQ",
      faqH2: "About the converter",
      faq: [
        {
          q: "How do I convert a Gregorian date to Hijri?",
          a: "Pick any Gregorian date on the left. Falah instantly shows the matching Hijri (Umm al-Qura) date, in both Latin and Arabic script.",
        },
        {
          q: "How do I convert a Hijri date to Gregorian?",
          a: "Choose the Hijri day, month and year on the right and the exact Gregorian date appears immediately.",
        },
        {
          q: "Which Hijri calendar does the converter use?",
          a: "The Umm al-Qura calendar used in Saudi Arabia. A converted date can differ by a day from a local moon-sighting announcement.",
        },
        {
          q: "Is it accurate for birthdays and official documents?",
          a: "It is accurate across the supported range of the Umm al-Qura calendar. For official paperwork, confirm against the calendar recognized by your country.",
        },
      ],
    },

    qibla: {
      meta: {
        title: "Qibla Finder — direction to the Kaaba with live compass",
        description:
          "Find the Qibla direction from any city: the exact bearing from true north, distance to the Kaaba in Makkah, and a live compass on supported phones. Private — computed on your device.",
      },
      title: "Qibla Finder",
      side: "اتجاه القبلة",
      intro:
        "The great-circle bearing from your location to the Kaaba in Makkah, computed locally. On phones with a compass, the needle turns live as you rotate.",
      yourLocation: "Your location",
      enableCompass: "Enable live compass",
      compassActive: "Compass active",
      noCompass: "No compass sensor here — use the bearing from true north instead.",
      fromNorth: "from true north",
      toQibla: "to the Qibla",
      needleLive: "Needle is live — it points at the Qibla as you turn.",
      faceNorth: "Face true north, then turn by the angle shown.",
      distance: (km: string) => `Distance to the Kaaba: ${km} km.`,
      prompt: "Search for your city or use your location to find the Qibla.",
      guideEyebrow: "Step by step",
      guideH2: "How to find the Qibla",
      guide: [
        {
          icon: "ph:map-pin",
          title: "Set your location",
          body: "Search for your city or tap “Use my location”. The Qibla is the great-circle direction from there to the Kaaba in Makkah.",
        },
        {
          icon: "ph:compass-rose",
          title: "Turn on the live compass",
          body: "On a phone, tap “Enable live compass” and allow motion access. The needle then rotates as you turn, pointing straight at the Qibla.",
        },
        {
          icon: "ph:arrows-clockwise",
          title: "Calibrate for accuracy",
          body: "If the needle drifts, wave your phone in a figure-8 a few times and keep away from magnets, speakers, laptops and metal desks.",
        },
        {
          icon: "ph:navigation-arrow",
          title: "No compass? Use the angle",
          body: "On a laptop or a phone without a compass, face true north and turn by the degrees shown to face the Qibla.",
        },
      ],
      faqEyebrow: "Qibla FAQ",
      faqH2: "About the Qibla direction",
      faq: [
        {
          q: "What is the Qibla?",
          a: "The Qibla is the direction Muslims face in prayer — toward the Kaaba in the Sacred Mosque (Masjid al-Haram) in Makkah.",
        },
        {
          q: "How accurate is the Qibla compass?",
          a: "The bearing is calculated precisely from your coordinates to the Kaaba. Live-compass accuracy depends on your phone's magnetometer, so calibrate it for the best result.",
        },
        {
          q: "Why does the needle point the wrong way?",
          a: "Phone compasses read magnetic north and are easily disturbed by nearby metal, magnets or electronics. Recalibrate with a figure-8 motion, away from interference.",
        },
        {
          q: "Does the Qibla finder work on a laptop?",
          a: "Yes, though most laptops have no compass. It shows the exact bearing from true north so you can align using a physical compass or a map.",
        },
        {
          q: "Is my location private?",
          a: "The Qibla direction is computed on your device. If you use city search, only the city name is sent to look up its coordinates — your precise GPS position is never uploaded.",
        },
      ],
    },

    mosque: {
      meta: {
        title: "Mosque Finder — mosques near me on a live map",
        description:
          "Find mosques and prayer rooms near you on an interactive map using OpenStreetMap community data, with one-tap directions. Free and private — your location is used once and never stored.",
      },
      title: "Mosque Finder",
      side: "أقرب مسجد",
      intro:
        "Nearby mosques on an interactive map, from OpenStreetMap's community data. Allow location access — or search a place — and your position is used only for this one search, never stored.",
      radius: "Search radius",
      find: "Find mosques",
      searchArea: "Search this area",
      searching: "Searching…",
      locationNeeded: "Allow location access, or search for a place, to see nearby mosques.",
      resultCount: (n: number) => (n === 1 ? "1 mosque nearby" : `${n} mosques nearby`),
      errorService: "The map service didn't respond. Try again in a moment.",
      unnamed: "Unnamed mosque",
      away: (km: string) => `${km} km away`,
      directions: "Directions",
      osm: "OpenStreetMap",
      noResults: (r: number) =>
        `No mosques tagged within ${r} km here. Try a wider radius — community map coverage varies by area.`,
      faqEyebrow: "Mosque Finder FAQ",
      faqH2: "Finding mosques near you",
      faq: [
        {
          q: "How does the mosque finder work?",
          a: "With your permission it uses your device location to search OpenStreetMap's community data for places of worship tagged as Muslim within your chosen radius, then plots them on the map.",
        },
        {
          q: "Is my location stored or tracked?",
          a: "No. Your coordinates are used for a single search and never saved. The only request made is the OpenStreetMap query that returns nearby mosques — there are no accounts and no tracking.",
        },
        {
          q: "A mosque near me is missing — why?",
          a: "OpenStreetMap is community-edited, so coverage varies by area. Try a wider radius, and consider adding the mosque on openstreetmap.org so others can find it too.",
        },
        {
          q: "How do I get directions to a mosque?",
          a: "Tap “Directions” on any result to open turn-by-turn navigation to that mosque in your maps app.",
        },
        {
          q: "Do I need an app or account?",
          a: "No. The finder runs entirely in your browser — no sign-up, no install, no ads.",
        },
      ],
    },

    quran: {
      meta: {
        title: "Read the Quran online — Uthmani script, audio & translation",
        description:
          "Read all 114 surahs of the Holy Quran in authentic Uthmani script, listen to renowned reciters, and reveal the translation on hover or tap. Free, private, no ads, no account.",
      },
      title: "Al-Qur'an Explorer",
      side: "القرآن الكريم",
      intro:
        "Read the Quran in the Uthmani script, listen to a reciter of your choice, and reveal each verse's translation on hover or tap. Text and audio from the open AlQuran.cloud API.",
      surah: "Surah",
      reciter: "Reciter",
      translation: "Translation",
      translationMode: "Show translation",
      modeHover: "On hover",
      modeClick: "On tap",
      modeOff: "Off",
      textSize: "Text size",
      playSurah: "Play",
      pause: "Pause",
      playVerse: "Play this verse",
      prev: "Previous surah",
      next: "Next surah",
      settings: "Reading settings",
      hoverHint: "Hover any verse to reveal its translation.",
      clickHint: "Tap any verse to reveal its translation.",
      offHint: "Translation is hidden — choose “On hover” or “On tap” to show it.",
      verseRef: (s: number, a: number) => `Verse ${s}:${a}`,
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
        title: "99 Names of Allah — Asma ul Husna with meanings & explanations",
        description:
          "All 99 Names of Allah (Asma ul Husna) with Arabic, transliteration, meaning and a clear explanation of each name. Searchable, embedded in the page, fully offline. Free, no ads.",
      },
      title: "99 Names of Allah",
      side: "أسماء الله الحسنى",
      intro:
        "Al-Asma ul-Husna — the 99 most beautiful names — each with its transliteration, meaning and a concise explanation. All embedded in the page, so it works fully offline.",
      hadith:
        "The Prophet ﷺ said: “Allah has ninety-nine names; whoever memorizes them will enter Paradise.” (Al-Bukhari & Muslim)",
      searchPh: "Search by name or meaning…",
      searchAria: "Search the 99 names",
      noMatch: (q: string) => `No name matches “${q}”. Try a shorter search.`,
      nameLabel: (n: number) => `Name ${n} of 99`,
      copy: "Copy",
      copied: "Copied",
      prev: "Previous name",
      next: "Next name",
      close: "Close",
      faqEyebrow: "Asma ul Husna FAQ",
      faqH2: "About the 99 names",
      faq: [
        {
          q: "What are the 99 names of Allah?",
          a: "The Asma ul Husna are the beautiful names of Allah found in the Quran and Sunnah, each describing an attribute of God such as mercy, power, wisdom or forgiveness.",
        },
        {
          q: "What is the reward for memorizing them?",
          a: "The Prophet ﷺ said that whoever memorizes (ihsa) the ninety-nine names will enter Paradise — understood as learning them, believing in them, and acting by their meanings.",
        },
        {
          q: "Are there exactly 99 names?",
          a: "The hadith mentions ninety-nine, but scholars note this does not limit Allah's names; it highlights this set. The specific list here follows the well-known narration.",
        },
        {
          q: "How can I benefit from the names in daily life?",
          a: "Reflect on each meaning, call upon Allah by the name that fits your need (as in “Ya Rahman”), and let the attributes shape your character and worship.",
        },
        {
          q: "Does this work offline?",
          a: "Yes. All 99 names, meanings and explanations are embedded in the page, so it works with no account and no connection.",
        },
      ],
    },

    hisnul: {
      meta: {
        title: "Hisnul Muslim — authentic daily duas & adhkar with audio",
        description:
          "The complete Fortress of the Muslim (Hisnul Muslim): every authentic daily dua and dhikr with Arabic text, translation, repetition counts and audio recitation. Free, no account, no ads.",
      },
      title: "Hisnul Muslim",
      side: "حصن المسلم",
      intro:
        "The complete Fortress of the Muslim — every chapter of authentic daily supplications, with translation, repetition counts, and audio recitation for each dua.",
      chapters: "Chapters",
      searchPh: "Search a chapter…",
      loading: "Loading…",
      error: "Couldn't load the adhkar. Check your connection and try again.",
      playChapter: "Play chapter",
      pause: "Pause",
      selectPrompt: "Choose a chapter to read its adhkar.",
      count: (n: number) => (n === 1 ? "1 dhikr" : `${n} adhkar`),
      repeat: (n: number) => `Repeat ×${n}`,
      copy: "Copy",
      copied: "Copied",
      faqEyebrow: "Hisnul Muslim FAQ",
      faqH2: "About these adhkar",
      faq: [
        {
          q: "What is Hisnul Muslim?",
          a: "Hisnul Muslim (“Fortress of the Muslim”) is a widely used collection of authentic daily supplications (adhkar) compiled by Sheikh Sa'id bin Ali al-Qahtani from the Quran and Sunnah.",
        },
        {
          q: "Can I listen to the duas?",
          a: "Yes. Each chapter has a full audio recitation, and every individual dua has its own audio — just tap the play button.",
        },
        {
          q: "What does the repetition count mean?",
          a: "Some adhkar are recited a set number of times (for example three or a hundred). The “Repeat ×N” badge shows how many times a dua is said, following the Sunnah.",
        },
        {
          q: "When should I read the morning and evening adhkar?",
          a: "The morning adhkar are read after Fajr until sunrise, and the evening adhkar after Asr until sunset (or after Maghrib). Consistency matters more than exact timing.",
        },
        {
          q: "Does it work without an account?",
          a: "Yes — no sign-up, no ads, no tracking. The text and audio load from the open HisnMuslim.com API.",
        },
      ],
    },

    zakat: {
      meta: {
        title: "Zakat Calculator — calculate 2.5% on cash, gold & savings",
        description:
          "Free Zakat calculator: work out the 2.5% due on your cash, gold, silver, investments and business assets against the gold or silver nisab, with a full guide. Private, in your browser, no ads.",
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
      reset: "Reset",
      nisabProgress: "Progress to nisab",
      assetsHeading: "Your assets",
      deductionsHeading: "Deductions & nisab",
      disclaimer:
        "Zakat is due after one lunar year (hawl) above the nisab. This calculator covers the common cases; for complex holdings, ask a qualified scholar.",
      content: {
        eyebrow: "Understanding Zakat",
        heading: "How to calculate your Zakat",
        intro:
          "Zakat is the third pillar of Islam — an annual act of worship that purifies your wealth and restores the right of the poor within it. This guide explains who pays, on what, and how much.",
        sections: [
          {
            h: "What is Zakat?",
            p: [
              "Zakat is an obligatory annual charity of 2.5% on qualifying wealth. The Arabic word carries two meanings — “purification” and “growth” — because giving it purifies the remainder of your wealth and causes it to be blessed.",
              "It is not a tax or an optional donation, but a due that the poor rightfully hold over the wealth Allah has entrusted to you.",
            ],
          },
          {
            h: "Who must pay Zakat?",
            p: [
              "Zakat is obligatory on every Muslim who is adult, of sound mind, and who owns wealth above the nisab threshold that has been held for one full lunar year (the hawl).",
            ],
          },
          {
            h: "The nisab — the minimum threshold",
            p: [
              "The nisab is the minimum wealth that makes Zakat obligatory. It equals the value of 85 grams of gold or 595 grams of silver.",
              "Many scholars recommend the silver nisab because it is lower: it means Zakat becomes due on smaller amounts, so more reaches those in need. If your zakatable wealth stays above the nisab for a full lunar year, Zakat is due.",
            ],
          },
          {
            h: "What wealth is zakatable?",
            list: [
              "Cash in hand, bank accounts and savings",
              "Gold and silver — whether jewellery, coins or bullion",
              "Money in shares, funds or crypto held for growth",
              "Business inventory, trade goods, and money owed to you",
              "Agricultural produce and livestock (which have their own separate rules)",
            ],
            p: [
              "Your home, personal car, clothing, furniture and the tools of your trade are not zakatable, because they are for personal use rather than for growth.",
            ],
          },
          {
            h: "How the calculation works",
            p: [
              "Add up all your zakatable assets, subtract short-term debts that are due now, and compare the total with the nisab. If it meets or exceeds the nisab, your Zakat is 2.5% — one-fortieth — of the total.",
            ],
          },
          {
            h: "Who can receive your Zakat?",
            p: ["The Quran names eight categories of recipients (Surah At-Tawbah 9:60):"],
            list: [
              "The poor (al-fuqarā’)",
              "The needy (al-masākīn)",
              "Those employed to administer it",
              "Those whose hearts are to be reconciled",
              "Freeing those in bondage",
              "Those burdened with debt",
              "In the cause of Allah (fī sabīlillāh)",
              "The stranded traveller",
            ],
          },
        ],
      },
      faqEyebrow: "Zakat FAQ",
      faqH2: "Common Zakat questions",
      faq: [
        {
          q: "How much Zakat do I pay?",
          a: "Zakat is 2.5% (one-fortieth) of your total zakatable wealth, once it has remained above the nisab for a full lunar year.",
        },
        {
          q: "Do I pay Zakat on my salary?",
          a: "Not on income as you earn it, but on the savings you still hold when your Zakat year completes. Whatever you spend or give during the year is not counted — only what remains above the nisab.",
        },
        {
          q: "Is there Zakat on gold jewellery I wear?",
          a: "Scholars differ. Many hold that gold and silver are always zakatable, even when worn; others exempt jewellery in regular use. Follow the position of a scholar you trust.",
        },
        {
          q: "Should I use the gold or the silver nisab?",
          a: "Either is valid, but the silver nisab is lower, so using it means Zakat is due on smaller wealth — which benefits the poor. This calculator lets you choose.",
        },
        {
          q: "Do I subtract my debts?",
          a: "Yes — immediate, short-term debts due now are subtracted before comparing with the nisab. Long-term debts such as a mortgage are usually not deducted in full; ask a scholar about your case.",
        },
      ],
    },

    inheritance: {
      meta: {
        title: "Islamic Inheritance Calculator (Fara'id) — Quranic shares",
        description:
          "Free Islamic inheritance calculator: distribute an estate by the fixed Quranic shares (Fara'id) with 'awl and radd, plus a clear guide to how Fara'id works. Exact fractions, private, in your browser.",
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
      content: {
        eyebrow: "Understanding Islamic Inheritance",
        heading: "How Islamic inheritance (Fara'id) works",
        intro:
          "Fara'id is one of the most precise systems in Islamic law: the Quran itself fixes who inherits and how much. This guide explains the order of distribution, the fixed shares, and the adjustments this calculator applies.",
        sections: [
          {
            h: "What is Fara'id?",
            p: [
              "Fara'id is the Islamic law of inheritance, detailed largely in the Quran (Surah An-Nisa 4:11–12 and 4:176). It assigns fixed shares of the estate to specific relatives.",
              "Unlike a free-will system, most of the estate is distributed according to shares that Allah has ordained, leaving only a limited portion to personal choice.",
            ],
          },
          {
            h: "What is settled before distribution",
            p: ["Four things are taken from the estate before the heirs receive anything, in this order:"],
            list: [
              "Funeral and burial expenses",
              "Outstanding debts owed by the deceased",
              "A valid bequest (wasiyyah) of up to one third, given to non-heirs",
              "The remainder is then divided among the legal heirs",
            ],
          },
          {
            h: "The fixed-share heirs (Ashab al-Furud)",
            p: [
              "Certain heirs receive a fraction named in the Quran — 1/2, 1/4, 1/8, 2/3, 1/3 or 1/6 — depending on who else survives. A husband, for example, takes 1/2 when there are no children and 1/4 when there are; a wife takes 1/4 or 1/8 in the same cases.",
            ],
          },
          {
            h: "The residuaries ('Asabah)",
            p: [
              "Once the fixed shares are paid, whatever remains passes to the residuary heirs — usually sons, the father, or brothers — in a strict order of priority. When sons and daughters inherit together, a son receives twice the share of a daughter.",
            ],
          },
          {
            h: "Blocking (Hijb)",
            p: [
              "Some heirs exclude others. A son blocks the deceased's brothers and sisters; a father blocks the grandfather. Because these rules interact in complex ways, a precise tool — or a scholar — is used rather than guesswork.",
            ],
          },
          {
            h: "'Awl and Radd",
            p: [
              "Sometimes the fixed shares add up to more than the whole estate, so every share is scaled down proportionally ('awl). Other times they add up to less with no residuary heir, so the surplus is returned to the fixed-share heirs in proportion (radd). This calculator applies both automatically.",
            ],
          },
          {
            h: "Why some shares differ",
            p: [
              "Where a male heir receives double a female in the same class, it mirrors his greater financial duties: a man must pay the dowry and fully maintain his wife and family, while a woman keeps her wealth entirely for herself. The system balances rights with responsibilities.",
            ],
          },
        ],
      },
      faqEyebrow: "Inheritance FAQ",
      faqH2: "Common Fara'id questions",
      faq: [
        {
          q: "Does a son really inherit twice a daughter's share?",
          a: "In the same class of heirs, yes — but it is tied to responsibility: the man must pay the dowry and financially maintain the family, while the woman keeps her share entirely for herself.",
        },
        {
          q: "Can I leave my wealth to anyone in a will?",
          a: "You may bequeath up to one third of your estate to people who are not already fixed heirs. The remaining two thirds must follow the Quranic shares, and a will cannot deny a rightful heir.",
        },
        {
          q: "Do daughters inherit when there are no sons?",
          a: "Yes. A single daughter takes 1/2 and two or more share 2/3, alongside other eligible heirs such as the parents and spouse.",
        },
        {
          q: "What if the shares don't add up to a whole?",
          a: "If they exceed the estate, all shares are reduced proportionally ('awl). If they fall short with no residuary heir, the surplus is returned to the sharers (radd). Both are handled here automatically.",
        },
        {
          q: "Is this a substitute for a scholar?",
          a: "No. It covers the common cases accurately, but real estates can involve rarer heirs and disputes. Always confirm with a qualified scholar or Islamic court before dividing an actual estate.",
        },
      ],
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
