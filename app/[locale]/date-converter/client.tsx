"use client";

import { useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import {
  Field,
  ToolShell,
  brandCls,
  cardCls,
  goldCls,
  inputCls,
  mutedCls,
  useMounted,
} from "@/components/ui";
import {
  formatGregorian,
  formatHijri,
  hijriFromGregorian,
  hijriMonthName,
  hijriToGregorian,
  todayUtcNoon,
  utcNoon,
} from "@/lib/hijri";

export default function DateConverterClient() {
  const d = useDict();
  const t = d.tools.converter;
  const locale = useLocale();
  const mounted = useMounted();
  const today = todayUtcNoon();
  const todayHijri = hijriFromGregorian(today);

  const [gregInput, setGregInput] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  });
  const [hYear, setHYear] = useState(String(todayHijri.year));
  const [hMonth, setHMonth] = useState(todayHijri.month);
  const [hDay, setHDay] = useState(todayHijri.day);

  const gregParts = gregInput.split("-").map(Number);
  const gregDate =
    gregParts.length === 3 && gregParts.every(Number.isFinite)
      ? utcNoon(gregParts[0], gregParts[1] - 1, gregParts[2])
      : null;
  const toHijri = gregDate ? hijriFromGregorian(gregDate) : null;

  const yearNum = parseInt(hYear, 10);
  const toGregorian =
    Number.isFinite(yearNum) && yearNum > 0 && yearNum < 1600
      ? hijriToGregorian({ year: yearNum, month: hMonth, day: hDay })
      : null;

  return (
    <ToolShell icon="ph:arrows-left-right" title={t.title} side={t.side} intro={t.intro}>
      {!mounted ? (
        <p className={`text-sm ${mutedCls}`}>{t.loading}</p>
      ) : (
      <div className="grid gap-6 sm:grid-cols-2">
        <section className={`${cardCls} p-5`}>
          <h2 className="font-display text-xl">{t.g2h}</h2>
          <div className="mt-4">
            <Field label={t.gregDate}>
              <input
                type="date"
                className={inputCls}
                value={gregInput}
                onChange={(e) => setGregInput(e.target.value)}
              />
            </Field>
          </div>
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
            {toHijri ? (
              <>
                <p className={`font-semibold ${brandCls}`}>{formatHijri(toHijri, locale)}</p>
                {locale !== "ar" ? (
                  <p lang="ar" dir="rtl" className={`mt-1 font-arabic text-xl ${goldCls}`}>
                    {formatHijri(toHijri, "ar")}
                  </p>
                ) : null}
              </>
            ) : (
              <p className={`text-sm ${mutedCls}`}>{t.pick}</p>
            )}
          </div>
        </section>

        <section className={`${cardCls} p-5`}>
          <h2 className="font-display text-xl">{t.h2g}</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Field label={t.day}>
              <select className={inputCls} value={hDay} onChange={(e) => setHDay(Number(e.target.value))}>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </Field>
            <Field label={t.month}>
              <select className={inputCls} value={hMonth} onChange={(e) => setHMonth(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{hijriMonthName(m, locale)}</option>
                ))}
              </select>
            </Field>
            <Field label={t.yearAH}>
              <input
                className={inputCls}
                inputMode="numeric"
                value={hYear}
                onChange={(e) => setHYear(e.target.value)}
              />
            </Field>
          </div>
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
            {toGregorian ? (
              <p className={`font-semibold ${brandCls}`}>{formatGregorian(toGregorian, locale)}</p>
            ) : (
              <p className={`text-sm ${mutedCls}`}>{t.invalid}</p>
            )}
          </div>
        </section>
      </div>
      )}
    </ToolShell>
  );
}
