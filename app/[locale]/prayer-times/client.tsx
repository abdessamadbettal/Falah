"use client";

import { Icon } from "@iconify/react";
import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CitySearch, type Place, detectIpPlace } from "@/components/city-search";
import { Faq } from "@/components/faq";
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
  useMounted,
} from "@/components/ui";
import { JsonLd, faqJsonLd } from "@/lib/seo";

const METHOD_FNS: Record<string, () => ReturnType<typeof CalculationMethod.MuslimWorldLeague>> = {
  MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
  UmmAlQura: CalculationMethod.UmmAlQura,
  Egyptian: CalculationMethod.Egyptian,
  Karachi: CalculationMethod.Karachi,
  NorthAmerica: CalculationMethod.NorthAmerica,
  MoonsightingCommittee: CalculationMethod.MoonsightingCommittee,
  Dubai: CalculationMethod.Dubai,
  Kuwait: CalculationMethod.Kuwait,
  Qatar: CalculationMethod.Qatar,
  Singapore: CalculationMethod.Singapore,
  Turkey: CalculationMethod.Turkey,
};

/** The calculation method most commonly followed in each country. */
const METHOD_BY_COUNTRY: Record<string, string> = {
  SA: "UmmAlQura", AE: "Dubai", QA: "Qatar", KW: "Kuwait", EG: "Egyptian",
  TR: "Turkey", PK: "Karachi", IN: "Karachi", BD: "Karachi", AF: "Karachi",
  US: "NorthAmerica", CA: "NorthAmerica", MY: "Singapore", SG: "Singapore",
  BN: "Singapore",
};
const methodForCountry = (code?: string) =>
  METHOD_BY_COUNTRY[(code ?? "").toUpperCase()] ?? "MuslimWorldLeague";

/** Shown until the visitor's own location resolves. */
const FALLBACK: Place = { name: "Makkah", country: "Saudi Arabia", code: "SA", lat: 21.42, lng: 39.83 };

const PRAYER_ORDER = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;
const PRAYER_ICON: Record<string, string> = {
  fajr: "ph:cloud-moon",
  sunrise: "ph:sun-horizon",
  dhuhr: "ph:sun",
  asr: "ph:sun-dim",
  maghrib: "ph:sun-horizon",
  isha: "ph:moon-stars",
};
const PRAYER_AR: Record<string, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

function fmtTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function PrayerTimesClient() {
  const d = useDict();
  const locale = useLocale();
  const t = d.tools.prayer;
  const mounted = useMounted();
  const reduce = useReducedMotion();

  const [place, setPlace] = useState<Place>(FALLBACK);
  const [method, setMethod] = useState(() => methodForCountry(FALLBACK.code));
  const [detecting, setDetecting] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const touched = useRef(false);

  function pick(p: Place) {
    touched.current = true;
    setPlace(p);
    setMethod(methodForCountry(p.code));
  }

  // Tick the countdown once a second.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Detect the visitor's city by IP once and default to it.
  useEffect(() => {
    let cancelled = false;
    detectIpPlace().then((p) => {
      if (cancelled) return;
      if (p && !touched.current) {
        setPlace(p);
        setMethod(methodForCountry(p.code));
      }
      setDetecting(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Today's times plus the surrounding prayers (yesterday's Isha → tomorrow's
  // Fajr) so the countdown works across midnight.
  const data = useMemo(() => {
    if (!mounted) return null;
    const coords = new Coordinates(place.lat, place.lng);
    const params = (METHOD_FNS[method] ?? METHOD_FNS.MuslimWorldLeague)();
    const today = new PrayerTimes(coords, new Date(), params);
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const tm = new Date();
    tm.setDate(tm.getDate() + 1);
    const py = new PrayerTimes(coords, y, params);
    const tn = new PrayerTimes(coords, tm, params);
    const seq = [
      { key: "isha", time: py.isha },
      { key: "fajr", time: today.fajr },
      { key: "dhuhr", time: today.dhuhr },
      { key: "asr", time: today.asr },
      { key: "maghrib", time: today.maghrib },
      { key: "isha", time: today.isha },
      { key: "fajr", time: tn.fajr },
    ];
    return { today, seq };
  }, [mounted, place, method]);

  // Where "now" sits between the previous and next prayer — drives the ring.
  const live = useMemo(() => {
    if (!data) return null;
    const { seq } = data;
    let prev = seq[0];
    let next = seq[1];
    for (let i = 0; i < seq.length - 1; i++) {
      if (now >= seq[i].time.getTime() && now < seq[i + 1].time.getTime()) {
        prev = seq[i];
        next = seq[i + 1];
        break;
      }
    }
    const span = next.time.getTime() - prev.time.getTime();
    const progress = span > 0 ? (now - prev.time.getTime()) / span : 0;
    return {
      nextKey: next.key,
      nextTime: next.time,
      progress: Math.min(1, Math.max(0, progress)),
    };
  }, [data, now]);

  const remainMs = live ? Math.max(0, live.nextTime.getTime() - now) : 0;
  const rs = Math.floor(remainMs / 1000);
  const rh = Math.floor(rs / 3600);
  const rm = Math.floor((rs % 3600) / 60);
  const rSec = rs % 60;

  const R = 52;
  const CIRC = 2 * Math.PI * R;

  return (
    <ToolShell icon="ph:mosque" title={t.title} side={t.side} intro={t.intro}>
      <JsonLd data={faqJsonLd(t.faq)} />

      {/* city search + method */}
      <div className={`${cardCls} p-5`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.city}>
            <CitySearch onPick={pick} />
          </Field>
          <Field label={t.calcMethod}>
            <select
              className={inputCls}
              value={method}
              onChange={(e) => {
                touched.current = true;
                setMethod(e.target.value);
              }}
            >
              {Object.keys(METHOD_FNS).map((key) => (
                <option key={key} value={key}>
                  {t.methods[key as keyof typeof t.methods]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <p className={`mt-4 flex items-center gap-2 text-xs ${mutedCls}`}>
          {detecting ? (
            <Icon icon="ph:circle-notch" className="size-3.5 animate-spin" />
          ) : (
            <Icon icon="ph:shield-check" className={`size-3.5 ${brandCls}`} />
          )}
          {detecting ? t.detecting : t.autoNote}
        </p>
      </div>

      {/* selected location heading — good for “prayer times in <city>” search */}
      <h2 className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-2xl">
        <Icon icon="ph:map-pin" className={`size-5 ${brandCls}`} />
        {place.name}
        {place.country ? (
          <span className={`text-lg font-normal ${mutedCls}`}>
            · {place.country}
          </span>
        ) : null}
      </h2>

      {data && live ? (
        <>
          {/* next prayer — animated ring + live countdown */}
          <div className="relative mt-5 overflow-hidden rounded-2xl bg-emerald-700 p-6 text-white dark:bg-emerald-400 dark:text-emerald-950">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                  {t.nextPrayer}
                </p>
                <p className="mt-1 font-display text-4xl">
                  {t.prayerNames[live.nextKey as keyof typeof t.prayerNames]}
                </p>
                {locale !== "ar" ? (
                  <p lang="ar" dir="rtl" className="mt-1 font-arabic text-xl opacity-80">
                    {PRAYER_AR[live.nextKey]}
                  </p>
                ) : null}
                <p className="mt-3 font-mono text-lg" dir="ltr">
                  {fmtTime(live.nextTime)}
                </p>
              </div>

              <div className="relative grid size-32 shrink-0 place-items-center">
                <svg viewBox="0 0 120 120" className="size-32 -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r={R}
                    fill="none"
                    strokeWidth="8"
                    className="stroke-white/20"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={R}
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="stroke-white dark:stroke-emerald-950"
                    strokeDasharray={CIRC}
                    strokeDashoffset={CIRC * (1 - live.progress)}
                    style={{ transition: reduce ? undefined : "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-lg tabular-nums" dir="ltr">
                    {rh}:{String(rm).padStart(2, "0")}:{String(rSec).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider opacity-80">
                    {t.remaining}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* the five daily prayers + sunrise */}
          <motion.ul
            key={`${place.lat},${place.lng}-${method}`}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
            }}
            className={`mt-6 divide-y divide-zinc-200 overflow-hidden rounded-2xl border ${lineCls} bg-white dark:divide-zinc-800 dark:bg-zinc-900/60`}
          >
            {PRAYER_ORDER.map((key) => {
              const time = data.today[key] as Date;
              const isNext = key === live.nextKey;
              return (
                <motion.li
                  key={key}
                  variants={{
                    hidden: reduce ? { opacity: 0 } : { opacity: 0, x: -12 },
                    show: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex items-center justify-between gap-3 px-5 py-3.5 transition-colors ${
                    isNext ? "bg-emerald-50 dark:bg-emerald-500/10" : ""
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      icon={PRAYER_ICON[key]}
                      className={`size-5 ${isNext ? brandCls : mutedCls}`}
                    />
                    <span className={`font-semibold ${isNext ? brandCls : ""}`}>
                      {t.prayerNames[key]}
                    </span>
                    {locale !== "ar" ? (
                      <span
                        lang="ar"
                        dir="rtl"
                        className={`font-arabic ${isNext ? goldCls : mutedCls}`}
                      >
                        {PRAYER_AR[key]}
                      </span>
                    ) : null}
                  </span>
                  <span
                    dir="ltr"
                    className={`font-mono text-sm tabular-nums ${isNext ? brandCls : ""}`}
                  >
                    {fmtTime(time)}
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
          <p className={`mt-4 text-xs ${mutedCls}`}>{t.note}</p>
        </>
      ) : (
        /* pre-hydration skeleton — avoids a server/client time mismatch */
        <div className="mt-5 animate-pulse space-y-6" aria-hidden="true">
          <div className="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
          <div className={`h-72 rounded-2xl border ${lineCls}`} />
        </div>
      )}

      <Faq eyebrow={t.faqEyebrow} heading={t.faqH2} items={t.faq} />
    </ToolShell>
  );
}
