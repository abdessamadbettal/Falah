/** Arabic text helpers shared by the reader and the prerendered routes.
 *
 * The character class matters more than it looks. Writing it with literal
 * glyphs — `[ؐ-ًؚ-ٰٟۖ-ۭ]` — reads as the range U+0610–U+064B, which swallows
 * every Arabic *letter* (U+0620–U+064A) along with the marks, so stripping
 * "بِسْمِ" returned an empty string instead of "بسم". Spelled out in escapes,
 * the ranges are unambiguous and only combining marks are removed. */

const HARAKAT = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u08D3-\u08FF]/g;
/** Some ayah strings arrive with a byte-order mark or a tatweel. */
const NOISE = /[\uFEFF\u0640]/g;

/** Undecorated Arabic: no harakat, no BOM — what a reader would type into a
 * search box, and what belongs in a meta description. */
export function bareArabic(text: string): string {
  return text.replace(NOISE, "").replace(HARAKAT, "").replace(/\s+/g, " ").trim();
}

/** Strip the invisible BOM without touching the vowel marks. */
export function cleanAyah(text: string): string {
  return text.replace(/\uFEFF/g, "");
}

/** Outside Al-Fatiha the Uthmani text prefixes the basmala to verse 1. Drop
 * it so it can be shown as its own ornamental line instead of being read
 * twice. */
export function stripLeadingBasmala(text: string): string {
  const words = cleanAyah(text).trim().split(/\s+/);
  return bareArabic(words[0] ?? "") === "بسم" ? words.slice(4).join(" ") : text;
}
