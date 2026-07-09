export const prayer = {
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
};
