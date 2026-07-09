/** Shared Tailwind class recipes. Plain strings with no directive, so both
 * Server and Client Components can import them. Prefer the field components in
 * this folder (`Input`, `Select`, …) where one exists — reach for these only
 * when styling an element they don't cover (e.g. a Link styled as a button). */

export const lineCls = "border-zinc-200 dark:border-zinc-800";
export const mutedCls = "text-zinc-500 dark:text-zinc-400";
export const brandCls = "text-emerald-700 dark:text-emerald-400";
export const goldCls = "text-amber-600 dark:text-amber-300";
export const cardCls = `rounded-2xl border ${lineCls} bg-white dark:bg-zinc-900/60`;

/** Base look shared by <Input> and <Select>: a roomy control with a soft
 * shadow, a hover cue, a two-part focus ring (accent border + faint halo),
 * and built-in disabled + aria-invalid states. */
export const inputCls =
  "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition-[color,border-color,box-shadow] caret-emerald-600 placeholder:text-zinc-400 hover:border-zinc-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:border-red-500 aria-[invalid=true]:focus:ring-red-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:caret-emerald-400 dark:placeholder:text-zinc-500 dark:hover:border-zinc-600 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/30";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:border-zinc-800 dark:text-zinc-100 dark:hover:border-emerald-400 dark:hover:text-emerald-400";

/** Join class fragments, dropping falsy ones. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
