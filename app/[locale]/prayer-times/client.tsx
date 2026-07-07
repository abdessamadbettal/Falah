"use client";

import { Icon } from "@iconify/react";
import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import { useEffect, useMemo, useState } from "react";
import { useDict } from "@/components/locale";
import {
  Field,
  ToolShell,
  btnPrimary,
  cardCls,
  inputCls,
  lineCls,
  mutedCls,
} from "@/components/ui";

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

const PRAYER_ORDER = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;
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

function fmtCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s % 60).padStart(2, "0")}s`;
}

export default function PrayerTimesClient() {
  const d = useDict();
  const t = d.tools.prayer;
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [method, setMethod] = useState("MuslimWorldLeague");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  function locate() {
    if (!navigator.geolocation) {
      setGeoError(d.common.geoUnavailable);
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(5));
        setLng(pos.coords.longitude.toFixed(5));
        setLocating(false);
      },
      () => {
        setGeoError(d.common.geoDenied);
        setLocating(false);
      },
      { timeout: 10000 },
    );
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const valid =
    Number.isFinite(latNum) && Number.isFinite(lngNum) &&
    Math.abs(latNum) <= 90 && Math.abs(lngNum) <= 180;

  const result = useMemo(() => {
    if (!valid) return null;
    const coords = new Coordinates(latNum, lngNum);
    const params = METHOD_FNS[method]();
    const today = new PrayerTimes(coords, new Date(), params);
    const next = today.nextPrayer();
    if (next !== "none") {
      return { times: today, nextName: next, nextTime: today.timeForPrayer(next)! };
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tmw = new PrayerTimes(coords, tomorrow, params);
    return { times: today, nextName: "fajr", nextTime: tmw.fajr };
  }, [valid, latNum, lngNum, method]);

  return (
    <ToolShell icon="ph:mosque" title={t.title} side={t.side} intro={t.intro}>
      <div className={`${cardCls} p-5`}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={d.common.latitude}>
            <input className={inputCls} inputMode="decimal" placeholder={d.common.latPh} value={lat} onChange={(e) => setLat(e.target.value)} />
          </Field>
          <Field label={d.common.longitude}>
            <input className={inputCls} inputMode="decimal" placeholder={d.common.lngPh} value={lng} onChange={(e) => setLng(e.target.value)} />
          </Field>
          <Field label={t.calcMethod}>
            <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)}>
              {Object.keys(METHOD_FNS).map((key) => (
                <option key={key} value={key}>{t.methods[key as keyof typeof t.methods]}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={locate} disabled={locating} className={btnPrimary}>
            <Icon icon="ph:crosshair" className="size-4" />
            {locating ? d.common.locating : d.common.useMyLocation}
          </button>
          {geoError ? <p className="text-sm text-red-600 dark:text-red-400">{geoError}</p> : null}
        </div>
      </div>

      {result ? (
        <>
          <div className="mt-6 rounded-2xl bg-emerald-700 p-5 text-white dark:bg-emerald-400 dark:text-emerald-950">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{t.nextPrayer}</p>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-3xl">
                {t.prayerNames[result.nextName as keyof typeof t.prayerNames]}
              </p>
              <p className="font-mono text-lg">
                <span dir="ltr">{fmtTime(result.nextTime)}</span> · {t.inLabel}{" "}
                <span dir="ltr">{fmtCountdown(result.nextTime.getTime() - now)}</span>
              </p>
            </div>
          </div>
          <ul className={`mt-6 divide-y divide-zinc-200 rounded-2xl border ${lineCls} bg-white dark:divide-zinc-800 dark:bg-zinc-900/60`}>
            {PRAYER_ORDER.map((key) => {
              const time = result.times[key] as Date;
              const isNext = key === result.nextName;
              return (
                <li key={key} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <span className="flex items-center gap-3">
                    {isNext ? <Icon icon="ph:caret-right-fill" className="size-3.5 text-emerald-700 rtl:rotate-180 dark:text-emerald-400" /> : <span className="size-3.5" />}
                    <span className={`font-semibold ${isNext ? "text-emerald-700 dark:text-emerald-400" : ""}`}>
                      {t.prayerNames[key]}
                    </span>
                    {d.code !== "ar" ? (
                      <span lang="ar" dir="rtl" className={`font-arabic ${mutedCls}`}>{PRAYER_AR[key]}</span>
                    ) : null}
                  </span>
                  <span dir="ltr" className={`font-mono text-sm ${isNext ? "text-emerald-700 dark:text-emerald-400" : ""}`}>{fmtTime(time)}</span>
                </li>
              );
            })}
          </ul>
          <p className={`mt-4 text-xs ${mutedCls}`}>{t.note}</p>
        </>
      ) : (
        <p className={`mt-6 text-sm ${mutedCls}`}>{t.prompt}</p>
      )}
    </ToolShell>
  );
}
