export const khatam = {
  meta: {
    title: "Khatam Quran Planner — finish the Quran by a date you choose",
    description:
      "Plan a Khatam by pages, juz or hizb. See today's portion, open it in the reader, and track your progress day by day — the plan adjusts itself when you fall behind.",
  },
  title: "Khatam Planner",
  side: "مخطط الختمة",
  intro:
    "Choose how long you want to take, and the planner splits the mushaf into a daily portion you can open and read straight away. Your progress is kept on this device — the plan re-spreads what's left whenever you miss a day or read ahead.",

  // Setup
  setupTitle: "Plan your khatam",
  readBy: "Count my reading in",
  units: { page: "Pages", juz: "Juz", hizb: "Hizb" },
  unitOf: { page: "pages", juz: "juz", hizb: "hizb" },
  unitOne: { page: "Page", juz: "Juz", hizb: "Hizb" },
  unitTotals: { page: "604 pages", juz: "30 juz", hizb: "60 hizb" },
  goalType: "Set the length",
  byDays: "By number of days",
  byDate: "By target date",
  presets: "Common plans",
  presetLabels: {
    7: "A week",
    30: "A month",
    90: "3 months",
    365: "A year",
  } as Record<number, string>,
  totalDays: "Days to finish",
  startDate: "Start on",
  endDate: "Finish by",
  perDay: "a day",
  aboutPages: (n: number) => `about ${n} ${n === 1 ? "page" : "pages"} a day`,
  perPrayer: (n: number) => `≈ ${n} ${n === 1 ? "page" : "pages"} after each prayer`,
  finishesOn: "Finishes on",
  startKhatam: "Start this khatam",
  invalidDate: "The finish date has to come after the start date.",
  tooFast: "A khatam needs at least one day.",
  tooSlow: "Try a shorter plan — 365 days is the longest you can set.",

  // Tracking
  progressTitle: "Your khatam",
  ofTotal: (done: number, total: number, unit: string) => `${done} of ${total} ${unit}`,
  dayOf: (day: number, days: number) => `Day ${day} of ${days}`,
  daysLeft: (n: number) => (n === 1 ? "1 day left" : `${n} days left`),
  overdue: "Past the target date",
  onTrack: "On track",
  ahead: (n: number, unit: string) => `${n} ${unit} ahead`,
  behind: (n: number, unit: string) => `${n} ${unit} behind`,
  todayPortion: "Today's portion",
  range: (unit: string, from: number, to: number) =>
    from === to ? `${unit} ${from}` : `${unit} ${from}–${to}`,
  todayDone: "Today's portion is done",
  readToday: (n: number, unit: string) => `${n} ${unit} today`,
  readNow: "Read now",
  readAhead: "Read ahead",
  markRead: (n: number, unit: string) => `Mark ${n} ${unit} read`,
  undo: "Undo",
  finishedTitle: "Khatam complete",
  finishedBody: "You have read the Quran cover to cover. May it be accepted from you.",
  newKhatam: "Start a new khatam",

  // Reader bookmark
  resumeTitle: "You were reading",
  syncFromReader: (unit: string, n: number) => `Count up to ${unit} ${n} as read`,

  // Stats
  thisWeek: "This week",
  streak: (n: number) => (n === 1 ? "1 day streak" : `${n} day streak`),
  atThisPace: "At this pace",
  nothingYet: "No reading logged yet",
  changePlan: "Change plan",
  resetPlan: "Delete plan",
  resetConfirm: "Delete this plan and all its progress?",
  keepPlan: "Keep it",
  savedLocally: "Saved on this device only.",
};
