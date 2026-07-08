import { en } from "./dict/en";
import { ar } from "./dict/ar";

// French (lib/dict/fr.ts) is on hold for now — not deleted, just not wired
// up — and can be added back to this list once it's ready.
export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export type Dict = typeof en;

const dicts: Record<Locale, Dict> = { en, ar };

export function getDict(locale: string): Dict {
  return dicts[(isLocale(locale) ? locale : "en") as Locale];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirFor(locale: string): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** English is served unprefixed at the site root; other locales live
 * under their own subdirectory (e.g. /ar). */
export function localePath(locale: Locale, path = ""): string {
  return locale === "en" ? path || "/" : `/${locale}${path}`;
}

export const SITE_URL = "https://falah.io";
export const GITHUB_URL = "https://github.com/abdessamadbettal/falah.io";
