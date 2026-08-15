import type { Place } from "@/components/city-search";
import type { MethodKey } from "@/lib/prayer-calc";

/** The persisted choice of the /prayer-times tool: enough to rebuild the
 * whole page — city, coordinates, calculation method — from one string. */
export type SavedPrayerPlace = {
  place: Place;
  method: MethodKey;
  savedAt: number;
};

const KEY = "falah:prayer-place";

function parse(raw: string | null): SavedPrayerPlace | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SavedPrayerPlace;
    const p = parsed?.place;
    if (!p || typeof p.lat !== "number" || typeof p.lng !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Read the saved place, or null when nothing is saved, storage is blocked
 * (private mode) or the payload is malformed. */
export function loadSavedPlace(): SavedPrayerPlace | null {
  try {
    return parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

// --- External store -----------------------------------------------------
// The page restores the saved place through useSyncExternalStore (like
// `useMounted`), so the prerendered HTML always matches: the server and the
// hydration pass read a null snapshot, then React swaps in the saved value
// without a manual restore effect.

let cached: SavedPrayerPlace | null = null;
let cachedInit = false;
let listeners: Array<() => void> = [];

function ensureCached() {
  if (cachedInit) return;
  cached = loadSavedPlace();
  cachedInit = true;
}

function notify() {
  for (const listener of listeners) listener();
}

export function getSavedPlaceSnapshot(): SavedPrayerPlace | null {
  ensureCached();
  return cached;
}

export function getSavedPlaceServerSnapshot(): SavedPrayerPlace | null {
  return null;
}

export function subscribeSavedPlace(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

/** Persist the active place so the next visit restores it without GPS, IP
 * detection or a network — including fully offline. */
export function savePlace(place: Place, method: MethodKey): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ place, method, savedAt: Date.now() }));
  } catch {
    // storage unavailable — today's non-persisted behavior is the fallback
  }
  cached = loadSavedPlace();
  cachedInit = true;
  notify();
}

/** Forget the saved place and let the default detection flow take over. */
export function clearSavedPlace(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to do if storage is blocked
  }
  cached = null;
  cachedInit = true;
  notify();
}
