"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

export const GITHUB_URL = "https://github.com/abdessamadbettal/falah.io";

/* ------------------------- shared class recipes ------------------------- */

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

/* ------------------------------ ornaments -------------------------------- */

/** Rub el Hizb — the 8-pointed star of Islamic geometry. */
export function Star8({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        transform="translate(20 20)"
      >
        <rect x="-10" y="-10" width="20" height="20" />
        <rect x="-10" y="-10" width="20" height="20" transform="rotate(45)" />
      </g>
    </svg>
  );
}

/** A quiet tiling of 8-pointed stars, fading out radially. */
export function StarField({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      style={{
        maskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 72%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 72%)",
      }}
    >
      <defs>
        <pattern id="girih" width="56" height="56" patternUnits="userSpaceOnUse">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            transform="translate(28 28)"
          >
            <rect x="-13" y="-13" width="26" height="26" />
            <rect
              x="-13"
              y="-13"
              width="26"
              height="26"
              transform="rotate(45)"
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#girih)" />
    </svg>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Star8 className={`size-4 shrink-0 ${goldCls}`} />
      <span
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}
      >
        {children}
      </span>
      <span
        className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"
        aria-hidden="true"
      />
    </div>
  );
}

/* --------------------------- interactive pieces --------------------------- */

/** True after hydration. Gate time-dependent markup behind this so the
 * prerendered HTML never mismatches the client. */
const noopSubscribe = () => () => {};
export function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const mounted = useMounted();
  const [, bump] = useState(0);

  useEffect(() => {
    // Re-assert the theme after hydration: if React recovered from a
    // mismatch it re-created <html>'s class list, dropping "dark".
    try {
      const stored = localStorage.getItem("theme");
      const preferred = stored
        ? stored === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", preferred);
    } catch {}
  }, []);

  const dark = mounted
    ? document.documentElement.classList.contains("dark")
    : null;

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    bump((n) => n + 1);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex size-9 items-center justify-center rounded-full border ${lineCls} ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
    >
      {dark === null ? (
        <span className="size-4" />
      ) : (
        <Icon icon={dark ? "ph:sun" : "ph:moon"} className="size-4" />
      )}
    </button>
  );
}

/* --------------------------------- chrome --------------------------------- */

export function Header() {
  return (
    <header
      className={`sticky top-0 z-40 border-b ${lineCls} bg-white/85 backdrop-blur dark:bg-zinc-950/85`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Star8 className={`size-5 ${brandCls}`} />
          <span className="font-display text-xl tracking-wide">
            Falah<span className={mutedCls}>.io</span>
          </span>
        </Link>
        <nav className={`hidden items-center gap-7 text-sm ${mutedCls} sm:flex`}>
          <Link
            href="/#toolkit"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Toolkit
          </Link>
          <Link
            href="/#principles"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Principles
          </Link>
          <Link
            href="/#contribute"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Contribute
          </Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Falah.io on GitHub"
            className={`inline-flex size-9 items-center justify-center rounded-full border ${lineCls} ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
          >
            <Icon icon="ph:github-logo" className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className={`border-t ${lineCls}`}>
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <Star8 className={`size-5 ${goldCls}`} />
          <p className="max-w-md font-display text-lg leading-relaxed">
            May Allah accept this effort and make it beneficial for the Ummah.
            Ameen.
          </p>
          <div
            className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs ${mutedCls}`}
          >
            <span>MIT License</span>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              GitHub
            </a>
            <span>100% client-side · no tracking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------- tool shell ------------------------------- */

export function ToolShell({
  icon,
  title,
  arabic,
  intro,
  wide = false,
  children,
}: {
  icon: string;
  title: string;
  arabic: string;
  intro: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div
          className={`mx-auto ${wide ? "max-w-5xl" : "max-w-3xl"} px-5 py-10 sm:py-14`}
        >
          <Link
            href="/#toolkit"
            className={`inline-flex items-center gap-1.5 text-sm ${mutedCls} transition-colors hover:text-emerald-700 dark:hover:text-emerald-400`}
          >
            <Icon icon="ph:arrow-left" className="size-4" />
            All tools
          </Link>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* icon tile shaped like a miniature mihrab arch */}
              <span className="flex h-14 w-12 shrink-0 items-end justify-center rounded-t-full rounded-b-lg bg-emerald-50 pb-2.5 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Icon icon={icon} className="size-5" />
              </span>
              <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
            </div>
            <span
              lang="ar"
              dir="rtl"
              className={`font-arabic text-2xl ${goldCls}`}
            >
              {arabic}
            </span>
          </div>
          <p className={`mt-4 max-w-2xl leading-relaxed ${mutedCls}`}>
            {intro}
          </p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint ? (
        <span className={`mt-1 block text-xs ${mutedCls}`}>{hint}</span>
      ) : null}
    </label>
  );
}
