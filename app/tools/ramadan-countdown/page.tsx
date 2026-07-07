"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ToolShell, btnGhost, cardCls, mutedCls, useMounted } from "@/components/ui";
import { formatGregorian, ramadanStatus } from "@/lib/hijri";

function segments(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { label: "days", value: Math.floor(s / 86400) },
    { label: "hours", value: Math.floor((s % 86400) / 3600) },
    { label: "minutes", value: Math.floor((s % 3600) / 60) },
    { label: "seconds", value: s % 60 },
  ];
}

export default function RamadanCountdownPage() {
  const mounted = useMounted();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const status = useMemo(() => ramadanStatus(), []);
  // Count down to local midnight at the start of 1 Ramadan.
  const target = status.start
    ? new Date(
        status.start.getUTCFullYear(),
        status.start.getUTCMonth(),
        status.start.getUTCDate(),
      ).getTime()
    : null;

  return (
    <ToolShell
      icon="ph:moon-stars"
      title="Ramadan Countdown"
      arabic="رمضان"
      intro="How long until the blessed month begins — computed from the Umm al-Qura calendar on your device. Actual start may shift by a day with local moonsighting."
    >
      {!mounted ? (
        <p className={`text-sm ${mutedCls}`}>Loading the countdown…</p>
      ) : status.inRamadan ? (
        <div className="rounded-2xl bg-emerald-700 p-8 text-center text-white dark:bg-emerald-400 dark:text-emerald-950">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
            Ramadan Mubarak
          </p>
          <p className="mt-3 font-display text-5xl">Day {status.dayOfRamadan}</p>
          <p className="mt-2 opacity-90">
            of Ramadan {status.hijriYear} AH · {30 - status.dayOfRamadan} days remain
          </p>
        </div>
      ) : (
        <div className={`${cardCls} p-8 text-center`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}>
            Ramadan {status.hijriYear} AH begins in
          </p>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {segments(target ? target - now : 0).map((seg) => (
              <div key={seg.label}>
                <p className="font-mono text-3xl font-semibold text-emerald-700 sm:text-5xl dark:text-emerald-400">
                  {String(seg.value).padStart(2, "0")}
                </p>
                <p className={`mt-1 text-xs uppercase tracking-wide ${mutedCls}`}>{seg.label}</p>
              </div>
            ))}
          </div>
          {status.start ? (
            <p className={`mt-6 text-sm ${mutedCls}`}>
              Expected to begin {formatGregorian(status.start)}
            </p>
          ) : null}
        </div>
      )}

      <div className={`mt-6 ${cardCls} p-5`}>
        <h2 className="font-display text-xl">Daily companion</h2>
        <ul className={`mt-3 space-y-2 text-sm leading-relaxed ${mutedCls}`}>
          <li>Suhoor ends at Fajr and iftar is at Maghrib — check today&rsquo;s exact times for your city.</li>
          <li>The last ten nights carry Laylat al-Qadr; increase worship from day 21.</li>
          <li>White Days fasting (13th–15th) keeps the habit alive the rest of the year.</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/tools/prayer-times" className={btnGhost}>Prayer times</Link>
          <Link href="/tools/hijri-calendar" className={btnGhost}>Hijri calendar</Link>
        </div>
      </div>
    </ToolShell>
  );
}
