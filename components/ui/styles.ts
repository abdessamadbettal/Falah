/** Shared Tailwind class recipes. Plain strings with no directive, so both
 * Server and Client Components can import them. Prefer the primitives in
 * `./primitives` where one exists — reach for these only when styling an
 * element the primitives don't cover (e.g. a Link styled as a button). */

export const lineCls = "border-zinc-200 dark:border-zinc-800";
export const mutedCls = "text-zinc-500 dark:text-zinc-400";
export const brandCls = "text-emerald-700 dark:text-emerald-400";
export const goldCls = "text-amber-600 dark:text-amber-300";
export const cardCls = `rounded-2xl border ${lineCls} bg-white dark:bg-zinc-900/60`;
export const inputCls =
  "w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-emerald-400";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:border-zinc-800 dark:text-zinc-100 dark:hover:border-emerald-400 dark:hover:text-emerald-400";

/** Join class fragments, dropping falsy ones. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
