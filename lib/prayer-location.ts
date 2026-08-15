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

/** Read the saved place, or null when nothing is saved, storage is blocked
 * (private mode) or the payload is malformed. */
export function loadSavedPlace(): SavedPrayerPlace | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedPrayerPlace;
    const p = parsed?.place;
    if (!p || typeof p.lat !== "number" || typeof p.lng !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persist the active place so the next visit restores it without GPS, IP
 * detection or a network — including fully offline. */
export function savePlace(place: Place, method: MethodKey): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ place, method, savedAt: Date.now() }));
  } catch {
    // storage unavailable — today's non-persisted behavior is the fallback
  }
}

/** Forget the saved place and let the default detection flow take over. */
export function clearSavedPlace(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to do if storage is blocked
  }
}
