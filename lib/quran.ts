"use client";

import { useEffect, useState } from "react";

const API = "https://api.alquran.cloud/v1";

export type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

export type Ayah = {
  numberInSurah: number;
  text: string;
  /** Global ayah number (1–6236) — present on every edition. */
  number?: number;
  /** Present on audio editions: the recitation mp3 URL for this ayah. */
  audio?: string;
  /** Mushaf page this verse falls on (1–604). */
  page?: number;
  juz?: number;
  /** Only on page responses: the surah this verse belongs to. A page can
   * straddle two surahs, so the verse — not the request — carries it. */
  surah?: Surah;
};

/** Pages in the standard Madani mushaf. */
export const TOTAL_PAGES = 604;

export function useSurahs() {
  const [surahs, setSurahs] = useState<Surah[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/surah`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setSurahs(json.data as Surah[]);
      })
      .catch(() => {
        if (!cancelled)
          setError("Could not load the surah list. Check your connection and try again.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { surahs, error };
}

/** Fetch one surah in several editions at once (text, translation, tafsir…). */
export async function fetchSurahEditions(
  surah: number,
  editions: string[],
): Promise<Ayah[][]> {
  const res = await fetch(`${API}/surah/${surah}/editions/${editions.join(",")}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return (json.data as { ayahs: Ayah[] }[]).map((e) => e.ayahs);
}

/** Fetch one mushaf page in several editions, in the same shape as
 * `fetchSurahEditions`. The page endpoint accepts a single edition only, so
 * the editions go out in parallel. */
export async function fetchPageEditions(
  page: number,
  editions: string[],
): Promise<Ayah[][]> {
  return Promise.all(
    editions.map(async (edition) => {
      const res = await fetch(`${API}/page/${page}/${edition}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return (json.data as { ayahs: Ayah[] }).ayahs;
    }),
  );
}

export async function fetchAyah(
  surah: number,
  ayah: number,
  editions: string[],
): Promise<{ text: string }[]> {
  const res = await fetch(
    `${API}/ayah/${surah}:${ayah}/editions/${editions.join(",")}`,
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data as { text: string }[];
}
