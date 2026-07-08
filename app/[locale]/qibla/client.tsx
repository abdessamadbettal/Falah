"use client";

import { Icon } from "@iconify/react";
import { Coordinates, Qibla } from "adhan";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CitySearch, type Place, detectIpPlace } from "@/components/city-search";
import { Faq } from "@/components/faq";
import { useDict } from "@/components/locale";
import {
  Eyebrow,
  Field,
  Star8,
  ToolShell,
  brandCls,
  btnGhost,
  btnPrimary,
  cardCls,
  goldCls,
  lineCls,
  mutedCls,
} from "@/components/ui";
import { JsonLd, faqJsonLd } from "@/lib/seo";

const KAABA = { lat: 21.422487, lng: 39.826206 };

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type OrientationEventWithWebkit = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

type Spot = { lat: number; lng: number; label: string };

export default function QiblaClient() {
  const d = useDict();
  const t = d.tools.qibla;
  const reduce = useReducedMotion();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [compassState, setCompassState] = useState<"idle" | "on" | "unavailable">("idle");
  const listening = useRef(false);
  const touched = useRef(false);

  // Seed a default from the visitor's IP so the Qibla shows immediately.
  useEffect(() => {
    let cancelled = false;
    detectIpPlace().then((p) => {
      if (cancelled || touched.current || !p) return;
      setSpot({ lat: p.lat, lng: p.lng, label: [p.name, p.country].filter(Boolean).join(", ") });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const bearing = spot ? Qibla(new Coordinates(spot.lat, spot.lng)) : null;
  const distance = spot ? distanceKm(spot.lat, spot.lng, KAABA.lat, KAABA.lng) : null;

  function pick(p: Place) {
    touched.current = true;
    setSpot({ lat: p.lat, lng: p.lng, label: [p.name, p.country].filter(Boolean).join(", ") });
  }

  function locate() {
    if (!navigator.geolocation) {
      setGeoError(d.common.geoUnavailable);
      return;
    }
    touched.current = true;
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSpot({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: t.yourLocation });
        setLocating(false);
      },
      () => {
        setGeoError(d.common.geoDenied);
        setLocating(false);
      },
      { timeout: 10000 },
    );
  }

  function onOrientation(e: Event) {
    const ev = e as OrientationEventWithWebkit;
    if (typeof ev.webkitCompassHeading === "number") {
      setHeading(ev.webkitCompassHeading);
    } else if (ev.absolute && ev.alpha !== null) {
      setHeading((360 - ev.alpha) % 360);
    }
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientation", onOrientation, true);
      window.removeEventListener("deviceorientationabsolute", onOrientation, true);
    };
  }, []);

  async function enableCompass() {
    type RequestPermissionFn = () => Promise<"granted" | "denied">;
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: RequestPermissionFn };
    try {
      if (typeof DOE.requestPermission === "function") {
        const res = await DOE.requestPermission();
        if (res !== "granted") {
          setCompassState("unavailable");
          return;
        }
      }
      if (!listening.current) {
        window.addEventListener("deviceorientationabsolute", onOrientation, true);
        window.addEventListener("deviceorientation", onOrientation, true);
        listening.current = true;
      }
      setCompassState("on");
    } catch {
      setCompassState("unavailable");
    }
  }

  const needleRotation =
    bearing === null ? 0 : heading === null ? bearing : bearing - heading;

  return (
    <ToolShell icon="ph:compass" title={t.title} side={t.side} intro={t.intro}>
      <JsonLd data={faqJsonLd(t.faq)} />

      <div className={`${cardCls} p-5`}>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <Field label={t.yourLocation}>
            <CitySearch onPick={pick} />
          </Field>
          <button type="button" onClick={locate} disabled={locating} className={btnPrimary}>
            <Icon icon="ph:crosshair" className="size-4" />
            {locating ? d.common.locating : d.common.useMyLocation}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {spot ? (
            <button type="button" onClick={enableCompass} className={btnGhost}>
              <Icon icon="ph:compass-rose" className="size-4" />
              {compassState === "on" ? t.compassActive : t.enableCompass}
            </button>
          ) : null}
          {geoError ? <p className="text-sm text-red-600 dark:text-red-400">{geoError}</p> : null}
          {compassState === "unavailable" ? (
            <p className={`text-sm ${mutedCls}`}>{t.noCompass}</p>
          ) : null}
        </div>
      </div>

      {bearing !== null && spot ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`mt-6 ${cardCls} flex flex-col items-center p-8`}
        >
          <p className={`mb-6 flex items-center gap-2 text-sm ${mutedCls}`}>
            <Icon icon="ph:map-pin" className={`size-4 ${brandCls}`} />
            {spot.label}
          </p>
          <div className="relative size-64" dir="ltr">
            <div className="absolute inset-0 rounded-full border-2 border-zinc-200 dark:border-zinc-800" />
            <div className="absolute inset-4 rounded-full border border-dashed border-zinc-200 dark:border-zinc-800" />
            {["N", "E", "S", "W"].map((c, i) => (
              <span
                key={c}
                className={`absolute text-xs font-semibold ${c === "N" ? brandCls : mutedCls}`}
                style={{
                  top: i === 0 ? "6px" : i === 2 ? "auto" : "50%",
                  bottom: i === 2 ? "6px" : "auto",
                  left: i === 3 ? "10px" : i === 1 ? "auto" : "50%",
                  right: i === 1 ? "10px" : "auto",
                  transform: i % 2 === 0 ? "translateX(-50%)" : "translateY(-50%)",
                }}
              >
                {c}
              </span>
            ))}
            {/* the pointer to the Qibla, with the Kaaba riding its tip */}
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              <div className="absolute left-1/2 top-3 flex -translate-x-1/2 flex-col items-center">
                <span className="grid size-8 place-items-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                  <Icon icon="mdi:kaaba" className="size-5" />
                </span>
                <Icon icon="ph:triangle-fill" className="mt-0.5 size-3 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="absolute left-1/2 top-16 h-[calc(50%-4rem)] w-0.5 -translate-x-1/2 bg-linear-to-b from-emerald-700/60 to-transparent dark:from-emerald-400/60" />
            </div>
            <Star8 className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-300" />
          </div>
          <p className="mt-6 font-display text-4xl tabular-nums">
            {Math.round(bearing)}°{" "}
            <span className={`text-lg ${mutedCls}`}>
              {heading !== null ? t.toQibla : t.fromNorth}
            </span>
          </p>
          <p className={`mt-2 text-center text-sm ${mutedCls}`}>
            {heading !== null ? t.needleLive : t.faceNorth}{" "}
            {t.distance(Math.round(distance!).toLocaleString())}
          </p>
        </motion.div>
      ) : (
        <p className={`mt-6 text-sm ${mutedCls}`}>{t.prompt}</p>
      )}

      {/* step-by-step guide */}
      <section className="mt-14">
        <Eyebrow>{t.guideEyebrow}</Eyebrow>
        <h2 className="mt-5 font-display text-2xl sm:text-3xl">{t.guideH2}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {t.guide.map((step, i) => (
            <motion.div
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.07 }}
              className={`flex gap-4 ${cardCls} p-5`}
            >
              <span className="flex h-12 w-10 shrink-0 items-end justify-center rounded-t-full rounded-b-lg bg-emerald-50 pb-2 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Icon icon={step.icon} className="size-5" />
              </span>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono text-xs ${goldCls}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-semibold">{step.title}</h3>
                </div>
                <p className={`mt-1.5 text-sm leading-relaxed ${mutedCls}`}>{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Faq eyebrow={t.faqEyebrow} heading={t.faqH2} items={t.faq} />
    </ToolShell>
  );
}
