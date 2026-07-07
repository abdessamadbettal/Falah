"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import {
  Field,
  ToolShell,
  btnPrimary,
  cardCls,
  inputCls,
  lineCls,
  mutedCls,
} from "@/components/ui";

type Mosque = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  osmUrl: string;
};

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MosqueFinderPage() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radius, setRadius] = useState(5);
  const [status, setStatus] = useState<"idle" | "locating" | "searching" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [mosques, setMosques] = useState<Mosque[]>([]);

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const valid =
    Number.isFinite(latNum) && Number.isFinite(lngNum) &&
    Math.abs(latNum) <= 90 && Math.abs(lngNum) <= 180;

  function locate() {
    if (!navigator.geolocation) {
      setError("Geolocation is unavailable. Enter coordinates below.");
      return;
    }
    setStatus("locating");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(5));
        setLng(pos.coords.longitude.toFixed(5));
        setStatus("idle");
      },
      () => {
        setError("Location was denied. Enter coordinates manually — they stay on this device.");
        setStatus("idle");
      },
      { timeout: 10000 },
    );
  }

  async function search() {
    if (!valid) return;
    setStatus("searching");
    setError(null);
    const query = `[out:json][timeout:25];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius * 1000},${latNum},${lngNum});
  way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius * 1000},${latNum},${lngNum});
);
out center tags 40;`;
    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      type Element = {
        type: string;
        id: number;
        lat?: number;
        lon?: number;
        center?: { lat: number; lon: number };
        tags?: Record<string, string>;
      };
      const found = (json.elements as Element[])
        .map((el) => {
          const elLat = el.lat ?? el.center?.lat;
          const elLng = el.lon ?? el.center?.lon;
          if (elLat === undefined || elLng === undefined) return null;
          return {
            id: `${el.type}-${el.id}`,
            name: el.tags?.name ?? el.tags?.["name:en"] ?? "Unnamed mosque",
            lat: elLat,
            lng: elLng,
            distanceKm: distanceKm(latNum, lngNum, elLat, elLng),
            osmUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
          };
        })
        .filter((m): m is Mosque => m !== null)
        .sort((a, b) => a.distanceKm - b.distanceKm);
      setMosques(found);
      setStatus("done");
    } catch {
      setError("The map service didn't respond. Try again in a moment.");
      setStatus("error");
    }
  }

  return (
    <ToolShell
      icon="ph:map-pin-area"
      title="Mosque Finder"
      arabic="أقرب مسجد"
      intro="Nearby mosques from OpenStreetMap's community data. Your position is used only for this one search — nothing is stored anywhere."
    >
      <div className={`${cardCls} p-5`}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Latitude">
            <input className={inputCls} inputMode="decimal" placeholder="e.g. 33.5731" value={lat} onChange={(e) => setLat(e.target.value)} />
          </Field>
          <Field label="Longitude">
            <input className={inputCls} inputMode="decimal" placeholder="e.g. -7.5898" value={lng} onChange={(e) => setLng(e.target.value)} />
          </Field>
          <Field label="Search radius">
            <select className={inputCls} value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
              {[2, 5, 10, 20].map((r) => (
                <option key={r} value={r}>{r} km</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={locate} disabled={status === "locating"} className={btnPrimary}>
            <Icon icon="ph:crosshair" className="size-4" />
            {status === "locating" ? "Locating…" : "Use my location"}
          </button>
          <button type="button" onClick={search} disabled={!valid || status === "searching"} className={btnPrimary}>
            <Icon icon="ph:magnifying-glass" className="size-4" />
            {status === "searching" ? "Searching…" : "Find mosques"}
          </button>
          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        </div>
      </div>

      {status === "done" ? (
        mosques.length > 0 ? (
          <ul className={`mt-6 divide-y divide-zinc-200 rounded-2xl border ${lineCls} bg-white dark:divide-zinc-800 dark:bg-zinc-900/60`}>
            {mosques.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className={`text-sm ${mutedCls}`}>{m.distanceKm.toFixed(1)} km away</p>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    Directions
                  </a>
                  <a href={m.osmUrl} target="_blank" rel="noreferrer" className={`${mutedCls} hover:underline`}>
                    OpenStreetMap
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`mt-6 text-sm ${mutedCls}`}>
            No mosques tagged within {radius} km here. Try a wider radius — community map coverage varies by area.
          </p>
        )
      ) : null}
    </ToolShell>
  );
}
