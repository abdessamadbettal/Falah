export const khatam = {
  meta: {
    title: "Khatam Al-Quran Planner — Set your reading goals",
    description:
      "Plan your Quran reading to finish (Khatam) by a specific date. Calculate exactly how many pages you need to read per day and per prayer to reach your goal.",
  },
  title: "Khatam Planner",
  side: "مخطط الختمة",
  intro:
    "Set your reading goal and find out exactly how much of the Quran you need to read each day to finish on time. You can choose to read by the day or break it down after each daily prayer.",

  // Inputs
  goalType: "How do you want to plan?",
  byDays: "By number of days",
  byDate: "By target date",
  startDate: "Start reading on",
  endDate: "Finish by",
  totalDays: "Total days to finish",
  
  // Results
  summary: (days: number) => `To finish the Quran in ${days} ${days === 1 ? 'day' : 'days'}, you need to read:`,
  pagesPerDay: "Pages per day",
  pagesPerPrayer: "Pages per prayer",
  pagesTotal: "604 total pages",
  approximate: "(approximate)",
  
  // States
  invalidDate: "The end date must be after the start date.",
  tooFast: "You can't finish the Quran in less than 1 day.",
};
