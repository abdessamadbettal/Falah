"use client";

import { Icon } from "@iconify/react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { CitySearch, type Place, detectIpPlace, reverseGeocode } from "@/components/city-search";
import { Faq } from "@/components/faq";
import { useDict, useLocale } from "@/components/locale";
import {
  brandCls,
  btnPrimary,
  cardCls,
  Field,
  goldCls,
  lineCls,
  mutedCls,
  Select,
  ToolShell,
  useMounted,
} from "@/components/ui";
import {
  dayTimes,
  METHOD_KEYS,
  type MethodKey,
  methodForCountry,
  PRAYER_AR,
  PRAYER_ORDER,
  type PrayerKey,
} from "@/lib/prayer-calc";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import {
  clearSavedPlace,
  getSavedPlaceServerSnapshot,
  getSavedPlaceSnapshot,
  loadSavedPlace,
  savePlace,
  subscribeSavedPlace,
  type SavedPrayerPlace,
} from "@/lib/prayer-location";

/** Shown until the visitor's own location resolves. */
const FALLBACK: Place = { name: "Makkah", country: "Saudi Arabia", code: "SA", lat: 21.42, lng: 39.83 };

const PRAYER_ICON: Record<string, string> = {
  fajr: "ph:cloud-moon",
  sunrise: "ph:sun-horizon",
  dhuhr: "ph:sun",
  asr: "ph:sun-dim",
  maghrib: "ph:sun-horizon",
  isha: "ph:moon-stars",
};

function fmtTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const GEO_OPTS: PositionOptions = { timeout: 10000, enableHighAccuracy: true };

export default function PrayerTimesClient({ children }: { children?: React.ReactNode }) {
  const d = useDict();
  const locale = useLocale();
  const t = d.tools.prayer;
  const mounted = useMounted();
  const reduce = useReducedMotion();

  const [detecting, setDetecting] = useState(true);
  const [locating, setLocating] = useState(false);
  const [precise, setPrecise] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  // The persisted place, served from storage via an external store so the
  // prerendered HTML always matches (the server snapshot is null) — the saved
  // value lands after hydration without a manual restore effect.
  const persisted = useSyncExternalStore(
    subscribeSavedPlace,
    getSavedPlaceSnapshot,
    getSavedPlaceServerSnapshot,
  );
  // The place chosen this session (pick / GPS / IP prefill). Takes precedence
  // over `persisted` so an explicit action always stands, even if saving fails.
  const [choice, setChoice] = useState<{ place: Place; method: MethodKey } | null>(null);
  // Load-time saved place. During the hydration pass `persisted` is still the
  // null server snapshot, so this is what blocks GPS/IP on the first commit.
  const [restored, setRestored] = useState<SavedPrayerPlace | null>(() =>
    typeof window === "undefined" ? null : loadSavedPlace(),
  );
  // Synced in an effect so the prerendered HTML always matches (navigator is
  // undefined on the server), then kept live via online/offline events.
  const [onLine, setOnLine] = useState(true);
  // Bumped by "Clear" to re-run the silent GPS + IP detection.
  const [detectRun, setDetectRun] = useState(0);
  // Once the user picks a city or shares GPS, stop the IP guess from
  // overriding it (this ref is read inside async callbacks).
  const touched = useRef(false);

  // The active place + method. A fresh choice wins over the persisted place,
  // which in turn wins over the Makkah fallback.
  const place = choice?.place ?? persisted?.place ?? FALLBACK;
  const method = choice?.method ?? persisted?.method ?? methodForCountry(FALLBACK.code);
  // Latest method, readable inside async callbacks without a stale closure.
  const methodRef = useRef(method);
  useEffect(() => {
    methodRef.current = method;
  }, [method]);

  function pick(p: Place) {
    touched.current = true;
    setPrecise(false);
    const m = methodForCountry(p.code);
    setChoice({ place: p, method: m });
    savePlace(p, m);
  }

  // Adopt an exact GPS fix. Shared by the on-load attempt and the button:
  // show the coordinates immediately, then resolve them to a real city name
  // (and its calculation method) in the background.
  const applyPosition = useCallback(
    (pos: GeolocationPosition) => {
      // A manual pick won the race — let it stand, never overwrite it.
      if (touched.current) return;
      const { latitude, longitude } = pos.coords;
      touched.current = true;
      setChoice({
        place: { name: d.common.myLocation, country: "", lat: latitude, lng: longitude },
        method: methodRef.current,
      });
      setPrecise(true);
      setLocating(false);
      reverseGeocode(latitude, longitude, locale, d.common.myLocation).then((p) => {
        const m = p.code ? methodForCountry(p.code) : methodRef.current;
        setChoice({ place: p, method: m });
        savePlace(p, m);
      });
    },
    [d, locale],
  );

  /** The "Use my location" button: request precise coordinates, showing the
   * spinner and surfacing a denial as an inline note. */
  function locate() {
    if (!navigator.geolocation) {
      setGeoError(d.common.geoUnavailable);
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      applyPosition,
      () => {
        setGeoError(d.common.geoDenied);
        setLocating(false);
      },
      GEO_OPTS,
    );
  }

  /** Forget the saved place and start detection over — silent GPS first, then
   * the IP prefill — so the visitor can re-establish their location. */
  function clearSaved() {
    clearSavedPlace();
    setRestored(null);
    setChoice(null);
    touched.current = false;
    setPrecise(false);
    setGeoError(null);
    setDetecting(true);
    setDetectRun((n) => n + 1);
  }

  // Tick the countdown once a second.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Keep the offline state live so the location card and detection flow
  // respond when the connection drops or returns.
  useEffect(() => {
    const goOnline = () => setOnLine(true);
    const goOffline = () => setOnLine(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Prefer the visitor's exact location, requested silently on open. A denial
  // here is expected and stays quiet; the IP guess below keeps the page useful.
  // Skipped entirely when a saved place is active (persisted or restored).
  useEffect(() => {
    if (restored || persisted || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(applyPosition, () => {}, GEO_OPTS);
  }, [applyPosition, restored, persisted, detectRun]);

  // Approximate the visitor's city by IP as an immediate, permission-free
  // default — skipped when a saved place is active or the visitor is offline
  // (fails fast to the saved place, or Makkah when nothing is saved).
  useEffect(() => {
    if (restored || persisted || !onLine) return;
    let cancelled = false;
    detectIpPlace().then((p) => {
      if (cancelled) return;
      if (p && !touched.current) {
        setChoice({ place: p, method: methodForCountry(p.code) });
      }
      setDetecting(false);
    });
    return () => {
      cancelled = true;
    };
  }, [restored, persisted, onLine, detectRun]);

  // Today's times plus the surrounding prayers (yesterday's Isha → tomorrow's
  // Fajr) so the countdown works across midnight.
  const data = useMemo(() => {
    if (!mounted) return null;
    const at = new Date();
    const shift = (days: number) =>
      new Date(at.getFullYear(), at.getMonth(), at.getDate() + days);
    const today = dayTimes(place, shift(0), method);
    const py = dayTimes(place, shift(-1), method);
    const tn = dayTimes(place, shift(1), method);
    const around: { key: PrayerKey; time: Date }[] = [
      { key: "isha", time: py.isha },
      { key: "fajr", time: today.fajr },
      { key: "dhuhr", time: today.dhuhr },
      { key: "asr", time: today.asr },
      { key: "maghrib", time: today.maghrib },
      { key: "isha", time: today.isha },
      { key: "fajr", time: tn.fajr },
    ];
    // Above the polar circles a prayer can have no astronomical time at all;
    // dropping those keeps the countdown from landing on an Invalid Date.
    const seq = around.filter((p) => !Number.isNaN(p.time.getTime()));
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
    <ToolShell icon="ph:mosque" title={t.title} side={t.side} intro={t.intro} wide>
      <JsonLd data={faqJsonLd(t.faq)} />

      {/* city search + method */}
      <div className={`${cardCls} p-5`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.city}>
            <CitySearch onPick={pick} />
          </Field>
          <Field label={t.calcMethod}>
            <Select
              value={method}
              onChange={(e) => {
                const next = e.target.value as MethodKey;
                touched.current = true;
                setChoice({ place, method: next });
                savePlace(place, next);
              }}
            >
              {METHOD_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t.methods[key]}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          {!precise ? (
            <button
              type="button"
              onClick={locate}
              disabled={locating}
              className={btnPrimary}
            >
              <Icon
                icon={locating ? "ph:circle-notch" : "ph:crosshair"}
                className={`size-4 ${locating ? "animate-spin" : ""}`}
              />
              {locating ? d.common.locating : d.common.useMyLocation}
            </button>
          ) : null}
          {persisted ? (
            <p className="flex flex-wrap items-center gap-2 text-xs">
              {!onLine ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                  <Icon icon="ph:wifi-x" className="size-3.5" />
                  {d.common.offline}
                </span>
              ) : (
                <Icon icon="ph:shield-check" className={`size-3.5 ${brandCls}`} />
              )}
              <span className={mutedCls}>{d.common.savedLocation}</span>
              <span aria-hidden="true" className={mutedCls}>
                ·
              </span>
              <button
                type="button"
                onClick={clearSaved}
                className="font-semibold text-emerald-700 underline underline-offset-2 transition-colors hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                {d.common.clear}
              </button>
            </p>
          ) : !onLine ? (
            <p className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
              <Icon icon="ph:wifi-x" className="size-3.5" />
              {d.common.offlineNote}
            </p>
          ) : (
            <p className={`flex items-center gap-2 text-xs ${mutedCls}`}>
              {detecting || locating ? (
                <Icon icon="ph:circle-notch" className="size-3.5 animate-spin" />
              ) : (
                <Icon icon="ph:shield-check" className={`size-3.5 ${brandCls}`} />
              )}
              {detecting || locating ? t.detecting : t.autoNote}
            </p>
          )}
        </div>
        {geoError ? (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">{geoError}</p>
        ) : null}
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
                  {t.prayerNames[live.nextKey]}
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

      {children}

      <Faq eyebrow={t.faqEyebrow} heading={t.faqH2} items={t.faq} />
    </ToolShell>
  );
}
