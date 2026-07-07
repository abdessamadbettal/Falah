"use client";

import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import {
  ToolShell,
  btnGhost,
  btnPrimary,
  cardCls,
  goldCls,
  lineCls,
  mutedCls,
  useMounted,
} from "@/components/ui";
import {
  HIJRI_MONTHS,
  HIJRI_MONTHS_AR,
  addDays,
  hijriFromGregorian,
  hijriMonthLength,
  hijriToGregorian,
  todayUtcNoon,
} from "@/lib/hijri";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function icsDate(d: Date) {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}

export default function HijriCalendarPage() {
  const mounted = useMounted();
  const today = todayUtcNoon();
  const todayHijri = hijriFromGregorian(today);
  const [year, setYear] = useState(todayHijri.year);
  const [month, setMonth] = useState(todayHijri.month);

  const grid = useMemo(() => {
    const first = hijriToGregorian({ year, month, day: 1 });
    if (!first) return null;
    const length = hijriMonthLength(year, month);
    const days = Array.from({ length }, (_, i) => ({
      hijriDay: i + 1,
      gregorian: addDays(first, i),
    }));
    return { first, length, days, leading: first.getUTCDay() };
  }, [year, month]);

  function shift(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setYear(y);
    setMonth(m);
  }

  function exportWhiteDays() {
    const events: string[] = [];
    for (let m = 1; m <= 12; m++) {
      const start = hijriToGregorian({ year, month: m, day: 13 });
      if (!start) continue;
      events.push(
        [
          "BEGIN:VEVENT",
          `UID:falah-white-days-${year}-${m}@falah.io`,
          `DTSTART;VALUE=DATE:${icsDate(start)}`,
          `DTEND;VALUE=DATE:${icsDate(addDays(start, 3))}`,
          `SUMMARY:White Days (Ayyam al-Bid) — ${HIJRI_MONTHS[m - 1]} ${year} AH`,
          "DESCRIPTION:Recommended fasting on the 13th\\, 14th and 15th of the Hijri month.",
          "END:VEVENT",
        ].join("\r\n"),
      );
    }
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Falah.io//Hijri Calendar//EN",
      ...events,
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `white-days-${year}-ah.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const monthRange = grid
    ? new Intl.DateTimeFormat("en", { timeZone: "UTC", month: "long", year: "numeric" })
        .formatRange(grid.first, grid.days[grid.length - 1].gregorian)
    : "";

  return (
    <ToolShell
      icon="ph:calendar-dots"
      title="Hijri Smart Calendar"
      arabic="التقويم الهجري"
      intro="The Umm al-Qura calendar, month by month. White Days (Ayyam al-Bid) — the 13th, 14th and 15th, when fasting is recommended — are marked in gold, and you can export them to your own calendar."
      wide
    >
      {!mounted ? (
        <p className={`text-sm ${mutedCls}`}>Loading the calendar…</p>
      ) : (
      <div className={`${cardCls} p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">
              {HIJRI_MONTHS[month - 1]} {year} AH
            </h2>
            <p className={`mt-0.5 text-sm ${mutedCls}`}>
              <span lang="ar" dir="rtl" className={`font-arabic ${goldCls}`}>
                {HIJRI_MONTHS_AR[month - 1]}
              </span>
              {" · "}
              {monthRange}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className={btnGhost}>
              <Icon icon="ph:caret-left" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => { setYear(todayHijri.year); setMonth(todayHijri.month); }}
              className={btnGhost}
            >
              Today
            </button>
            <button type="button" onClick={() => shift(1)} aria-label="Next month" className={btnGhost}>
              <Icon icon="ph:caret-right" className="size-4" />
            </button>
          </div>
        </div>

        {grid ? (
          <div className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-2">
            {WEEKDAYS.map((d) => (
              <div key={d} className={`pb-1 text-center text-xs font-semibold uppercase tracking-wide ${mutedCls}`}>
                {d}
              </div>
            ))}
            {Array.from({ length: grid.leading }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {grid.days.map(({ hijriDay, gregorian }) => {
              const isToday =
                todayHijri.year === year && todayHijri.month === month && todayHijri.day === hijriDay;
              const isWhiteDay = hijriDay >= 13 && hijriDay <= 15;
              return (
                <div
                  key={hijriDay}
                  className={`flex min-h-16 flex-col items-center justify-center rounded-xl border p-1 text-center sm:min-h-20 ${
                    isToday
                      ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950"
                      : isWhiteDay
                        ? "border-amber-400 bg-amber-50 dark:border-amber-300/50 dark:bg-amber-300/10"
                        : `${lineCls} bg-white dark:bg-zinc-900/40`
                  }`}
                >
                  <span className="text-base font-semibold sm:text-lg">{hijriDay}</span>
                  <span className={`text-[10px] sm:text-xs ${isToday ? "opacity-80" : mutedCls}`}>
                    {new Intl.DateTimeFormat("en", { timeZone: "UTC", day: "numeric", month: "short" }).format(gregorian)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={`mt-6 text-sm ${mutedCls}`}>This month is outside the supported range.</p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className={`flex items-center gap-2 text-xs ${mutedCls}`}>
            <span className="inline-block size-3 rounded border border-amber-400 bg-amber-50 dark:border-amber-300/50 dark:bg-amber-300/10" />
            White Days — recommended fasting on the 13th, 14th, 15th
          </p>
          <button type="button" onClick={exportWhiteDays} className={btnPrimary}>
            <Icon icon="ph:download-simple" className="size-4" />
            Export White Days {year} AH (.ics)
          </button>
        </div>
      </div>
      )}
    </ToolShell>
  );
}
