"use client";

import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import { Field, Input, ToolShell, useMounted } from "@/components/ui";
import { brandCls, cardCls, cn, lineCls, mutedCls } from "@/components/ui/styles";
import {
  addDays,
  asPages,
  clearPlan,
  dayKey,
  daysBetween,
  doneOf,
  formatDay,
  type KhatamPlan,
  KHATAM_UNITS,
  type KhatamUnit,
  type LastRead,
  lastWeek,
  loadLastRead,
  loadPlan,
  planStats,
  positionIn,
  savePlan,
  setDone,
  weekdayOf,
} from "@/lib/khatam";
import { UNIT_TOTAL, unitPath } from "@/lib/quran-reader";

const MAX_DAYS = 365;
const PRESETS = [7, 30, 90, 365];

export default function Client() {
  const d = useDict();
  const k = d.tools.khatam;
  const mounted = useMounted();

  // Read once, on the first render. On the server the loaders find no
  // localStorage and hand back null, which is exactly what the prerendered
  // spinner below expects — so there is no mismatch to patch up in an effect.
  const [plan, setPlan] = useState<KhatamPlan | null>(loadPlan);
  const [lastRead] = useState<LastRead | null>(loadLastRead);
  /** Set when an existing plan is being replaced, so the setup screen can be
   * reached without throwing the current one away first. */
  const [editing, setEditing] = useState(false);

  /** One write path for the whole tool: state and storage never disagree. */
  const commit = (next: KhatamPlan) => {
    savePlan(next);
    setPlan(next);
  };

  const shell = (children: React.ReactNode) => (
    <ToolShell icon="ph:calendar-check" title={k.title} side={k.side} intro={k.intro} wide>
      {children}
    </ToolShell>
  );

  // The plan lives in localStorage, so the prerendered HTML can't know which
  // of the two screens belongs here.
  if (!mounted) {
    return shell(
      <div className="flex min-h-[420px] items-center justify-center">
        <Icon icon="ph:spinner-gap" className="size-8 animate-spin text-zinc-400" />
      </div>,
    );
  }

  if (!plan || editing) {
    return shell(
      <Setup
        current={editing ? plan : null}
        onStart={(next) => {
          commit(next);
          setEditing(false);
        }}
        onCancel={editing ? () => setEditing(false) : undefined}
      />,
    );
  }

  return shell(
    <Tracker
      plan={plan}
      lastRead={lastRead}
      onChange={commit}
      onEdit={() => setEditing(true)}
      onDelete={() => {
        clearPlan();
        setPlan(null);
      }}
    />,
  );
}

/* ── setup ────────────────────────────────────────────────────────────── */

function Setup({
  current,
  onStart,
  onCancel,
}: {
  current: KhatamPlan | null;
  onStart: (plan: KhatamPlan) => void;
  onCancel?: () => void;
}) {
  const locale = useLocale();
  const k = useDict().tools.khatam;
  const today = dayKey();

  const [unit, setUnit] = useState<KhatamUnit>(current?.unit ?? "page");
  const [mode, setMode] = useState<"days" | "date">("days");
  const [days, setDays] = useState(current?.days ?? 30);
  // Re-planning restarts the clock from today; only the target date is ever
  // set in the past or future by hand.
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(addDays(today, (current?.days ?? 30) - 1));

  const length = mode === "days" ? days : daysBetween(start, end) + 1;
  const error =
    mode === "date" && daysBetween(start, end) < 0
      ? k.invalidDate
      : length < 1 || Number.isNaN(length)
        ? k.tooFast
        : length > MAX_DAYS
          ? k.tooSlow
          : "";

  const total = UNIT_TOTAL[unit];
  const perDay = error ? 0 : Math.ceil(total / length);
  const pages = asPages(unit, perDay);
  const finish = mode === "days" ? addDays(today, Math.max(0, length - 1)) : end;

  // Changing only the length of a khatam in progress keeps what's been read;
  // switching unit — or planning a fresh one after finishing — starts at zero.
  const keepLog = current && current.unit === unit && doneOf(current) < total;

  return (
    <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-2 lg:items-start">
      <section className={`${cardCls} space-y-6 p-6`}>
        <div className={`flex items-center gap-3 border-b pb-4 ${lineCls}`}>
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40 ${brandCls}`}>
            <Icon icon="ph:sliders-horizontal" className="size-5" />
          </span>
          <h2 className="font-display text-lg font-medium">{k.setupTitle}</h2>
        </div>

        <div className="space-y-2">
          <span className="block text-sm font-medium">{k.readBy}</span>
          <Segmented
            value={unit}
            onChange={setUnit}
            options={KHATAM_UNITS.map((u) => ({ value: u, label: k.units[u] }))}
          />
          <span className={`block text-xs ${mutedCls}`}>{k.unitTotals[unit]}</span>
        </div>

        <div className="space-y-2">
          <span className="block text-sm font-medium">{k.goalType}</span>
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: "days" as const, label: k.byDays },
              { value: "date" as const, label: k.byDate },
            ]}
          />
        </div>

        {mode === "days" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className={`block text-xs font-medium ${mutedCls}`}>{k.presets}</span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setDays(n)}
                    aria-pressed={days === n}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      days === n
                        ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950"
                        : `${lineCls} ${mutedCls} hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`,
                    )}
                  >
                    {k.presetLabels[n] ?? n}
                  </button>
                ))}
              </div>
            </div>
            <Field label={k.totalDays}>
              <Input
                type="number"
                min={1}
                max={MAX_DAYS}
                inputMode="numeric"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                dir="ltr"
                aria-invalid={Boolean(error) || undefined}
                className="text-lg font-semibold"
              />
            </Field>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={k.startDate}>
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} dir="ltr" />
            </Field>
            <Field label={k.endDate}>
              <Input
                type="date"
                value={end}
                min={start}
                onChange={(e) => setEnd(e.target.value)}
                dir="ltr"
                aria-invalid={Boolean(error) || undefined}
              />
            </Field>
          </div>
        )}
      </section>

      <section className="relative overflow-hidden rounded-2xl bg-emerald-700 p-6 text-white shadow-lg sm:p-8 dark:bg-emerald-900/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-10 -top-12 size-56 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative space-y-6">
          {error ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
              <Icon icon="ph:warning-circle" className="size-10 text-emerald-100" />
              <p className="text-lg font-medium text-emerald-50">{error}</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <motion.p
                  key={`${perDay}-${unit}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-6xl font-bold tabular-nums"
                >
                  {perDay}
                </motion.p>
                <p className="mt-1 text-lg font-medium text-emerald-50">
                  {k.unitOf[unit]} {k.perDay}
                </p>
                {unit !== "page" && (
                  <p className="mt-1 text-sm text-emerald-100/80">{k.aboutPages(pages)}</p>
                )}
              </div>

              <div className="space-y-2 rounded-xl bg-black/15 p-4 text-sm">
                <Row icon="ph:hands-praying" label={k.perPrayer(Math.ceil(pages / 5))} />
                <Row icon="ph:flag-checkered" label={`${k.finishesOn} ${formatDay(finish, locale)}`} />
                <Row icon="ph:book-open-text" label={k.unitTotals[unit]} />
              </div>

              <button
                type="button"
                onClick={() =>
                  onStart({
                    unit,
                    days: length,
                    start: mode === "days" ? today : start,
                    log: keepLog ? current.log : {},
                  })
                }
                className="w-full rounded-xl bg-white px-5 py-3.5 font-semibold text-emerald-800 shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                {k.startKhatam}
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full text-sm text-emerald-100/80 underline underline-offset-4 hover:text-white"
                >
                  {k.keepPlan}
                </button>
              )}
              <p className="text-center text-xs text-emerald-100/70">{k.savedLocally}</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function Row({ icon, label }: { icon: string; label: string }) {
  return (
    <p className="flex items-center gap-2.5 text-emerald-50">
      <Icon icon={icon} className="size-4 shrink-0 text-emerald-200" />
      {label}
    </p>
  );
}

/* ── tracker ──────────────────────────────────────────────────────────── */

function Tracker({
  plan,
  lastRead,
  onChange,
  onEdit,
  onDelete,
}: {
  plan: KhatamPlan;
  lastRead: LastRead | null;
  onChange: (plan: KhatamPlan) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const locale = useLocale();
  const k = useDict().tools.khatam;
  const [confirming, setConfirming] = useState(false);

  const s = planStats(plan);
  const unitName = k.unitOf[plan.unit];
  const unitLabel = k.unitOne[plan.unit];
  const move = (to: number) => onChange(setDone(plan, to));

  // Only offered when the reader is genuinely further along than the plan —
  // syncing backwards would erase progress the user logged by hand.
  const bookmark = lastRead ? positionIn(plan.unit, lastRead) : 0;
  const canSync = bookmark > doneOf(plan);

  const status = s.finished
    ? { tone: "brand" as const, icon: "ph:check-circle", text: k.finishedTitle }
    : s.drift >= 0
      ? { tone: "brand" as const, icon: "ph:trend-up", text: s.drift > 0 ? k.ahead(s.drift, unitName) : k.onTrack }
      : { tone: "warn" as const, icon: "ph:trend-down", text: k.behind(-s.drift, unitName) };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className={`${cardCls} p-6 sm:p-8`}>
        <div className="flex flex-col items-center gap-7 sm:flex-row sm:gap-8">
          <Ring percent={s.percent} />
          <div className="min-w-0 flex-1 space-y-4 text-center sm:text-start">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
                status.tone === "brand"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
              )}
            >
              <Icon icon={status.icon} className="size-4" />
              {status.text}
            </span>
            <p className="font-display text-2xl font-semibold">
              {k.ofTotal(s.done, s.total, unitName)}
            </p>
            <dl className={`grid grid-cols-3 gap-3 text-sm ${mutedCls}`}>
              <Stat label={k.dayOf(s.day, plan.days)} value={s.daysLeft > 0 ? k.daysLeft(s.daysLeft) : k.overdue} />
              <Stat label={k.finishesOn} value={formatDay(s.endDate, locale)} />
              <Stat
                label={k.atThisPace}
                value={s.paceDate ? formatDay(s.paceDate, locale) : k.nothingYet}
              />
            </dl>
          </div>
        </div>
      </section>

      {s.finished ? (
        <section className="rounded-2xl border border-emerald-600/20 bg-emerald-50/70 p-8 text-center dark:border-emerald-400/15 dark:bg-emerald-500/10">
          <Icon icon="ph:sparkle" className={`mx-auto size-10 ${brandCls}`} />
          <h2 className="mt-3 font-display text-2xl font-semibold">{k.finishedTitle}</h2>
          <p className={`mx-auto mt-2 max-w-md ${mutedCls}`}>{k.finishedBody}</p>
          <button
            type="button"
            onClick={onEdit}
            className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-emerald-800 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300"
          >
            {k.newKhatam}
          </button>
        </section>
      ) : (
        <section className="rounded-2xl border border-emerald-600/20 bg-emerald-50/70 p-6 sm:p-7 dark:border-emerald-400/15 dark:bg-emerald-500/10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={`text-sm font-medium ${mutedCls}`}>{k.todayPortion}</p>
              <p className="font-display mt-1 text-3xl font-semibold">
                {s.todayLeft === 0 ? k.todayDone : k.range(unitLabel, s.from, s.to)}
              </p>
              <p className={`mt-1 text-sm ${mutedCls}`}>
                {s.todayLeft === 0
                  ? k.range(unitLabel, s.to - s.todayTarget + 1, s.to)
                  : k.aboutPages(asPages(plan.unit, s.todayLeft))}
              </p>
            </div>
            {s.doneToday > 0 && (
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${brandCls}`}>
                <Icon icon="ph:check-circle-fill" className="size-4" />
                {k.readToday(s.doneToday, unitName)}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={unitPath(locale, plan.unit, s.from)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300"
            >
              <Icon icon="ph:book-open" className="size-5" />
              {s.todayLeft === 0 ? k.readAhead : k.readNow}
            </Link>
            {s.todayLeft > 0 && (
              <button
                type="button"
                onClick={() => move(s.done + s.todayLeft)}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border bg-white px-5 py-3 font-semibold transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:bg-zinc-900 dark:hover:border-emerald-400 dark:hover:text-emerald-400 ${lineCls}`}
              >
                <Icon icon="ph:check" className="size-5" />
                {k.markRead(s.todayLeft, unitName)}
              </button>
            )}
          </div>

          <div className={`mt-4 flex items-center justify-center gap-2 text-sm ${mutedCls}`}>
            <Stepper icon="ph:minus" label={k.undo} onClick={() => move(s.done - 1)} disabled={s.done === 0} />
            <span className="tabular-nums">{k.ofTotal(s.done, s.total, unitName)}</span>
            <Stepper icon="ph:plus" label={k.readNow} onClick={() => move(s.done + 1)} />
          </div>
        </section>
      )}

      {canSync && (
        <section className={`${cardCls} flex flex-wrap items-center justify-between gap-4 p-5`}>
          <p className="flex items-center gap-3">
            <Icon icon="ph:bookmark-simple" className={`size-5 shrink-0 ${brandCls}`} />
            <span>
              <span className={`block text-xs ${mutedCls}`}>{k.resumeTitle}</span>
              <span className="font-medium">{k.range(unitLabel, bookmark, bookmark)}</span>
            </span>
          </p>
          <button
            type="button"
            onClick={() => move(bookmark)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400 ${lineCls}`}
          >
            {k.syncFromReader(unitLabel.toLowerCase(), bookmark)}
          </button>
        </section>
      )}

      <section className={`${cardCls} p-6`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium">{k.thisWeek}</h2>
          {s.streak > 0 && (
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${brandCls}`}>
              <Icon icon="ph:fire-fill" className="size-4" />
              {k.streak(s.streak)}
            </span>
          )}
        </div>
        <Week log={plan.log} target={s.perDay} locale={locale} />
      </section>

      <div className={`flex flex-wrap items-center justify-between gap-3 text-sm ${mutedCls}`}>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 hover:text-emerald-700 dark:hover:text-emerald-400">
          <Icon icon="ph:pencil-simple" className="size-4" />
          {k.changePlan}
        </button>
        {confirming ? (
          <span className="inline-flex items-center gap-3">
            <span>{k.resetConfirm}</span>
            <button type="button" onClick={onDelete} className="font-medium text-red-600 hover:underline dark:text-red-400">
              {k.resetPlan}
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="hover:text-zinc-900 dark:hover:text-zinc-100">
              {k.keepPlan}
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center gap-1.5 hover:text-red-600 dark:hover:text-red-400">
            <Icon icon="ph:trash" className="size-4" />
            {k.resetPlan}
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs">{label}</dt>
      <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">{value}</dd>
    </div>
  );
}

function Stepper({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`grid size-8 place-items-center rounded-full border transition-colors hover:border-emerald-600 hover:text-emerald-700 disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:text-current dark:hover:border-emerald-400 dark:hover:text-emerald-400 ${lineCls}`}
    >
      <Icon icon={icon} className="size-4" />
    </button>
  );
}

/** Seven bars, scaled against the daily target rather than the best day — a
 * bar that fills means the day's portion was met, which is the thing being
 * asked about. */
function Week({ log, target, locale }: { log: Record<string, number>; target: number; locale: string }) {
  const today = dayKey();
  const days = lastWeek(today);
  const peak = Math.max(target, ...days.map((day) => log[day] ?? 0));

  return (
    <div className="flex h-28 items-end gap-2">
      {days.map((day) => {
        const n = log[day] ?? 0;
        const met = n >= target;
        return (
          <div key={day} className="group relative flex flex-1 flex-col items-center gap-2">
            <div className="flex h-full w-full items-end rounded-md bg-zinc-100 dark:bg-zinc-800/60">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${n > 0 ? Math.max(6, (n / peak) * 100) : 0}%` }}
                title={String(n)}
                className={cn(
                  "w-full rounded-md",
                  met ? "bg-emerald-600 dark:bg-emerald-400" : "bg-emerald-300 dark:bg-emerald-400/40",
                )}
              />
            </div>
            <span
              className={cn(
                "text-[10px] font-medium uppercase",
                day === today ? "text-zinc-900 dark:text-zinc-100" : mutedCls,
              )}
            >
              {weekdayOf(day, locale)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Ring({ percent }: { percent: number }) {
  const circumference = 2 * Math.PI * 52;
  return (
    <div className="relative grid size-36 shrink-0 place-items-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="52" strokeWidth="10" className="fill-none stroke-zinc-200 dark:stroke-zinc-800" />
        <motion.circle
          cx="60"
          cy="60"
          r="52"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: circumference * (1 - Math.min(100, percent) / 100) }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fill-none stroke-emerald-600 dark:stroke-emerald-400"
        />
      </svg>
      <span className="font-display text-3xl font-bold tabular-nums">{Math.round(percent)}%</span>
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/60">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cn(
            "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            value === o.value
              ? `bg-white shadow-sm dark:bg-zinc-900 ${brandCls}`
              : `${mutedCls} hover:text-zinc-900 dark:hover:text-zinc-100`,
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
