/** Everything a city page shows about time, computed identically on the
 * server and in the browser.
 *
 * The static export is the reason this shape exists. A city's HTML is written
 * once, at build time, and may be read months later — so the page ships the
 * build day's timetable as real, crawlable content, and the browser rebuilds
 * the same structure for the reader's actual today the moment it hydrates.
 * One function produces both, so the two can never disagree about anything
 * but the date they were asked for. */

import type { Locale } from "./i18n";
import {
  dateIn,
  dayTimes,
  daysOfMonth,
  formatTime,
  isoOf,
  type MethodKey,
  type Place,
  PRAYER_ORDER,
  type PrayerKey,
  SALAH_ORDER,
} from "./prayer-calc";

export type DayTimes = Record<PrayerKey, string>;

export type BoardDay = {
  /** "2026-08-03" — the machine-readable half of <time dateTime>. */
  iso: string;
  /** "Mon 3" in the reader's language. */
  label: string;
  times: DayTimes;
};

export type Board = {
  iso: string;
  /** "Monday, 3 August 2026". */
  dayLabel: string;
  /** "August 2026". */
  monthLabel: string;
  today: DayTimes;
  month: BoardDay[];
};

/** Formatters are the expensive part of this — building three per page across
 * 23,000 pages is real time — so they are made once per board and passed down. */
function formatters(locale: Locale) {
  return {
    day: new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    month: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    // Deliberately no timeZone: these Dates are already the city's calendar
    // day expressed locally, and re-projecting them into a zone would shift
    // half of them by a day.
    row: new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric" }),
  };
}

function timesOf(place: Place, date: Date, method: MethodKey, tz: string): DayTimes {
  const times = dayTimes(place, date, method);
  return Object.fromEntries(
    PRAYER_ORDER.map((key) => [key, formatTime(times[key], tz)]),
  ) as DayTimes;
}

export type BoardPlace = Place & { tz: string };

/** The city's calendar day right now, as a local Date. */
export function todayIn(place: BoardPlace, at: Date = new Date()): Date {
  return dateIn(place.tz, at);
}

/** Rebuild a day from the `iso` a board carries, without a timezone
 * round-trip — the string already *is* the city's calendar day. */
export function dayFromIso(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** One day's times and the whole month around it.
 *
 * `day` is a calendar day, not an instant: whose "today" it is has already
 * been decided by the caller — `todayIn(city)` on the server at build time,
 * and the reader's own clock in the browser. */
export function buildBoard(
  locale: Locale,
  place: BoardPlace,
  method: MethodKey,
  day: Date,
): Board {
  const fmt = formatters(locale);
  return {
    iso: isoOf(day),
    dayLabel: fmt.day.format(day),
    monthLabel: fmt.month.format(day),
    today: timesOf(place, day, method, place.tz),
    month: daysOfMonth(day).map((date) => ({
      iso: isoOf(date),
      label: fmt.row.format(date),
      times: timesOf(place, date, method, place.tz),
    })),
  };
}

// ------------------------------------------------------------ the country

export type CountryCity = { slug: string; name: string; lat: number; lng: number; tz: string };
export type CountryRow = { slug: string; times: DayTimes };

/** The five daily prayers in several cities at once, each in its own zone.
 *
 * Only the five: sunrise is a boundary, and a column of it in a comparison
 * table is a column of noise. Each city resolves its own calendar day, which
 * matters in the countries that span a date line's worth of longitude. */
export function countryRows(
  cities: CountryCity[],
  method: MethodKey,
  at: Date = new Date(),
): CountryRow[] {
  return cities.map((city) => {
    const times = dayTimes(city, dateIn(city.tz, at), method);
    return {
      slug: city.slug,
      times: Object.fromEntries(
        SALAH_ORDER.map((key) => [key, formatTime(times[key], city.tz)]),
      ) as DayTimes,
    };
  });
}

// ------------------------------------------------------------- the clock

export type PrayerMoment = { key: PrayerKey; at: Date };

/** Yesterday's Isha through tomorrow's Fajr, in order.
 *
 * The window has to reach past both ends of the day, or the countdown breaks
 * every night between Isha and dawn — the hours when someone is most likely
 * to be checking when Fajr is. Computed once per calendar day; finding the
 * next prayer within it is then a scan of seven timestamps. */
export function praySequence(place: BoardPlace, method: MethodKey, day: Date): PrayerMoment[] {
  const shift = (days: number) =>
    new Date(day.getFullYear(), day.getMonth(), day.getDate() + days);

  const yesterday = dayTimes(place, shift(-1), method);
  const today = dayTimes(place, day, method);
  const tomorrow = dayTimes(place, shift(1), method);

  return (
    [
      { key: "isha", at: yesterday.isha },
      { key: "fajr", at: today.fajr },
      { key: "dhuhr", at: today.dhuhr },
      { key: "asr", at: today.asr },
      { key: "maghrib", at: today.maghrib },
      { key: "isha", at: today.isha },
      { key: "fajr", at: tomorrow.fajr },
    ] as PrayerMoment[]
  ).filter((moment) => !Number.isNaN(moment.at.getTime()));
}

export type NextPrayer = PrayerMoment & {
  /** 0–1 through the window since the previous prayer — drives the ring. */
  progress: number;
};

/** Which prayer is next at `stamp`, and how far through the gap we are. */
export function nextPrayer(sequence: PrayerMoment[], stamp: number): NextPrayer | null {
  if (sequence.length < 2) return null;

  let previous = sequence[0];
  let next = sequence[1];
  for (let i = 0; i < sequence.length - 1; i++) {
    if (stamp >= sequence[i].at.getTime() && stamp < sequence[i + 1].at.getTime()) {
      previous = sequence[i];
      next = sequence[i + 1];
      break;
    }
  }

  const span = next.at.getTime() - previous.at.getTime();
  const progress = span > 0 ? (stamp - previous.at.getTime()) / span : 0;
  return { ...next, progress: Math.min(1, Math.max(0, progress)) };
}
