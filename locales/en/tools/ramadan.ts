export const ramadan = {
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
};
