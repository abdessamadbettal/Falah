"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import { brandCls, inputCls, lineCls, mutedCls } from "@/components/ui";

export type Place = {
  name: string;
  admin1?: string;
  country: string;
  code?: string;
  lat: number;
  lng: number;
};

/** Seed a default location from the visitor's IP. Only used to prefill the
 * tool — the coordinates come back with the response, nothing is stored. */
export async function detectIpPlace(): Promise<Place | null> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return null;
    const data = await res.json();
    const lat = Number(data.latitude);
    const lng = Number(data.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return {
      name: data.city || data.country_name || "",
      admin1: data.region || undefined,
      country: data.country_name || "",
      code: String(data.country_code ?? "").toUpperCase(),
      lat,
      lng,
    };
  } catch {
    return null;
  }
}

/** Live city search over the Open-Meteo geocoding API — every city on Earth,
 * with coordinates and localized names, no key required. */
export function CitySearch({ onPick }: { onPick: (p: Place) => void }) {
  const d = useDict();
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    let cancelled = false;
    // Every state update lives in the debounced callback, so nothing runs
    // synchronously in the effect body. Stale results stay hidden because the
    // dropdown only renders while the query is long enough.
    const id = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=${locale}&format=json`;
        const res = await fetch(url);
        const data = await res.json();
        if (cancelled) return;
        setResults(
          (data.results ?? []).map((r: Record<string, unknown>) => ({
            name: r.name as string,
            admin1: r.admin1 as string | undefined,
            country: r.country as string,
            code: r.country_code as string | undefined,
            lat: r.latitude as number,
            lng: r.longitude as number,
          })),
        );
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query, locale]);

  return (
    <div className="relative">
      <Icon
        icon={searching ? "ph:circle-notch" : "ph:magnifying-glass"}
        className={`pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 ${mutedCls} ${searching ? "animate-spin" : ""} rtl:left-auto rtl:right-3`}
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={d.common.searchCityPh}
        aria-label={d.common.searchCityPh}
        autoComplete="off"
        className={`${inputCls} pl-9 rtl:pr-9 rtl:pl-3`}
      />
      {open && query.trim().length >= 2 ? (
        <ul
          className={`absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border bg-white p-1 shadow-lg ${lineCls} dark:bg-zinc-900`}
        >
          {results.length === 0 && !searching ? (
            <li className={`px-3 py-3 text-sm ${mutedCls}`}>
              {d.common.noCityMatch}
            </li>
          ) : (
            results.map((r, i) => (
              <li key={`${r.name}-${r.lat}-${i}`}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onPick(r);
                    setQuery("");
                    setResults([]);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                >
                  <Icon icon="ph:map-pin" className={`size-4 shrink-0 ${brandCls}`} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{r.name}</span>
                    <span className={`block truncate text-xs ${mutedCls}`}>
                      {[r.admin1, r.country].filter(Boolean).join(", ")}
                    </span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
