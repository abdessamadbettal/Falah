/** The prayer-time calculation shared by the interactive tool and the ~7,900
 * prerendered place pages.
 *
 * One module on purpose: the times baked into a city's HTML and the times the
 * live countdown ticks through have to agree to the minute, or the page
 * contradicts itself in front of both the reader and the crawler.
 *
 * Safe to import from a client component — nothing here touches the filesystem. */

import {
  CalculationMethod,
  type CalculationParameters,
  Coordinates,
  HighLatitudeRule,
  PolarCircleResolution,
  PrayerTimes,
  Qibla,
} from "adhan";

/** `satisfies`, not an annotation: the keys have to stay a literal union so
 * they line up with `Dict["tools"]["prayer"]["methods"]`. Adding a method
 * here without naming it in all three dictionaries is then a type error
 * rather than an `undefined` in a <select>. */
export const METHOD_FNS = {
  MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
  UmmAlQura: CalculationMethod.UmmAlQura,
  Egyptian: CalculationMethod.Egyptian,
  Karachi: CalculationMethod.Karachi,
  NorthAmerica: CalculationMethod.NorthAmerica,
  MoonsightingCommittee: CalculationMethod.MoonsightingCommittee,
  Dubai: CalculationMethod.Dubai,
  Kuwait: CalculationMethod.Kuwait,
  Qatar: CalculationMethod.Qatar,
  Singapore: CalculationMethod.Singapore,
  Turkey: CalculationMethod.Turkey,
} satisfies Record<string, () => CalculationParameters>;

export type MethodKey = keyof typeof METHOD_FNS;

export const METHOD_KEYS = Object.keys(METHOD_FNS) as MethodKey[];

/** The calculation method most commonly followed in each country. */
const METHOD_BY_COUNTRY: Record<string, MethodKey> = {
  SA: "UmmAlQura", AE: "Dubai", QA: "Qatar", KW: "Kuwait", EG: "Egyptian",
  TR: "Turkey", PK: "Karachi", IN: "Karachi", BD: "Karachi", AF: "Karachi",
  US: "NorthAmerica", CA: "NorthAmerica", MY: "Singapore", SG: "Singapore",
  BN: "Singapore",
};

export const DEFAULT_METHOD: MethodKey = "MuslimWorldLeague";

export function methodForCountry(code?: string): MethodKey {
  return METHOD_BY_COUNTRY[(code ?? "").toUpperCase()] ?? DEFAULT_METHOD;
}

export const PRAYER_ORDER = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerKey = (typeof PRAYER_ORDER)[number];

/** The five daily prayers, without sunrise — which is a boundary, not a salah. */
export const SALAH_ORDER = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

export const PRAYER_AR: Record<PrayerKey, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

/** The Kaaba, to six decimals — the fixed point every qibla bearing is measured to. */
export const MAKKAH = { lat: 21.422487, lng: 39.826206 };

/** Parameters for a method at a place.
 *
 * The two rules matter far more here than in the interactive tool. Above
 * ~48° the sun never dips far enough below the horizon in midsummer for a
 * true Fajr or Isha angle, and inside the polar circles it may not set at
 * all; left unresolved, adhan returns Invalid Date. On a page the visitor
 * drives that is a bad afternoon — baked into static HTML for Tromsø,
 * Murmansk and Anchorage it is a permanently broken page in the index. */
export function prayerParams(method: MethodKey, coords: Coordinates): CalculationParameters {
  const params = METHOD_FNS[method]();
  params.highLatitudeRule = HighLatitudeRule.recommended(coords);
  params.polarCircleResolution = PolarCircleResolution.AqrabBalad;
  return params;
}

export type Place = { lat: number; lng: number };

/** Prayer times for one calendar day at one place.
 *
 * `date` is read for its year/month/day only, so it must be a *local* Date —
 * `new Date(y, m, d)` round-trips those three fields whatever the machine's
 * timezone is, which is what keeps a build reproducible on a laptop in
 * Casablanca and a CI runner in UTC. The Dates that come back are absolute
 * instants; `formatTime` is what places them in a zone. */
export function dayTimes(place: Place, date: Date, method: MethodKey): PrayerTimes {
  const coords = new Coordinates(place.lat, place.lng);
  return new PrayerTimes(coords, date, prayerParams(method, coords));
}

/** The qibla bearing from a place, in degrees clockwise from true north. */
export function qiblaDegrees(place: Place): number {
  return Qibla(new Coordinates(place.lat, place.lng));
}

// ------------------------------------------------------------- formatting

const FORMATTERS = new Map<string, Intl.DateTimeFormat>();

/** "05:10" in the city's own zone, in Latin digits, on a 24-hour clock.
 *
 * Deliberately not locale-formatted. A prayer timetable is a column of
 * numbers to be scanned, the 24-hour form is unambiguous in every country
 * this ships to, and Arabic-Indic digits here would break the alignment that
 * makes the column readable. */
export function formatTime(at: Date, tz: string): string {
  if (Number.isNaN(at.getTime())) return "—";
  let fmt = FORMATTERS.get(tz);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    FORMATTERS.set(tz, fmt);
  }
  return fmt.format(at);
}

const DATE_PARTS = new Map<string, Intl.DateTimeFormat>();

/** Today's date *in the given zone*, as "YYYY-MM-DD".
 *
 * A visitor in Los Angeles opening the Jakarta page at 10pm is looking at
 * tomorrow in Jakarta; taking the day from their own clock would show them
 * the wrong day's times. en-CA is ISO order by definition, which is why it
 * is the locale used here and nowhere else. */
export function isoDateIn(tz: string, at: Date = new Date()): string {
  let fmt = DATE_PARTS.get(tz);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    DATE_PARTS.set(tz, fmt);
  }
  return fmt.format(at);
}

/** The same date as a local Date, ready for `dayTimes`. */
export function dateIn(tz: string, at: Date = new Date()): Date {
  const [year, month, day] = isoDateIn(tz, at).split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** "2026-08-03" for a local Date, without a timezone round-trip. */
export function isoOf(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Every day of the month `day` falls in, as local Dates. */
export function daysOfMonth(day: Date): Date[] {
  const year = day.getFullYear();
  const month = day.getMonth();
  const length = new Date(year, month + 1, 0).getDate();
  return Array.from({ length }, (_, i) => new Date(year, month, i + 1));
}

/** The times of one day, keyed for rendering. */
export function timetableRow(place: Place, date: Date, method: MethodKey, tz: string) {
  const times = dayTimes(place, date, method);
  return {
    date,
    times: Object.fromEntries(
      PRAYER_ORDER.map((key) => [key, formatTime(times[key], tz)]),
    ) as Record<PrayerKey, string>,
  };
}
