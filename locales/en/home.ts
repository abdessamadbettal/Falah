export const home = {
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
};
