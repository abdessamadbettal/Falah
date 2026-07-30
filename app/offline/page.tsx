"use client";

const CRESCENT_D = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";

export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-20 text-center">
      <svg viewBox="0 0 40 40" aria-hidden="true" className="size-14 text-emerald-700 dark:text-emerald-400">
        <g transform="translate(2 2) scale(1.5)">
          <path fill="currentColor" d={CRESCENT_D} />
        </g>
      </svg>
      <div className="space-y-2">
        <p className="font-display text-xl tracking-wide text-zinc-900 dark:text-zinc-100">
          Falah<span className="text-zinc-500 dark:text-zinc-400">.io</span>
        </p>
        <h1 className="font-display text-3xl sm:text-4xl">You&rsquo;re offline</h1>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          Please check your internet connection and try again.
        </p>
      </div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300"
      >
        Retry
      </button>
    </main>
  );
}
