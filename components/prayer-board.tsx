"use client";

import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import { brandCls, goldCls, lineCls, mutedCls, useMounted } from "@/components/ui";
import {
  type Board,
  type BoardPlace,
  buildBoard,
  dayFromIso,
  nextPrayer,
  praySequence,
} from "@/lib/prayer-board";
import {
  isoDateIn,
  type MethodKey,
  PRAYER_AR,
  PRAYER_ORDER,
  type PrayerKey,
} from "@/lib/prayer-calc";

const PRAYER_ICON: Record<PrayerKey, string> = {
  fajr: "ph:cloud-moon",
  sunrise: "ph:sun-horizon",
  dhuhr: "ph:sun",
  asr: "ph:sun-dim",
  maghrib: "ph:sun-horizon",
  isha: "ph:moon-stars",
};

const R = 52;
const CIRC = 2 * Math.PI * R;

/** Today's times and this month's timetable for one city.
 *
 * `initial` is the build day, already rendered into the HTML — it is what a
 * crawler reads and what the reader sees before hydration. On mount the whole
 * board is recomputed for the reader's actual today, so a page deployed in
 * August is still correct in December without a rebuild.
 *
 * The first client render deliberately reuses `initial` rather than computing
 * live values, so the hydrated tree matches the server's exactly; the swap
 * happens in an effect, one frame later. */
export function PrayerBoard({
  city,
  method,
  initial,
}: {
  city: BoardPlace & { name: string };
  method: MethodKey;
  initial: Board;
}) {
  const d = useDict();
  const locale = useLocale();
  const p = d.prayerPlaces;
  const t = d.tools.prayer;

  // `useMounted` is false through hydration, so the first client render is
  // byte-identical to the HTML; it flips on the next tick and the whole
  // board switches from the build day to the reader's.
  const mounted = useMounted();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // The city's calendar date. It moves once a day while `now` moves every
  // second, which is what lets the month below be memoized against it.
  const day = mounted ? isoDateIn(city.tz, new Date(now)) : null;

  // Rebuilding the month costs ~31 sun positions, so it is keyed to the day
  // and not to the ticking second.
  const board = useMemo(
    () => (day === null ? initial : buildBoard(locale, city, method, dayFromIso(day))),
    [day, initial, locale, city, method],
  );

  const sequence = useMemo(
    () => (day === null ? null : praySequence(city, method, dayFromIso(day))),
    [day, city, method],
  );

  const next = sequence ? nextPrayer(sequence, now) : null;

  const remaining = next ? Math.max(0, next.at.getTime() - now) : 0;
  const seconds = Math.floor(remaining / 1000);
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = seconds % 60;

  const isAr = locale === "ar";

  return (
    <>
      {/* next prayer — only meaningful once the reader's clock is known, so
          the slot keeps its height rather than pushing the page down on
          hydration. */}
      <div className="relative mt-6 min-h-47 overflow-hidden rounded-2xl bg-emerald-700 p-6 text-white dark:bg-emerald-400 dark:text-emerald-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -right-8 size-40 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase opacity-80">
              {t.nextPrayer}
            </p>
            <p className="mt-1 font-display text-4xl">
              {next ? t.prayerNames[next.key] : "—"}
            </p>
            {isAr ? null : (
              <p lang="ar" dir="rtl" className="mt-1 font-arabic text-xl opacity-80">
                {next ? PRAYER_AR[next.key] : ""}
              </p>
            )}
            <p className="mt-3 font-mono text-lg" dir="ltr">
              {next ? board.today[next.key] : "—"}
            </p>
          </div>

          <div className="relative grid size-32 shrink-0 place-items-center">
            <svg viewBox="0 0 120 120" className="size-32 -rotate-90" aria-hidden="true">
              <circle cx="60" cy="60" r={R} fill="none" strokeWidth="8" className="stroke-white/20" />
              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className="stroke-white dark:stroke-emerald-950"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - (next?.progress ?? 0))}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-lg tabular-nums" dir="ltr">
                {next ? `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}` : "—"}
              </span>
              <span className="text-[10px] tracking-wider uppercase opacity-80">
                {t.remaining}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* today */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">{p.todayIn(city.name)}</h2>
        <p className={`mt-1 text-sm ${mutedCls}`}>
          <time dateTime={board.iso}>{board.dayLabel}</time>
        </p>

        <ul
          className={`mt-5 divide-y divide-zinc-200 overflow-hidden rounded-2xl border ${lineCls} bg-white dark:divide-zinc-800 dark:bg-zinc-900/60`}
        >
          {PRAYER_ORDER.map((key) => {
            const isNext = next?.key === key;
            return (
              <li
                key={key}
                className={`flex items-center justify-between gap-3 px-5 py-3.5 ${
                  isNext ? "bg-emerald-50 dark:bg-emerald-500/10" : ""
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    icon={PRAYER_ICON[key]}
                    className={`size-5 ${isNext ? brandCls : mutedCls}`}
                    aria-hidden="true"
                  />
                  <span className={`font-semibold ${isNext ? brandCls : ""}`}>
                    {t.prayerNames[key]}
                  </span>
                  {isAr ? null : (
                    <span
                      lang="ar"
                      dir="rtl"
                      className={`font-arabic ${isNext ? goldCls : mutedCls}`}
                    >
                      {PRAYER_AR[key]}
                    </span>
                  )}
                </span>
                <span
                  dir="ltr"
                  className={`font-mono text-sm tabular-nums ${isNext ? brandCls : ""}`}
                >
                  {board.today[key]}
                </span>
              </li>
            );
          })}
        </ul>
        <p className={`mt-4 text-xs ${mutedCls}`}>{p.liveNote(city.tz)}</p>
      </section>

      {/* the month */}
      <section className="mt-12">
        <h2 className="font-display text-2xl">{p.timetable(city.name, board.monthLabel)}</h2>
        <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${mutedCls}`}>
          {p.timetableBody(city.name)}
        </p>

        <div className={`mt-5 overflow-x-auto rounded-2xl border ${lineCls}`}>
          <table className="w-full min-w-136 border-collapse bg-white text-sm dark:bg-zinc-900/60">
            <caption className="sr-only">{p.timetable(city.name, board.monthLabel)}</caption>
            <thead>
              <tr className={`border-b ${lineCls} text-start`}>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {p.dateColumn}
                </th>
                {PRAYER_ORDER.map((key) => (
                  <th key={key} scope="col" className="px-3 py-3 text-start font-semibold">
                    {t.prayerNames[key]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {board.month.map((day) => {
                const isToday = day.iso === board.iso;
                return (
                  <tr
                    key={day.iso}
                    className={`border-b last:border-0 ${lineCls} ${
                      isToday ? "bg-emerald-50 font-medium dark:bg-emerald-500/10" : ""
                    }`}
                  >
                    <th scope="row" className="px-4 py-2.5 text-start font-normal whitespace-nowrap">
                      <time dateTime={day.iso} className={isToday ? brandCls : undefined}>
                        {day.label}
                      </time>
                    </th>
                    {PRAYER_ORDER.map((key) => (
                      <td
                        key={key}
                        dir="ltr"
                        className="px-3 py-2.5 font-mono text-xs tabular-nums rtl:text-end"
                      >
                        {day.times[key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
