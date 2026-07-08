"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { CitySearch } from "@/components/city-search";
import { Faq } from "@/components/faq";
import { useDict } from "@/components/locale";
import { OsmMap } from "@/components/osm-map";
import {
  Field,
  ToolShell,
  brandCls,
  btnGhost,
  btnPrimary,
  cardCls,
  inputCls,
  lineCls,
  mutedCls,
} from "@/components/ui";
import { JsonLd, faqJsonLd } from "@/lib/seo";

type Mosque = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  osmUrl: string;
};

/** Makkah — the default map view before a location is known. */
const DEFAULT_CENTER = { lat: 21.4225, lng: 39.8262 };

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MosqueFinderClient() {
  const d = useDict();
  const t = d.tools.mosque;

  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(13);
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(5);
  const [status, setStatus] = useState<"idle" | "locating" | "searching" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const didAuto = useRef(false);

  async function searchAround(lat: number, lng: number, r: number) {
    setStatus("searching");
    setError(null);
    setOrigin({ lat, lng });
    const query = `[out:json][timeout:25];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:${r * 1000},${lat},${lng});
  way["amenity"="place_of_worship"]["religion"="muslim"](around:${r * 1000},${lat},${lng});
);
out center tags 60;`;
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
            name: el.tags?.name ?? el.tags?.["name:en"] ?? t.unnamed,
            lat: elLat,
            lng: elLng,
            distanceKm: distanceKm(lat, lng, elLat, elLng),
            osmUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
          };
        })
        .filter((m): m is Mosque => m !== null)
        .sort((a, b) => a.distanceKm - b.distanceKm);
      setMosques(found);
      setSelectedId(null);
      setStatus("done");
    } catch {
      setError(t.errorService);
      setStatus("error");
    }
  }

  function locate() {
    if (!navigator.geolocation) {
      setError(d.common.geoUnavailable);
      return;
    }
    setStatus("locating");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(c);
        setZoom(14);
        searchAround(c.lat, c.lng, radius);
      },
      () => {
        setError(t.locationNeeded);
        setStatus("idle");
      },
      { timeout: 10000 },
    );
  }

  // On first open, ask for GPS straight away.
  useEffect(() => {
    if (didAuto.current) return;
    didAuto.current = true;
    locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the selected mosque scrolled into view in the list.
  useEffect(() => {
    if (selectedId) {
      document.getElementById(`m-${selectedId}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedId]);

  function selectMosque(m: Mosque) {
    setSelectedId(m.id);
    setCenter({ lat: m.lat, lng: m.lng });
  }

  return (
    <ToolShell icon="ph:map-pin-area" title={t.title} side={t.side} intro={t.intro} wide>
      <JsonLd data={faqJsonLd(t.faq)} />

      {/* controls */}
      <div className={`${cardCls} p-5`}>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <Field label={t.find}>
            <CitySearch
              onPick={(p) => {
                setCenter({ lat: p.lat, lng: p.lng });
                setZoom(14);
                searchAround(p.lat, p.lng, radius);
              }}
            />
          </Field>
          <Field label={t.radius}>
            <select
              className={inputCls}
              value={radius}
              onChange={(e) => {
                const r = Number(e.target.value);
                setRadius(r);
                if (origin) searchAround(origin.lat, origin.lng, r);
              }}
            >
              {[2, 5, 10, 20].map((r) => (
                <option key={r} value={r}>{r} km</option>
              ))}
            </select>
          </Field>
          <button
            type="button"
            onClick={locate}
            disabled={status === "locating"}
            className={btnPrimary}
          >
            <Icon
              icon={status === "locating" ? "ph:circle-notch" : "ph:crosshair"}
              className={`size-4 ${status === "locating" ? "animate-spin" : ""}`}
            />
            {status === "locating" ? d.common.locating : d.common.useMyLocation}
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">{error}</p> : null}
      </div>

      {/* map + results */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative lg:sticky lg:top-20 lg:self-start">
          <OsmMap
            center={center}
            zoom={zoom}
            onCenterChange={setCenter}
            onZoomChange={setZoom}
            userPos={origin}
            radiusKm={radius}
            markers={mosques}
            selectedId={selectedId}
            onSelect={(id) => {
              const m = mosques.find((x) => x.id === id);
              if (m) selectMosque(m);
            }}
            className={`h-90 rounded-2xl border lg:h-140 ${lineCls}`}
          />
          {/* re-search wherever the map is now centered */}
          <button
            type="button"
            onClick={() => searchAround(center.lat, center.lng, radius)}
            disabled={status === "searching"}
            className={`absolute left-1/2 top-3 -translate-x-1/2 ${btnGhost} border bg-white/95 shadow-sm backdrop-blur disabled:opacity-60 dark:bg-zinc-900/95`}
          >
            <Icon
              icon={status === "searching" ? "ph:circle-notch" : "ph:arrows-clockwise"}
              className={`size-4 ${status === "searching" ? "animate-spin" : ""}`}
            />
            {status === "searching" ? t.searching : t.searchArea}
          </button>
        </div>

        <div>
          {status === "done" && mosques.length > 0 ? (
            <>
              <p className={`mb-3 text-sm font-medium ${mutedCls}`}>{t.resultCount(mosques.length)}</p>
              <ul className={`max-h-140 divide-y divide-zinc-200 overflow-auto rounded-2xl border ${lineCls} bg-white dark:divide-zinc-800 dark:bg-zinc-900/60`}>
                {mosques.map((m) => (
                  <li
                    key={m.id}
                    id={`m-${m.id}`}
                    className={`transition-colors ${m.id === selectedId ? "bg-emerald-50 dark:bg-emerald-500/10" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => selectMosque(m)}
                      className="flex w-full items-start gap-3 px-5 py-4 text-start"
                    >
                      <Icon
                        icon="ph:map-pin-fill"
                        className={`mt-0.5 size-5 shrink-0 ${m.id === selectedId ? "text-amber-500" : brandCls}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{m.name}</span>
                        <span className={`text-sm ${mutedCls}`}>{t.away(m.distanceKm.toFixed(1))}</span>
                      </span>
                    </button>
                    {m.id === selectedId ? (
                      <div className={`flex gap-4 border-t px-5 py-3 text-sm font-medium ${lineCls}`}>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                          <Icon icon="ph:navigation-arrow" className="size-4" />
                          {t.directions}
                        </a>
                        <a href={m.osmUrl} target="_blank" rel="noreferrer" className={`${mutedCls} hover:underline`}>
                          {t.osm}
                        </a>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          ) : status === "done" && mosques.length === 0 ? (
            <p className={`rounded-2xl border ${lineCls} p-5 text-sm ${mutedCls}`}>{t.noResults(radius)}</p>
          ) : status === "searching" ? (
            <div className={`h-40 animate-pulse rounded-2xl ${lineCls} border`} aria-hidden="true" />
          ) : (
            <p className={`rounded-2xl border ${lineCls} p-5 text-sm ${mutedCls}`}>{t.locationNeeded}</p>
          )}
        </div>
      </div>

      <Faq eyebrow={t.faqEyebrow} heading={t.faqH2} items={t.faq} />
    </ToolShell>
  );
}
