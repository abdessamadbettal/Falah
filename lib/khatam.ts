/** The Khatam plan: its storage, its arithmetic, and its one link to the
 * reader.
 *
 * Everything here is pure apart from the storage helpers, so the planner UI
 * stays a rendering layer and the Quran reader only has to call one function.
 * Nothing in this file touches React or the DOM beyond localStorage. */

import { TOTAL_PAGES } from "./quran-meta";
import { type BrowseMode, UNIT_TOTAL } from "./quran-reader";

/** A khatam is counted in even divisions of the mushaf — pages for most
 * people, juz or hizb for those whose wird is set that way. Surahs are
 * deliberately not offered: they run from 3 to 286 verses, so "two surahs a
 * day" schedules nothing. */
export type KhatamUnit = "page" | "juz" | "hizb";
export const KHATAM_UNITS: KhatamUnit[] = ["page", "juz", "hizb"];

const PLAN_KEY = "falah:khatam:plan";
const LAST_READ_KEY = "falah:quran:last-read";

export type KhatamPlan = {
  unit: KhatamUnit;
  /** Length of the plan in days, at least 1. */
  days: number;
  /** Local calendar day the plan starts on, YYYY-MM-DD. */
  start: string;
  /** Units finished, per calendar day. This is the *only* record of progress:
   * the running total, the streak and the week strip are all derived from it,
   * so there is no second number to fall out of sync with. */
  log: Record<string, number>;
};

/** Where the reader last was, written once per unit it opens. All four
 * coordinates are kept so the planner can read the position in whichever unit
 * its plan counts in, no matter which route was actually visited. */
export type LastRead = {
  mode: BrowseMode;
  n: number;
  surah: number;
  juz: number;
  hizb: number;
  page: number;
  /** Epoch ms — a bookmark from last month shouldn't read as "just now". */
  t: number;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/* ── storage ──────────────────────────────────────────────────────────── */

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    // Unavailable (private mode) or corrupt — treat as "nothing saved".
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function loadPlan(): KhatamPlan | null {
  const p = read<Partial<KhatamPlan>>(PLAN_KEY);
  if (!p || !KHATAM_UNITS.includes(p.unit as KhatamUnit)) return null;
  if (typeof p.days !== "number" || p.days < 1 || typeof p.start !== "string") return null;
  return { unit: p.unit as KhatamUnit, days: Math.round(p.days), start: p.start, log: p.log ?? {} };
}

export function savePlan(plan: KhatamPlan) {
  write(PLAN_KEY, plan);
}

export function clearPlan() {
  try {
    localStorage.removeItem(PLAN_KEY);
  } catch {}
}

export function loadLastRead(): LastRead | null {
  const r = read<Partial<LastRead>>(LAST_READ_KEY);
  if (!r || typeof r.page !== "number" || typeof r.juz !== "number" || typeof r.hizb !== "number") {
    return null;
  }
  return r as LastRead;
}

export function saveLastRead(r: LastRead) {
  write(LAST_READ_KEY, r);
}

/** The reader's position expressed in the unit this plan counts in. */
export function positionIn(unit: KhatamUnit, r: LastRead): number {
  return clamp(unit === "page" ? r.page : unit === "juz" ? r.juz : r.hizb, 1, UNIT_TOTAL[unit]);
}

/* ── calendar days ────────────────────────────────────────────────────── */

const pad = (n: number) => String(n).padStart(2, "0");

/** YYYY-MM-DD in the reader's own timezone: a khatam turns over at local
 * midnight, and toISOString() would roll the day over at UTC's instead. */
export function dayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(key: string, n: number): string {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}

/** Whole days from one calendar day to another. Both ends are local midnight,
 * so a daylight-saving shift rounds away rather than losing a day. */
export function daysBetween(from: string, to: string): number {
  return Math.round((fromKey(to).getTime() - fromKey(from).getTime()) / 86_400_000);
}

export function formatDay(key: string, locale: string): string {
  return fromKey(key).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

/** Single-letter weekday for the activity strip. Goes through fromKey rather
 * than new Date(key), which would parse the key as UTC midnight and name the
 * day before it anywhere west of Greenwich. */
export function weekdayOf(key: string, locale: string): string {
  return fromKey(key).toLocaleDateString(locale, { weekday: "narrow" });
}

/* ── progress ─────────────────────────────────────────────────────────── */

export const doneOf = (plan: KhatamPlan) =>
  clamp(
    Object.values(plan.log).reduce((sum, n) => sum + (n || 0), 0),
    0,
    UNIT_TOTAL[plan.unit],
  );

/** Move the running total to `target`, writing the difference into today.
 * Every progress control — "mark as read", the ± stepper, syncing from the
 * reader — goes through this one mutation, which is why undo behaves the
 * same everywhere: it takes the units back off the most recent days first. */
export function setDone(plan: KhatamPlan, target: number, today = dayKey()): KhatamPlan {
  const log = { ...plan.log };
  let diff = clamp(Math.round(target), 0, UNIT_TOTAL[plan.unit]) - doneOf(plan);
  if (diff === 0) return plan;

  if (diff > 0) {
    log[today] = (log[today] ?? 0) + diff;
  } else {
    for (const key of Object.keys(log).sort().reverse()) {
      if (diff === 0) break;
      const take = Math.min(log[key], -diff);
      log[key] -= take;
      diff += take;
      if (log[key] <= 0) delete log[key];
    }
  }
  return { ...plan, log };
}

/** Consecutive days read up to today. A day still in progress doesn't break
 * the run — the count simply starts at yesterday until you read. */
export function streakOf(log: Record<string, number>, today = dayKey()): number {
  let n = 0;
  let cursor = (log[today] ?? 0) > 0 ? today : addDays(today, -1);
  while ((log[cursor] ?? 0) > 0) {
    n++;
    cursor = addDays(cursor, -1);
  }
  return n;
}

/** Roughly how many mushaf pages a portion comes to — a juz reads as "about
 * 20 pages", which is the figure people actually plan their day around. */
export const asPages = (unit: KhatamUnit, n: number) =>
  unit === "page" ? n : Math.round((n * TOTAL_PAGES) / UNIT_TOTAL[unit]);

export type KhatamStats = {
  total: number;
  done: number;
  remaining: number;
  /** 0–100. */
  percent: number;
  /** Which day of the plan today is, 1-based and clamped to its length. */
  day: number;
  /** Days left including today; 0 once the target date has passed. */
  daysLeft: number;
  /** The pace the plan was set at — what the setup screen promised. */
  perDay: number;
  /** Today's whole portion, re-spread over the days that remain. Falling
   * behind raises it and getting ahead lowers it, so the plan absorbs a
   * missed day instead of quietly becoming unachievable. It is fixed at the
   * top of the day: reading half of it shortens what's left, not the goal. */
  todayTarget: number;
  /** How much of today's portion is still outstanding — 0 once it's done. */
  todayLeft: number;
  doneToday: number;
  /** Today's portion, as a closed range of units. */
  from: number;
  to: number;
  /** Where the original schedule says you should be by tonight. */
  expected: number;
  /** How far off schedule you are: positive is ahead, negative is behind, and
   * zero while today's portion is still in progress — a plan that greets you
   * on the morning of day one with "20 pages behind" is just wrong. */
  drift: number;
  streak: number;
  finished: boolean;
  /** The day the plan is due. */
  endDate: string;
  /** The day you'd finish at your average pace so far, once there is one. */
  paceDate: string | null;
};

export function planStats(plan: KhatamPlan, today = dayKey()): KhatamStats {
  const total = UNIT_TOTAL[plan.unit];
  const done = doneOf(plan);
  const remaining = total - done;

  const elapsed = daysBetween(plan.start, today);
  const day = clamp(elapsed + 1, 1, plan.days);
  const daysLeft = clamp(plan.days - elapsed, 0, plan.days);

  // Today's portion is measured from where the day started, so it stays put
  // as you work through it — an amount that shrank with every page read
  // would never let you finish it.
  const doneToday = Math.min(plan.log[today] ?? 0, done);
  const outstanding = total - (done - doneToday);
  const todayTarget =
    outstanding === 0 ? 0 : daysLeft > 0 ? Math.ceil(outstanding / daysLeft) : outstanding;
  const average = done / day;

  // The schedule's two waypoints around today: what last night should have
  // left behind, and what tonight is meant to reach. Anywhere between the two
  // is on track.
  const byYesterday = Math.min(total, Math.round((total * (day - 1)) / plan.days));
  const byTonight = Math.min(total, Math.round((total * day) / plan.days));

  return {
    total,
    done,
    remaining,
    percent: (done / total) * 100,
    day,
    daysLeft,
    perDay: Math.ceil(total / plan.days),
    todayTarget,
    todayLeft: Math.max(0, todayTarget - doneToday),
    doneToday,
    from: Math.min(done + 1, total),
    to: Math.min(done - doneToday + todayTarget, total),
    expected: byTonight,
    drift: done > byTonight ? done - byTonight : done < byYesterday ? done - byYesterday : 0,
    streak: streakOf(plan.log, today),
    finished: remaining === 0,
    endDate: addDays(plan.start, plan.days - 1),
    paceDate: average > 0 ? addDays(today, Math.ceil(remaining / average)) : null,
  };
}

/** The last seven calendar days ending today, oldest first — the week strip. */
export function lastWeek(today = dayKey()): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
}
