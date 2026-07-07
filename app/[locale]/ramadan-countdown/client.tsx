"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import { ToolShell, btnGhost, cardCls, mutedCls, useMounted } from "@/components/ui";
import { formatGregorian, ramadanStatus } from "@/lib/hijri";

function segments(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { key: "days" as const, value: Math.floor(s / 86400) },
    { key: "hours" as const, value: Math.floor((s % 86400) / 3600) },
    { key: "minutes" as const, value: Math.floor((s % 3600) / 60) },
    { key: "seconds" as const, value: s % 60 },
  ];
}

export default function RamadanCountdownClient() {
  const d = useDict();
  const t = d.tools.ramadan;
  const locale = useLocale();
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
    <ToolShell icon="ph:moon-stars" title={t.title} side={t.side} intro={t.intro}>
      {!mounted ? (
        <p className={`text-sm ${mutedCls}`}>{t.loading}</p>
      ) : status.inRamadan ? (
        <div className="rounded-2xl bg-emerald-700 p-8 text-center text-white dark:bg-emerald-400 dark:text-emerald-950">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
            {t.mubarak}
          </p>
          <p className="mt-3 font-display text-5xl">{t.dayX(status.dayOfRamadan)}</p>
          <p className="mt-2 opacity-90">{t.remain(status.hijriYear, 30 - status.dayOfRamadan)}</p>
        </div>
      ) : (
        <div className={`${cardCls} p-8 text-center`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}>
            {t.beginsIn(status.hijriYear)}
          </p>
          <div className="mt-6 grid grid-cols-4 gap-3" dir="ltr">
            {segments(target ? target - now : 0).map((seg) => (
              <div key={seg.key}>
                <p className="font-mono text-3xl font-semibold text-emerald-700 sm:text-5xl dark:text-emerald-400">
                  {String(seg.value).padStart(2, "0")}
                </p>
                <p className={`mt-1 text-xs uppercase tracking-wide ${mutedCls}`}>
                  {t.units[seg.key]}
                </p>
              </div>
            ))}
          </div>
          {status.start ? (
            <p className={`mt-6 text-sm ${mutedCls}`}>
              {t.expected} {formatGregorian(status.start, locale)}
            </p>
          ) : null}
        </div>
      )}

      <div className={`mt-6 ${cardCls} p-5`}>
        <h2 className="font-display text-xl">{t.companion}</h2>
        <ul className={`mt-3 space-y-2 text-sm leading-relaxed ${mutedCls}`}>
          {t.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/${locale}/tools/prayer-times`} className={btnGhost}>{t.linkPrayer}</Link>
          <Link href={`/${locale}/tools/hijri-calendar`} className={btnGhost}>{t.linkCalendar}</Link>
        </div>
      </div>
    </ToolShell>
  );
}
