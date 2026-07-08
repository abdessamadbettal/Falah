"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Faq } from "@/components/faq";
import { useDict, useLocale } from "@/components/locale";
import { ToolShell, btnGhost, cardCls, mutedCls, useMounted } from "@/components/ui";
import { formatGregorian, ramadanStatus } from "@/lib/hijri";
import { localePath } from "@/lib/i18n";
import { JsonLd, TOOL_PATHS, faqJsonLd } from "@/lib/seo";

function segments(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { key: "days" as const, value: Math.floor(s / 86400) },
    { key: "hours" as const, value: Math.floor((s % 86400) / 3600) },
    { key: "minutes" as const, value: Math.floor((s % 3600) / 60) },
    { key: "seconds" as const, value: s % 60 },
  ];
}

/** A single value that rolls upward when it changes. */
function Rolling({ value, reduce }: { value: string; reduce: boolean }) {
  if (reduce) return <span>{value}</span>;
  return (
    <span className="relative block overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function RamadanCountdownClient() {
  const d = useDict();
  const t = d.tools.ramadan;
  const locale = useLocale();
  const mounted = useMounted();
  const reduce = useReducedMotion();
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
      <JsonLd data={faqJsonLd(t.faq)} />
      {!mounted ? (
        <p className={`text-sm ${mutedCls}`}>{t.loading}</p>
      ) : status.inRamadan ? (
        <div className="relative overflow-hidden rounded-2xl bg-emerald-700 p-8 text-center text-white dark:bg-emerald-400 dark:text-emerald-950">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-1/2 size-48 -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
            animate={reduce ? undefined : { opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="relative text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
            {t.mubarak}
          </p>
          <p className="relative mt-3 font-display text-5xl">{t.dayX(status.dayOfRamadan)}</p>
          <p className="relative mt-2 opacity-90">{t.remain(status.hijriYear, 30 - status.dayOfRamadan)}</p>
        </div>
      ) : (
        <div className={`relative overflow-hidden ${cardCls} p-8 text-center`}>
          {/* a crescent that rises and glows above the countdown */}
          <div className="relative mx-auto mb-6 grid size-20 place-items-center">
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl dark:bg-emerald-400/20"
              animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon icon="ph:moon-stars-fill" className="size-14 text-emerald-700 dark:text-emerald-400" />
            </motion.div>
          </div>

          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}>
            {t.beginsIn(status.hijriYear)}
          </p>
          <div className="mt-6 grid grid-cols-4 gap-3" dir="ltr">
            {segments(target ? target - now : 0).map((seg) => (
              <div key={seg.key}>
                <div className="font-mono text-3xl font-semibold text-emerald-700 sm:text-5xl dark:text-emerald-400">
                  <Rolling value={String(seg.value).padStart(2, "0")} reduce={!!reduce} />
                </div>
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
            <li key={tip} className="flex gap-2.5">
              <Icon icon="ph:star-four" className="mt-1 size-3.5 shrink-0 text-amber-500 dark:text-amber-300" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={localePath(locale, TOOL_PATHS.prayer)} className={btnGhost}>{t.linkPrayer}</Link>
          <Link href={localePath(locale, TOOL_PATHS.calendar)} className={btnGhost}>{t.linkCalendar}</Link>
        </div>
      </div>

      <Faq eyebrow={t.faqEyebrow} heading={t.faqH2} items={t.faq} />
    </ToolShell>
  );
}
