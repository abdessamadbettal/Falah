"use client";

import { useState, useEffect } from "react";
import { useLocale, useDict } from "@/components/locale";
import { dirFor } from "@/lib/i18n";
import { ToolShell, useMounted } from "@/components/ui";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { mutedCls, brandCls, cardCls } from "@/components/ui/styles";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { unitPath } from "@/lib/quran-reader";

type KhatamPlan = {
  days: number;
  pagesPerDay: number;
  pagesPerPrayer: number;
};

type LastRead = {
  mode: string;
  n: number;
  timestamp: number;
};

export default function Client() {
  const locale = useLocale();
  const d = useDict();
  const dir = dirFor(locale);
  const k = d.tools.khatam;

  const isMounted = useMounted();
  const [activePlan, setActivePlan] = useState<KhatamPlan | null>(null);
  const [lastRead, setLastRead] = useState<LastRead | null>(null);

  const [planType, setPlanType] = useState<"days" | "date">("days");

  // Use local timezone for default dates instead of UTC
  const getLocalDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const today = new Date();
  const todayStr = getLocalDate(today);

  // Default to 29 days from today (so it's exactly 30 days inclusive)
  const defaultEnd = new Date(today);
  defaultEnd.setDate(defaultEnd.getDate() + 29);
  const defaultEndStr = getLocalDate(defaultEnd);

  const [days, setDays] = useState(30);
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndStr);
  
  // Track daily checkboxes
  const [prayersChecked, setPrayersChecked] = useState<number>(0);

  useEffect(() => {
    const plan = localStorage.getItem("falah:khatam:plan");
    if (plan) {
      try {
        const parsed = JSON.parse(plan);
        setTimeout(() => setActivePlan(parsed), 0);
      } catch {}
    }
    
    const read = localStorage.getItem("falah:quran:last-read");
    if (read) {
      try {
        const parsed = JSON.parse(read);
        setTimeout(() => setLastRead(parsed), 0);
      } catch {}
    }
  }, []);

  // Calculate total days
  let totalDays = 0;
  let error = "";

  if (planType === "days") {
    totalDays = days > 0 ? days : 0;
    if (totalDays < 1) error = k.tooFast;
  } else {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (isNaN(start) || isNaN(end)) {
      totalDays = 0;
    } else {
      totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }

    if (totalDays < 0) {
      error = k.invalidDate;
    } else if (totalDays === 0) {
      error = k.tooFast;
    }
  }

  const totalPages = 604;
  let pagesPerDay = 0;
  let pagesPerPrayer = 0;

  if (totalDays > 0) {
    pagesPerDay = Math.ceil(totalPages / totalDays);
    pagesPerPrayer = Math.ceil(pagesPerDay / 5);
  }

  const startKhatam = () => {
    if (error) return;
    const plan: KhatamPlan = { days: totalDays, pagesPerDay, pagesPerPrayer };
    localStorage.setItem("falah:khatam:plan", JSON.stringify(plan));
    setActivePlan(plan);
    setPrayersChecked(0);
  };

  const cancelKhatam = () => {
    localStorage.removeItem("falah:khatam:plan");
    setActivePlan(null);
  };

  const handleCheckboxClick = (idx: number) => {
    // If they click the next available checkbox or one that's already checked
    if (idx <= prayersChecked) {
      setPrayersChecked(idx === prayersChecked ? idx - 1 : idx);
    } else if (idx === prayersChecked + 1) {
      setPrayersChecked(idx);
    }
  };

  if (isMounted && activePlan) {
    const progressPercent = lastRead?.mode === "page" 
      ? Math.min(100, Math.max(0, (lastRead.n / 604) * 100))
      : 0;

    return (
      <ToolShell icon="ph:calendar-check" title={k.title} side={k.side} intro={k.intro} wide>
        <div className="mx-auto max-w-2xl space-y-8 w-full">
          
          {/* Tracking Card */}
          <div className={`${cardCls} overflow-hidden rounded-3xl p-8 shadow-sm`}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <Icon icon="ph:chart-line-up" className="size-8" />
              </div>
              <h3 className="font-display text-2xl font-semibold">{k.yourProgress || "Your Progress"}</h3>
              <p className={mutedCls}>{k.todayGoal || "Today's Goal"}: {activePlan.pagesPerDay} {k.page || "Pages"}</p>
            </div>

            {/* Resume Button */}
            {lastRead && (
              <div className="mt-8 flex justify-center">
                <Link
                  href={unitPath(locale, lastRead.mode as "surah" | "juz" | "hizb" | "page", lastRead.n)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-md"
                >
                  <Icon icon="ph:book-open" className="size-5" />
                  {k.resumeReading || "Resume Reading"} ({lastRead.mode === "page" ? `${k.page || "Page"} ${lastRead.n}` : lastRead.mode})
                </Link>
              </div>
            )}

            {/* Checkboxes */}
            <div className="mt-10 text-center">
              <p className={`mb-4 text-sm font-medium ${mutedCls}`}>{k.pagesPerPrayer}</p>
              <div className="flex flex-wrap justify-center gap-4">
                {[1, 2, 3, 4, 5].map((prayerIdx) => {
                  const isChecked = prayerIdx <= prayersChecked;
                  const isNext = prayerIdx === prayersChecked + 1;
                  return (
                    <button
                      key={prayerIdx}
                      onClick={() => handleCheckboxClick(prayerIdx)}
                      disabled={prayerIdx > prayersChecked + 1}
                      className={`relative flex size-14 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                        isChecked 
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
                          : isNext 
                            ? "border-emerald-200 bg-white hover:border-emerald-300 dark:border-emerald-800 dark:bg-zinc-900 cursor-pointer" 
                            : "border-zinc-100 bg-zinc-50 opacity-50 dark:border-zinc-800 dark:bg-zinc-900 cursor-not-allowed"
                      }`}
                    >
                      <AnimatePresence>
                        {isChecked && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute"
                          >
                            <Icon icon="ph:check-bold" className="size-6" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {!isChecked && <span className={`text-lg font-bold ${isNext ? "text-emerald-300" : "text-zinc-300 dark:text-zinc-700"}`}>{activePlan.pagesPerPrayer}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Overall Progress */}
            {lastRead?.mode === "page" && (
              <div className="mt-10 rounded-2xl bg-zinc-50 p-6 dark:bg-zinc-900/50">
                <div className="mb-2 flex items-center justify-between text-sm font-medium">
                  <span>0%</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{progressPercent.toFixed(1)}% {k.completed || "Completed"}</span>
                  <span>100%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <button onClick={cancelKhatam} className={`text-sm underline ${mutedCls} hover:text-red-500`}>
              {k.cancelPlan || "Cancel Plan"}
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // The Planning UI
  return (
    <ToolShell icon="ph:calendar-check" title={k.title} side={k.side} intro={k.intro} wide>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Configuration Card */}
        <div className={`${cardCls} space-y-6 p-6`}>
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40 ${brandCls}`}>
              <Icon icon="ph:sliders-horizontal" className="size-5" />
            </div>
            <h3 className="font-display text-lg font-medium">Plan Settings</h3>
          </div>

          <Field label={k.goalType}>
            <Select
              value={planType}
              onChange={(e) => setPlanType(e.target.value as "days" | "date")}
              dir={dir}
            >
              <option value="days">{k.byDays}</option>
              <option value="date">{k.byDate}</option>
            </Select>
          </Field>

          {planType === "days" ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Field label={k.totalDays}>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 0)}
                    dir="ltr"
                    className="pl-12 text-lg font-semibold"
                  />
                  <Icon icon="ph:calendar-blank" className={`absolute left-4 top-1/2 -translate-y-1/2 size-5 ${mutedCls}`} />
                </div>
              </Field>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
              <Field label={k.startDate}>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  dir="ltr"
                />
              </Field>
              <Field label={k.endDate}>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  dir="ltr"
                />
              </Field>
            </motion.div>
          )}
        </div>

        {/* Dynamic Results Card */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl bg-emerald-700 p-8 text-white shadow-xl dark:bg-emerald-600/20 dark:text-emerald-50">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-10 size-64 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -left-10 size-48 rounded-full bg-emerald-900/20 blur-2xl"
          />

          <div className="relative z-10 flex h-full flex-col justify-between space-y-8">
            {error ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-white/20 p-4 backdrop-blur-md">
                  <Icon icon="ph:warning-circle" className="size-10 text-white" />
                </div>
                <p className="text-lg font-medium text-emerald-50">{error}</p>
              </motion.div>
            ) : (
              <motion.div key={totalDays} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                <p className="mb-8 text-lg font-medium text-emerald-100">
                  {k.summary(totalDays)}
                </p>

                <div className="grid grid-cols-2 gap-6">
                  {/* Pages Per Day */}
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-black/10 p-6 backdrop-blur-md border border-white/10">
                    <Icon icon="ph:book-open-text" className="mb-2 size-8 text-emerald-200" />
                    <span className="font-display text-5xl font-bold">
                      {pagesPerDay}
                    </span>
                    <span className="mt-2 text-sm text-emerald-100 text-center">{k.pagesPerDay}</span>
                  </div>

                  {/* Pages Per Prayer */}
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-black/10 p-6 backdrop-blur-md border border-white/10">
                    <Icon icon="ph:hands-praying" className="mb-2 size-8 text-emerald-200" />
                    <span className="font-display text-5xl font-bold">
                      {pagesPerPrayer}
                    </span>
                    <span className="mt-2 text-sm text-emerald-100 text-center">{k.pagesPerPrayer}</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col space-y-4">
                  <button
                    onClick={startKhatam}
                    className="w-full rounded-xl bg-white p-4 font-semibold text-emerald-700 shadow-md transition-transform hover:scale-[1.02] active:scale-95 dark:bg-emerald-50 dark:text-emerald-900"
                  >
                    {k.startKhatam || "Start this Khatam"}
                  </button>
                  <div className="flex items-center justify-between rounded-xl bg-black/20 p-4 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <Icon icon="ph:book-bookmark" className="size-5 text-emerald-100" />
                      </div>
                      <div>
                        <p className="font-medium">{k.pagesTotal}</p>
                        <p className="text-xs text-emerald-200/80">
                          {totalDays} {k.approximate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
