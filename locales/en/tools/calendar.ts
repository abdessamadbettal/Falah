export const calendar = {
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
};
