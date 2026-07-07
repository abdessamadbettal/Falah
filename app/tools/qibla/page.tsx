"use client";

import { Icon } from "@iconify/react";
import { Coordinates, Qibla } from "adhan";
import { useEffect, useRef, useState } from "react";
import {
  Field,
  Star8,
  ToolShell,
  btnGhost,
  btnPrimary,
  cardCls,
  inputCls,
  mutedCls,
} from "@/components/ui";

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

export default function QiblaPage() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [compassState, setCompassState] = useState<"idle" | "on" | "unavailable">("idle");
  const listening = useRef(false);

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const valid =
    Number.isFinite(latNum) && Number.isFinite(lngNum) &&
    Math.abs(latNum) <= 90 && Math.abs(lngNum) <= 180;

  const bearing = valid ? Qibla(new Coordinates(latNum, lngNum)) : null;
  const distance = valid ? distanceKm(latNum, lngNum, KAABA.lat, KAABA.lng) : null;

  function locate() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is unavailable. Enter coordinates below.");
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
    <ToolShell
      icon="ph:compass"
      title="Qibla Finder"
      arabic="اتجاه القبلة"
      intro="The great-circle bearing from your position to the Kaaba, computed locally. On phones with a compass, the needle turns live as you rotate."
    >
      <div className={`${cardCls} p-5`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Latitude">
            <input className={inputCls} inputMode="decimal" placeholder="e.g. 33.5731" value={lat} onChange={(e) => setLat(e.target.value)} />
          </Field>
          <Field label="Longitude">
            <input className={inputCls} inputMode="decimal" placeholder="e.g. -7.5898" value={lng} onChange={(e) => setLng(e.target.value)} />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={locate} disabled={locating} className={btnPrimary}>
            <Icon icon="ph:crosshair" className="size-4" />
            {locating ? "Locating…" : "Use my location"}
          </button>
          {valid ? (
            <button type="button" onClick={enableCompass} className={btnGhost}>
              <Icon icon="ph:compass-rose" className="size-4" />
              {compassState === "on" ? "Compass active" : "Enable live compass"}
            </button>
          ) : null}
          {geoError ? <p className="text-sm text-red-600 dark:text-red-400">{geoError}</p> : null}
          {compassState === "unavailable" ? (
            <p className={`text-sm ${mutedCls}`}>No compass sensor here — use the bearing from true north instead.</p>
          ) : null}
        </div>
      </div>

      {bearing !== null ? (
        <div className={`mt-6 ${cardCls} flex flex-col items-center p-8`}>
          <div className="relative size-64">
            <div className="absolute inset-0 rounded-full border-2 border-zinc-200 dark:border-zinc-800" />
            {["N", "E", "S", "W"].map((d, i) => (
              <span
                key={d}
                className={`absolute text-xs font-semibold ${mutedCls}`}
                style={{
                  top: i === 0 ? "6px" : i === 2 ? "auto" : "50%",
                  bottom: i === 2 ? "6px" : "auto",
                  left: i === 3 ? "10px" : i === 1 ? "auto" : "50%",
                  right: i === 1 ? "10px" : "auto",
                  transform: i % 2 === 0 ? "translateX(-50%)" : "translateY(-50%)",
                }}
              >
                {d}
              </span>
            ))}
            <div
              className="absolute inset-0 transition-transform duration-300"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              <div className="absolute left-1/2 top-6 -translate-x-1/2">
                <Icon icon="ph:navigation-arrow-fill" className="size-8 rotate-45 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="absolute left-1/2 top-16 h-[calc(50%-4rem)] w-0.5 -translate-x-1/2 bg-emerald-700/50 dark:bg-emerald-400/50" />
            </div>
            <Star8 className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-300" />
          </div>
          <p className="mt-6 font-display text-3xl">
            {Math.round(bearing)}°{" "}
            <span className={`text-lg ${mutedCls}`}>from true north</span>
          </p>
          <p className={`mt-2 text-sm ${mutedCls}`}>
            {heading !== null
              ? "Needle is live — it points at the Qibla as you turn."
              : "Face true north, then turn by the angle shown."}
            {" "}Distance to the Kaaba: {Math.round(distance!).toLocaleString()} km.
          </p>
        </div>
      ) : (
        <p className={`mt-6 text-sm ${mutedCls}`}>
          Share your location or enter coordinates to find the Qibla.
        </p>
      )}
    </ToolShell>
  );
}
