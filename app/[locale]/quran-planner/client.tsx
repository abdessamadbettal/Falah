"use client";

import { useState } from "react";
import { useLocale, useDict } from "@/components/locale";
import { dirFor } from "@/lib/i18n";
import { ToolShell } from "@/components/ui/tool-shell";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { lineCls, mutedCls, brandCls, cardCls } from "@/components/ui/styles";
import { Icon } from "@iconify/react";
import { motion } from "motion/react";

export default function Client() {
  const locale = useLocale();
  const d = useDict();
  const dir = dirFor(locale);
  const k = d.tools.khatam;

  const [planType, setPlanType] = useState<"days" | "date">("days");

  // Defaults to today
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Default to 30 days from today
  const defaultEnd = new Date(today);
  defaultEnd.setDate(defaultEnd.getDate() + 30);
  const defaultEndStr = defaultEnd.toISOString().split("T")[0];

  const [days, setDays] = useState(30);
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndStr);

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
      totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    if (totalDays < 0) {
      error = k.invalidDate;
    } else if (totalDays === 0) {
      error = k.tooFast;
    }
  }

  // standard Hafs Quran has 604 pages
  const totalPages = 604;
  let pagesPerDay = 0;
  let pagesPerPrayer = 0;

  if (totalDays > 0) {
    pagesPerDay = Math.ceil(totalPages / totalDays);
    pagesPerPrayer = Math.ceil(pagesPerDay / 5);
  }

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
        <div className="relative overflow-hidden rounded-2xl bg-emerald-700 p-8 text-white shadow-xl dark:bg-emerald-600/20 dark:text-emerald-50">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-10 size-64 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -left-10 size-48 rounded-full bg-emerald-900/20 blur-2xl"
          />

          <div className="relative h-full flex flex-col justify-between space-y-8">
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

                <div className="mt-8 flex items-center justify-between rounded-xl bg-black/20 p-4 border border-white/5">
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
                  <div className="text-right">
                    <Icon icon="ph:check-circle-fill" className="size-8 text-emerald-300" />
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
