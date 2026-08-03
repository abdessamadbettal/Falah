"use client";

import { useSyncExternalStore } from "react";

const CRESCENT_D = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";

// The service worker serves this same page for every locale's offline
// fallback, so the copy is picked client-side from the switcher's saved
// preference (mirroring app/(redirect)/page.tsx) instead of being baked in.
const COPY = {
  en: {
    title: "You’re offline",
    body: "Please check your internet connection and try again.",
    retry: "Retry",
  },
  ar: {
    title: "أنت غير متصل بالإنترنت",
    body: "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
    retry: "إعادة المحاولة",
  },
  fr: {
    title: "Vous êtes hors ligne",
    body: "Veuillez vérifier votre connexion Internet et réessayer.",
    retry: "Réessayer",
  },
} as const;

function isCopyLocale(value: string): value is keyof typeof COPY {
  return value in COPY;
}

function detectLocale(): keyof typeof COPY {
  try {
    const stored = localStorage.getItem("locale");
    if (stored && isCopyLocale(stored)) return stored;
  } catch {
    // localStorage unavailable (private mode, etc.) — fall through to navigator
  }
  const nav = (navigator.language || "").slice(0, 2);
  return isCopyLocale(nav) ? nav : "en";
}

// No storage/language-change event fires while this page is open, so the
// external source only needs to be read once — subscribe is a no-op.
function subscribe() {
  return () => {};
}

function getServerLocale(): keyof typeof COPY {
  return "en";
}

export default function OfflinePage() {
  const locale = useSyncExternalStore(subscribe, detectLocale, getServerLocale);
  const t = COPY[locale];

  return (
    <main
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-20 text-center"
    >
      <svg viewBox="0 0 40 40" aria-hidden="true" className="size-14 text-emerald-700 dark:text-emerald-400">
        <g transform="translate(2 2) scale(1.5)">
          <path fill="currentColor" d={CRESCENT_D} />
        </g>
      </svg>
      <div className="space-y-2">
        <p className="font-display text-xl tracking-wide text-zinc-900 dark:text-zinc-100">
          Falah<span className="text-zinc-500 dark:text-zinc-400">.io</span>
        </p>
        <h1 className="font-display text-3xl sm:text-4xl">{t.title}</h1>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{t.body}</p>
      </div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300"
      >
        {t.retry}
      </button>
    </main>
  );
}
