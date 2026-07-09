"use client";

import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import { useState } from "react";
import { Faq } from "@/components/faq";
import { useDict, useLocale } from "@/components/locale";
import {
  brandCls,
  cardCls,
  Field,
  goldCls,
  Input,
  lineCls,
  mutedCls,
  Select,
  ToolShell,
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
import { JsonLd, faqJsonLd } from "@/lib/seo";

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
      <JsonLd data={faqJsonLd(t.faq)} />
      {!mounted ? (
        <p className={`text-sm ${mutedCls}`}>{t.loading}</p>
      ) : (
      <div className="relative grid gap-6 sm:grid-cols-2">
        {/* a quiet swap glyph bridging the two directions */}
        <span
          aria-hidden="true"
          className={`absolute left-1/2 top-1/2 z-10 hidden size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-white ${lineCls} ${brandCls} sm:grid dark:bg-zinc-950`}
        >
          <Icon icon="ph:arrows-left-right" className="size-4" />
        </span>
        <section className={`${cardCls} p-5`}>
          <h2 className="font-display text-xl">{t.g2h}</h2>
          <div className="mt-4">
            <Field label={t.gregDate}>
              <Input
                type="date"
                value={gregInput}
                onChange={(e) => setGregInput(e.target.value)}
              />
            </Field>
          </div>
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
            {toHijri ? (
              <motion.div
                key={formatHijri(toHijri, locale)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className={`font-semibold ${brandCls}`}>{formatHijri(toHijri, locale)}</p>
                {locale !== "ar" ? (
                  <p lang="ar" dir="rtl" className={`mt-1 font-arabic text-xl ${goldCls}`}>
                    {formatHijri(toHijri, "ar")}
                  </p>
                ) : null}
              </motion.div>
            ) : (
              <p className={`text-sm ${mutedCls}`}>{t.pick}</p>
            )}
          </div>
        </section>

        <section className={`${cardCls} p-5`}>
          <h2 className="font-display text-xl">{t.h2g}</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Field label={t.day}>
              <Select value={hDay} onChange={(e) => setHDay(Number(e.target.value))}>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Select>
            </Field>
            <Field label={t.month}>
              <Select value={hMonth} onChange={(e) => setHMonth(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{hijriMonthName(m, locale)}</option>
                ))}
              </Select>
            </Field>
            <Field label={t.yearAH}>
              <Input
                inputMode="numeric"
                value={hYear}
                onChange={(e) => setHYear(e.target.value)}
              />
            </Field>
          </div>
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
            {toGregorian ? (
              <motion.p
                key={formatGregorian(toGregorian, locale)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`font-semibold ${brandCls}`}
              >
                {formatGregorian(toGregorian, locale)}
              </motion.p>
            ) : (
              <p className={`text-sm ${mutedCls}`}>{t.invalid}</p>
            )}
          </div>
        </section>
      </div>
      )}
      <Faq eyebrow={t.faqEyebrow} heading={t.faqH2} items={t.faq} />
    </ToolShell>
  );
}
