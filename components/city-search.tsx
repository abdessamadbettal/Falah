"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import {
  brandCls,
  Input,
  lineCls,
  mutedCls,
} from "@/components/ui";

export type Place = {
  name: string;
  admin1?: string;
  country: string;
  code?: string;
  lat: number;
  lng: number;
};

function toPlace(
  city: unknown,
  region: unknown,
  country: unknown,
  code: unknown,
  lat: unknown,
  lng: unknown,
): Place | null {
  const latN = Number(lat);
  const lngN = Number(lng);
  if (!Number.isFinite(latN) || !Number.isFinite(lngN)) return null;
  const countryStr = String(country ?? "");
  return {
    name: String(city ?? "") || countryStr,
    admin1: region ? String(region) : undefined,
    country: countryStr,
    code: String(code ?? "").toUpperCase(),
    lat: latN,
    lng: lngN,
  };
}

/** Key-less IP geolocation providers, tried in order. Free tiers rate-limit
 * per IP, so a fallback chain keeps the default location working when the
 * first provider returns 403. All are HTTPS + CORS-enabled. */
const IP_PROVIDERS: { url: string; parse: (d: Record<string, unknown>) => Place | null }[] = [
  {
    url: "https://ipwho.is/",
    parse: (d) =>
      d.success === false
        ? null
        : toPlace(d.city, d.region, d.country, d.country_code, d.latitude, d.longitude),
  },
  {
    url: "https://get.geojs.io/v1/ip/geo.json",
    parse: (d) => toPlace(d.city, d.region, d.country, d.country_code, d.latitude, d.longitude),
  },
];

/** Seed a default location from the visitor's IP. Only used to prefill the
 * tool — nothing is stored, and the tool still works (defaulting to Makkah)
 * if every provider is blocked. */
export async function detectIpPlace(): Promise<Place | null> {
  for (const provider of IP_PROVIDERS) {
    try {
      const res = await fetch(provider.url);
      if (!res.ok) continue;
      const place = provider.parse(await res.json());
      if (place) return place;
    } catch {
      // try the next provider
    }
  }
  return null;
}

/** Turn exact GPS coordinates into a human place (city, region, country)
 * with BigDataCloud's free, key-less client reverse-geocoder. Falls back to
 * bare coordinates under the given label if the lookup fails. */
export async function reverseGeocode(
  lat: number,
  lng: number,
  locale: string,
  fallbackLabel: string,
): Promise<Place> {
  const bare: Place = { name: fallbackLabel, country: "", lat, lng };
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=${locale}`,
    );
    if (!res.ok) return bare;
    const d = await res.json();
    const place = toPlace(
      d.city || d.locality,
      d.principalSubdivision,
      d.countryName,
      d.countryCode,
      lat,
      lng,
    );
    return place && place.name ? place : bare;
  } catch {
    return bare;
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
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={d.common.searchCityPh}
        aria-label={d.common.searchCityPh}
        autoComplete="off"
        className="pl-9 rtl:pr-9 rtl:pl-3"
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
