"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import {
  Field,
  ToolShell,
  brandCls,
  cardCls,
  goldCls,
  inputCls,
  lineCls,
  mutedCls,
} from "@/components/ui";
import {
  formatGregorian,
  formatHijri,
  hijriFromGregorian,
  hijriToGregorian,
  todayUtcNoon,
  utcNoon,
  type HijriDate,
} from "@/lib/hijri";

function ageBetween(birth: HijriDate, today: HijriDate) {
  let years = today.year - birth.year;
  if (today.month < birth.month || (today.month === birth.month && today.day < birth.day)) {
    years -= 1;
  }
  return years;
}

const MILESTONE_AGES = [15, 40, 63];

export default function HijriAgeClient() {
  const d = useDict();
  const t = d.tools.age;
  const locale = useLocale();
  const [birth, setBirth] = useState("");

  const parts = birth.split("-").map(Number);
  const birthDate =
    parts.length === 3 && parts.every(Number.isFinite) && parts[0] > 1900
      ? utcNoon(parts[0], parts[1] - 1, parts[2])
      : null;

  const today = todayUtcNoon();
  const todayHijri = hijriFromGregorian(today);

  let content = null;
  if (birthDate && birthDate <= today) {
    const birthHijri = hijriFromGregorian(birthDate);
    const hijriAge = ageBetween(birthHijri, todayHijri);
    const gregAge = ageBetween(
      { year: birthDate.getUTCFullYear(), month: birthDate.getUTCMonth() + 1, day: birthDate.getUTCDate() },
      { year: today.getUTCFullYear(), month: today.getUTCMonth() + 1, day: today.getUTCDate() },
    );

    const nextBirthdayYear =
      todayHijri.month > birthHijri.month ||
      (todayHijri.month === birthHijri.month && todayHijri.day >= birthHijri.day)
        ? todayHijri.year + 1
        : todayHijri.year;
    // Day 30 birthdays fall back to 29 in short months.
    const nextBirthday =
      hijriToGregorian({ year: nextBirthdayYear, month: birthHijri.month, day: birthHijri.day }) ??
      hijriToGregorian({ year: nextBirthdayYear, month: birthHijri.month, day: 29 });
    const daysUntil = nextBirthday
      ? Math.round((nextBirthday.getTime() - today.getTime()) / 86400000)
      : null;

    content = (
      <>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={`${cardCls} p-6 text-center`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}>{t.hijriAge}</p>
            <p className={`mt-2 font-display text-5xl ${brandCls}`}>{hijriAge}</p>
            <p className={`mt-2 text-sm ${mutedCls}`}>
              {t.born} {formatHijri(birthHijri, locale)}
            </p>
            {locale !== "ar" ? (
              <p lang="ar" dir="rtl" className={`mt-1 font-arabic text-lg ${goldCls}`}>
                {formatHijri(birthHijri, "ar")}
              </p>
            ) : null}
          </div>
          <div className={`${cardCls} p-6 text-center`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}>{t.gregAge}</p>
            <p className="mt-2 font-display text-5xl">{gregAge}</p>
            <p className={`mt-2 text-sm ${mutedCls}`}>
              {t.born} {formatGregorian(birthDate, locale)}
            </p>
            <p className={`mt-1 text-xs ${mutedCls}`}>{t.shorterYear}</p>
          </div>
        </div>

        {nextBirthday && daysUntil !== null ? (
          <div className="mt-4 rounded-2xl bg-emerald-700 p-5 text-white dark:bg-emerald-400 dark:text-emerald-950">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
              {t.nextBirthday}
            </p>
            <p className="mt-1 font-display text-2xl">
              {daysUntil === 0
                ? t.todayBirthday
                : t.inDays(formatGregorian(nextBirthday, locale), daysUntil)}
            </p>
          </div>
        ) : null}

        <ul className={`mt-4 divide-y divide-zinc-200 rounded-2xl border ${lineCls} bg-white dark:divide-zinc-800 dark:bg-zinc-900/60`}>
          {MILESTONE_AGES.map((age, i) => {
            const reached = hijriAge >= age;
            return (
              <li key={age} className="flex items-center gap-4 px-5 py-4">
                <Icon
                  icon={reached ? "ph:check-circle-fill" : "ph:circle-dashed"}
                  className={`size-5 shrink-0 ${reached ? "text-emerald-700 dark:text-emerald-400" : mutedCls}`}
                />
                <div>
                  <p className="text-sm font-semibold">{t.hijriYears(age)}</p>
                  <p className={`text-sm ${mutedCls}`}>{t.milestones[i]}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  return (
    <ToolShell icon="ph:hourglass-medium" title={t.title} side={t.side} intro={t.intro}>
      <div className={`${cardCls} p-5`}>
        <Field label={t.dob}>
          <input type="date" className={inputCls} value={birth} onChange={(e) => setBirth(e.target.value)} />
        </Field>
      </div>
      <div className="mt-6">
        {content ?? <p className={`text-sm ${mutedCls}`}>{t.prompt}</p>}
      </div>
    </ToolShell>
  );
}
