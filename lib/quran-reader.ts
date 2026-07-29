/** Shared, client-safe types and helpers for the Quran reader.
 *
 * Kept separate from `quran-build.ts` (which touches node:fs) so the reader
 * can import these without dragging server-only code into the bundle. */

import { localePath, type Locale } from "./i18n";
import { SURAHS, TOTAL_HIZB, TOTAL_JUZ, TOTAL_PAGES, TOTAL_SURAHS } from "./quran-meta";
import { hizbPath, juzPath, mushafPath, surahPath } from "./quran-seo";

/** The four ways the mushaf is conventionally divided — and the four route
 * families. Every one of them is a real URL. */
export type BrowseMode = "surah" | "juz" | "hizb" | "page";

export type ReaderAyah = {
  /** Global ayah number, 1–6236 — also the recitation file name. */
  n: number;
  surah: number;
  ayah: number;
  page: number;
  juz: number;
  hizb: number;
  arabic: string;
  translation: string;
};

/** Everything the reader needs to draw a unit, handed down from the server so
 * the verses are in the prerendered HTML rather than fetched after paint. */
export type ReaderUnit = {
  mode: BrowseMode;
  /** Surah number, juz, hizb or mushaf page, depending on `mode`. */
  n: number;
  ayahs: ReaderAyah[];
  /** The translation edition `ayahs[].translation` holds. */
  edition: string;
};

export const UNIT_TOTAL: Record<BrowseMode, number> = {
  surah: TOTAL_SURAHS,
  juz: TOTAL_JUZ,
  hizb: TOTAL_HIZB,
  page: TOTAL_PAGES,
};

/** Which unit of `mode` a given verse belongs to — used to keep your place
 * when switching between surah, juz, hizb and page. */
export function unitOf(mode: BrowseMode, ayah: ReaderAyah): number {
  return mode === "surah" ? ayah.surah : mode === "juz" ? ayah.juz : mode === "hizb" ? ayah.hizb : ayah.page;
}

export function unitPath(locale: Locale, mode: BrowseMode, n: number): string {
  const clamped = Math.min(UNIT_TOTAL[mode], Math.max(1, n));
  const path =
    mode === "surah"
      ? surahPath(SURAHS[clamped - 1].slug)
      : mode === "juz"
        ? juzPath(clamped)
        : mode === "hizb"
          ? hizbPath(clamped)
          : mushafPath(clamped);
  return localePath(locale, path);
}

/** Reciters, with the bitrate their audio is actually published at — Abdul
 * Basit is only on 64 and Sudais only on 192, and requesting the wrong one
 * returns a 403. */
export const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy", bitrate: 128 },
  { id: "ar.husary", name: "Mahmoud Al-Husary", bitrate: 128 },
  { id: "ar.abdurrahmaansudais", name: "Abdul Rahman Al-Sudais", bitrate: 192 },
  { id: "ar.mahermuaiqly", name: "Maher Al-Muaiqly", bitrate: 128 },
  { id: "ar.shaatree", name: "Abu Bakr Al-Shatri", bitrate: 128 },
  { id: "ar.ahmedajamy", name: "Ahmed Al-Ajamy", bitrate: 128 },
  { id: "ar.hudhaify", name: "Ali Al-Hudhaify", bitrate: 128 },
  { id: "ar.abdulsamad", name: "Abdul Basit Abdul Samad", bitrate: 64 },
];

const BITRATE = new Map(RECITERS.map((r) => [r.id, r.bitrate]));

/** Recitation URLs are addressable by global ayah number, so playback needs
 * no API call at all — the reader works from the prerendered data alone. */
export function audioUrl(reciter: string, globalAyah: number): string {
  const rate = BITRATE.get(reciter) ?? 128;
  return `https://cdn.islamic.network/quran/audio/${rate}/${reciter}/${globalAyah}.mp3`;
}

export const TRANSLATIONS = [
  { id: "en.sahih", name: "Saheeh International · EN" },
  { id: "en.pickthall", name: "Pickthall · EN" },
  { id: "en.yusufali", name: "Yusuf Ali · EN" },
  { id: "en.asad", name: "Muhammad Asad · EN" },
  { id: "en.transliteration", name: "Transliteration" },
  { id: "fr.hamidullah", name: "Hamidullah · FR" },
  { id: "ar.muyassar", name: "التفسير الميسّر · AR" },
];

export const SPEEDS = [0.75, 1, 1.25, 1.5];

const API = "https://api.alquran.cloud/v1";

/** Fetch one unit in a different translation. Only called when the reader
 * switches away from the edition the page was built with — the default never
 * hits the network. A hizb has no endpoint of its own, so it is assembled
 * from its four quarters. */
export async function fetchUnitTranslation(
  mode: BrowseMode,
  n: number,
  edition: string,
): Promise<string[]> {
  const paths =
    mode === "hizb"
      ? [4 * n - 3, 4 * n - 2, 4 * n - 1, 4 * n].map((q) => `hizbQuarter/${q}`)
      : [`${mode}/${n}`];

  const parts = await Promise.all(
    paths.map(async (p) => {
      const res = await fetch(`${API}/${p}/${edition}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return (json.data.ayahs as { text: string }[]).map((a) => a.text);
    }),
  );
  return parts.flat();
}
