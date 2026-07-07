import { en } from "./dict/en";
import { fr } from "./dict/fr";
import { ar } from "./dict/ar";

export const locales = ["en", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];
export type Dict = typeof en;

const dicts: Record<Locale, Dict> = { en, fr, ar };

export function getDict(locale: string): Dict {
  return dicts[(isLocale(locale) ? locale : "en") as Locale];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirFor(locale: string): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** English is served unprefixed at the site root; French and Arabic live
 * under their own subdirectory (/fr, /ar). */
export function localePath(locale: Locale, path = ""): string {
  return locale === "en" ? path || "/" : `/${locale}${path}`;
}

export const SITE_URL = "https://falah.io";
export const GITHUB_URL = "https://github.com/abdessamadbettal/falah.io";
