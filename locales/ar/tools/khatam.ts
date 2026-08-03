export const khatam = {
  meta: {
    title: "مخطط ختمة القرآن — اختم القرآن في التاريخ الذي تختاره",
    description:
      "خطط لختمتك بالصفحات أو الأجزاء أو الأحزاب. اطّلع على ورد اليوم وافتحه في المصحف مباشرة، وتابع تقدمك يومًا بيوم — والخطة تعيد توزيع ما تبقى إن تأخرت.",
  },
  title: "مخطط الختمة",
  side: "Khatam Planner",
  intro:
    "اختر المدة التي تريد أن تختم فيها، ويقسّم لك المخطط المصحف إلى ورد يومي تفتحه وتقرأه في الحال. يُحفظ تقدمك على هذا الجهاز، وتعيد الخطة توزيع ما تبقى كلما فاتك يوم أو تقدمت على موعدك.",

  // Setup
  setupTitle: "خطط لختمتك",
  readBy: "احسب قراءتي بـ",
  units: { page: "الصفحات", juz: "الأجزاء", hizb: "الأحزاب" },
  unitOf: { page: "صفحة", juz: "جزء", hizb: "حزب" },
  unitOne: { page: "صفحة", juz: "جزء", hizb: "حزب" },
  unitTotals: { page: "٦٠٤ صفحات", juz: "٣٠ جزءًا", hizb: "٦٠ حزبًا" },
  goalType: "حدد المدة",
  byDays: "بعدد الأيام",
  byDate: "بتاريخ الختم",
  presets: "خطط شائعة",
  presetLabels: {
    7: "أسبوع",
    30: "شهر",
    90: "٣ أشهر",
    365: "سنة",
  } as Record<number, string>,
  totalDays: "عدد أيام الختمة",
  startDate: "تاريخ البدء",
  endDate: "تاريخ الختم",
  perDay: "في اليوم",
  aboutPages: (n: number) =>
    `نحو ${n} ${n === 1 ? "صفحة" : n === 2 ? "صفحتين" : n <= 10 ? "صفحات" : "صفحة"} يوميًا`,
  perPrayer: (n: number) =>
    `≈ ${n} ${n === 1 ? "صفحة" : n === 2 ? "صفحتان" : n <= 10 ? "صفحات" : "صفحة"} بعد كل صلاة`,
  finishesOn: "الختم يوم",
  startKhatam: "ابدأ هذه الختمة",
  invalidDate: "يجب أن يكون تاريخ الختم بعد تاريخ البدء.",
  tooFast: "لا بد للختمة من يوم واحد على الأقل.",
  tooSlow: "اختر مدة أقصر — أطول خطة ممكنة ٣٦٥ يومًا.",

  // Tracking
  progressTitle: "ختمتك",
  ofTotal: (done: number, total: number, unit: string) => `${done} من ${total} ${unit}`,
  dayOf: (day: number, days: number) => `اليوم ${day} من ${days}`,
  daysLeft: (n: number) =>
    n === 1 ? "بقي يوم واحد" : n === 2 ? "بقي يومان" : n <= 10 ? `بقيت ${n} أيام` : `بقي ${n} يومًا`,
  overdue: "تجاوزت تاريخ الختم",
  onTrack: "أنت في الموعد",
  ahead: (n: number, unit: string) => `متقدم بـ ${n} ${unit}`,
  behind: (n: number, unit: string) => `متأخر بـ ${n} ${unit}`,
  todayPortion: "ورد اليوم",
  range: (unit: string, from: number, to: number) =>
    from === to ? `${unit} ${from}` : `${unit} ${from}–${to}`,
  todayDone: "أتممت ورد اليوم",
  readToday: (n: number, unit: string) => `${n} ${unit} اليوم`,
  readNow: "اقرأ الآن",
  readAhead: "تابع القراءة",
  markRead: (n: number, unit: string) => `تسجيل ${n} ${unit}`,
  undo: "تراجع",
  finishedTitle: "تمت الختمة",
  finishedBody: "قرأت القرآن كاملًا من أوله إلى آخره. تقبل الله منك.",
  newKhatam: "ابدأ ختمة جديدة",

  // Reader bookmark
  resumeTitle: "توقفت عند",
  syncFromReader: (unit: string, n: number) => `اعتبر ما قرأته حتى ${unit} ${n}`,

  // Stats
  thisWeek: "هذا الأسبوع",
  streak: (n: number) =>
    n === 1
      ? "مواظبة يوم واحد"
      : n === 2
        ? "مواظبة يومين"
        : n <= 10
          ? `مواظبة ${n} أيام`
          : `مواظبة ${n} يومًا`,
  atThisPace: "بهذه الوتيرة",
  nothingYet: "لم تسجل قراءة بعد",
  changePlan: "تعديل الخطة",
  resetPlan: "حذف الخطة",
  resetConfirm: "هل تحذف هذه الخطة وكل تقدمها؟",
  keepPlan: "الإبقاء عليها",
  savedLocally: "محفوظ على هذا الجهاز فقط.",
};
