"use client";

import { Icon } from "@iconify/react";
import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import { useEffect, useMemo, useState } from "react";
import {
  Field,
  ToolShell,
  btnPrimary,
  cardCls,
  inputCls,
  lineCls,
  mutedCls,
} from "@/components/ui";

const METHODS: Record<string, { label: string; params: () => ReturnType<typeof CalculationMethod.MuslimWorldLeague> }> = {
  MuslimWorldLeague: { label: "Muslim World League", params: CalculationMethod.MuslimWorldLeague },
  UmmAlQura: { label: "Umm al-Qura (Makkah)", params: CalculationMethod.UmmAlQura },
  Egyptian: { label: "Egyptian General Authority", params: CalculationMethod.Egyptian },
  Karachi: { label: "University of Karachi", params: CalculationMethod.Karachi },
  NorthAmerica: { label: "ISNA (North America)", params: CalculationMethod.NorthAmerica },
  MoonsightingCommittee: { label: "Moonsighting Committee", params: CalculationMethod.MoonsightingCommittee },
  Dubai: { label: "Dubai", params: CalculationMethod.Dubai },
  Kuwait: { label: "Kuwait", params: CalculationMethod.Kuwait },
  Qatar: { label: "Qatar", params: CalculationMethod.Qatar },
  Singapore: { label: "Singapore", params: CalculationMethod.Singapore },
  Turkey: { label: "Turkey (Diyanet)", params: CalculationMethod.Turkey },
};

const PRAYER_LABELS: [key: string, label: string, arabic: string][] = [
  ["fajr", "Fajr", "الفجر"],
  ["sunrise", "Sunrise", "الشروق"],
  ["dhuhr", "Dhuhr", "الظهر"],
  ["asr", "Asr", "العصر"],
  ["maghrib", "Maghrib", "المغرب"],
  ["isha", "Isha", "العشاء"],
];

function fmtTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s % 60).padStart(2, "0")}s`;
}

export default function PrayerTimesPage() {
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
      setGeoError("Geolocation is not available in this browser. Enter coordinates below.");
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
        setGeoError("Location was denied. Enter coordinates manually — they stay on this device.");
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
    const params = METHODS[method].params();
    const today = new PrayerTimes(coords, new Date(), params);
    const next = today.nextPrayer();
    if (next !== "none") {
      return { times: today, nextName: next, nextTime: today.timeForPrayer(next)! };
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const t = new PrayerTimes(coords, tomorrow, params);
    return { times: today, nextName: "fajr", nextTime: t.fajr };
  }, [valid, latNum, lngNum, method]);

  return (
    <ToolShell
      icon="ph:mosque"
      title="Prayer Times"
      arabic="مواقيت الصلاة"
      intro="Today's prayer times for any point on Earth, computed on your device with the adhan astronomical library. Your coordinates never leave the browser."
    >
      <div className={`${cardCls} p-5`}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Latitude">
            <input className={inputCls} inputMode="decimal" placeholder="e.g. 33.5731" value={lat} onChange={(e) => setLat(e.target.value)} />
          </Field>
          <Field label="Longitude">
            <input className={inputCls} inputMode="decimal" placeholder="e.g. -7.5898" value={lng} onChange={(e) => setLng(e.target.value)} />
          </Field>
          <Field label="Calculation method">
            <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)}>
              {Object.entries(METHODS).map(([key, m]) => (
                <option key={key} value={key}>{m.label}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={locate} disabled={locating} className={btnPrimary}>
            <Icon icon="ph:crosshair" className="size-4" />
            {locating ? "Locating…" : "Use my location"}
          </button>
          {geoError ? <p className="text-sm text-red-600 dark:text-red-400">{geoError}</p> : null}
        </div>
      </div>

      {result ? (
        <>
          <div className="mt-6 rounded-2xl bg-emerald-700 p-5 text-white dark:bg-emerald-400 dark:text-emerald-950">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">Next prayer</p>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-3xl capitalize">{result.nextName}</p>
              <p className="font-mono text-lg">
                {fmtTime(result.nextTime)} · in {fmtCountdown(result.nextTime.getTime() - now)}
              </p>
            </div>
          </div>
          <ul className={`mt-6 divide-y divide-zinc-200 rounded-2xl border ${lineCls} bg-white dark:divide-zinc-800 dark:bg-zinc-900/60`}>
            {PRAYER_LABELS.map(([key, label, arabic]) => {
              const time = result.times[key as "fajr"] as Date;
              const isNext = key === result.nextName;
              return (
                <li key={key} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <span className="flex items-center gap-3">
                    {isNext ? <Icon icon="ph:caret-right-fill" className="size-3.5 text-emerald-700 dark:text-emerald-400" /> : <span className="size-3.5" />}
                    <span className={`font-semibold ${isNext ? "text-emerald-700 dark:text-emerald-400" : ""}`}>{label}</span>
                    <span lang="ar" dir="rtl" className={`font-arabic ${mutedCls}`}>{arabic}</span>
                  </span>
                  <span className={`font-mono text-sm ${isNext ? "text-emerald-700 dark:text-emerald-400" : ""}`}>{fmtTime(time)}</span>
                </li>
              );
            })}
          </ul>
          <p className={`mt-4 text-xs ${mutedCls}`}>
            Times are for today in your device&rsquo;s timezone. Sunrise marks the end of Fajr, not a prayer.
          </p>
        </>
      ) : (
        <p className={`mt-6 text-sm ${mutedCls}`}>
          Share your location or enter coordinates to see today&rsquo;s times.
        </p>
      )}
    </ToolShell>
  );
}
