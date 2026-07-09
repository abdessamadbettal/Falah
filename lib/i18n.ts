import { en } from "@/locales/en";
import { ar } from "@/locales/ar";

// French (locales/fr.ts) is on hold for now — not deleted, just not wired
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

/** Every locale lives under its own prefix (/en, /ar); the bare root "/"
 * only redirects to the visitor's language. One rule, no special cases. */
export function localePath(locale: Locale, path = ""): string {
  return `/${locale}${path}`;
}
