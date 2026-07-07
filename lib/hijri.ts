export type HijriDate = { year: number; month: number; day: number };

export const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Ula",
  "Jumada al-Akhirah",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

export const HIJRI_MONTHS_FR = [
  "Mouharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' ath-Thani",
  "Joumada al-Oula",
  "Joumada ath-Thaniya",
  "Rajab",
  "Cha'ban",
  "Ramadan",
  "Chawwal",
  "Dhou al-Qi'da",
  "Dhou al-Hijja",
];

export const HIJRI_MONTHS_AR = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

// All conversions run through dates pinned to 12:00 UTC so the formatter
// (also pinned to UTC) can never slip a day across timezones.
const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
  timeZone: "UTC",
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

export function utcNoon(year: number, monthIndex: number, day: number): Date {
  return new Date(Date.UTC(year, monthIndex, day, 12));
}

/** Today as a UTC-noon date built from the visitor's local calendar day. */
export function todayUtcNoon(): Date {
  const now = new Date();
  return utcNoon(now.getFullYear(), now.getMonth(), now.getDate());
}

export function hijriFromGregorian(date: Date): HijriDate {
  const parts = fmt.formatToParts(date);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day") };
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

/**
 * Inverse conversion: estimate from the mean Hijri year length, then walk
 * until the Umm al-Qura formatter agrees. Returns null for invalid dates
 * (e.g. day 30 of a 29-day month).
 */
export function hijriToGregorian(h: HijriDate): Date | null {
  if (h.day < 1 || h.day > 30 || h.month < 1 || h.month > 12) return null;
  const epoch = utcNoon(622, 6, 19);
  const estimatedDays = Math.floor(
    (h.year - 1) * 354.36667 + (h.month - 1) * 29.53 + (h.day - 1),
  );
  const estimate = addDays(epoch, estimatedDays);
  for (let offset = -60; offset <= 60; offset++) {
    const candidate = addDays(estimate, offset);
    const p = hijriFromGregorian(candidate);
    if (p.year === h.year && p.month === h.month && p.day === h.day) {
      return candidate;
    }
  }
  return null;
}

/** 29 or 30, per the Umm al-Qura tables. */
export function hijriMonthLength(year: number, month: number): number {
  const day29 = hijriToGregorian({ year, month, day: 29 });
  if (!day29) return 29;
  const next = hijriFromGregorian(addDays(day29, 1));
  return next.day === 30 ? 30 : 29;
}

export function hijriMonthName(month: number, locale: string): string {
  if (locale === "ar") return HIJRI_MONTHS_AR[month - 1];
  if (locale === "fr") return HIJRI_MONTHS_FR[month - 1];
  return HIJRI_MONTHS[month - 1];
}

export function formatHijri(h: HijriDate, locale: string = "en"): string {
  if (locale === "ar") {
    return `${toArabicDigits(h.day)} ${HIJRI_MONTHS_AR[h.month - 1]} ${toArabicDigits(h.year)} هـ`;
  }
  return `${h.day} ${hijriMonthName(h.month, locale)} ${h.year} AH`;
}

export function toArabicDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

/** The next 1 Ramadan, or today's position inside Ramadan if it is underway. */
export function ramadanStatus(): {
  inRamadan: boolean;
  dayOfRamadan: number;
  start: Date | null;
  hijriYear: number;
} {
  const today = todayUtcNoon();
  const h = hijriFromGregorian(today);
  if (h.month === 9) {
    return {
      inRamadan: true,
      dayOfRamadan: h.day,
      start: hijriToGregorian({ year: h.year, month: 9, day: 1 }),
      hijriYear: h.year,
    };
  }
  const targetYear = h.month < 9 ? h.year : h.year + 1;
  return {
    inRamadan: false,
    dayOfRamadan: 0,
    start: hijriToGregorian({ year: targetYear, month: 9, day: 1 }),
    hijriYear: targetYear,
  };
}

export function formatGregorian(date: Date, locale: string = "en"): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
