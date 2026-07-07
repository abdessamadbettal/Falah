"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useDict, useLocale } from "@/components/locale";
import { Logo } from "@/components/logo";
import { localePath, locales } from "@/lib/i18n";

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
  const d = useDict();
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
      aria-label={dark ? d.common.themeToLight : d.common.themeToDark}
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

const LANG_META: Record<string, { native: string; short: string }> = {
  en: { native: "English", short: "EN" },
  fr: { native: "Français", short: "FR" },
  ar: { native: "العربية", short: "AR" },
};

function LanguageSwitcher() {
  const locale = useLocale();
  const d = useDict();
  const pathname = usePathname() ?? localePath(locale);
  const rest = pathname.replace(/^\/(fr|ar)(?=\/|$)/, "") || "/";
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={d.common.langAria}
        className={`flex items-center gap-1.5 rounded-full border ${lineCls} px-3 py-1.5 text-xs font-semibold ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
      >
        <Icon icon="ph:globe" className="size-4" />
        <span>{LANG_META[locale].short}</span>
        <Icon
          icon="ph:caret-down"
          className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <ul
          role="menu"
          className={`absolute inset-e-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border ${lineCls} bg-white py-1 shadow-lg dark:bg-zinc-900`}
        >
          {locales.map((l) => (
            <li key={l} role="none">
              <Link
                role="menuitem"
                href={localePath(l, rest === "/" ? "" : rest)}
                hrefLang={l}
                lang={l}
                onClick={() => {
                  setOpen(false);
                  try {
                    localStorage.setItem("locale", l);
                  } catch {}
                }}
                aria-current={l === locale ? "true" : undefined}
                className={`flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                  l === locale
                    ? "bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <span className={l === "ar" ? "font-arabic text-base" : ""}>
                  {LANG_META[l].native}
                </span>
                {l === locale ? (
                  <Icon icon="ph:check-bold" className="size-3.5 shrink-0" />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* --------------------------------- chrome --------------------------------- */

export function Header() {
  const locale = useLocale();
  const d = useDict();
  return (
    <header
      className={`sticky top-0 z-40 border-b ${lineCls} bg-white/85 backdrop-blur dark:bg-zinc-950/85`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />
        <nav className={`hidden items-center gap-7 text-sm ${mutedCls} md:flex`}>
          <Link
            href={`${localePath(locale)}#toolkit`}
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {d.common.nav.toolkit}
          </Link>
          <Link
            href={`${localePath(locale)}#principles`}
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {d.common.nav.principles}
          </Link>
          <Link
            href={`${localePath(locale)}#contribute`}
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {d.common.nav.contribute}
          </Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={d.common.githubAria}
            className={`hidden size-9 items-center justify-center rounded-full border sm:inline-flex ${lineCls} ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
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
  const d = useDict();
  return (
    <footer className={`border-t ${lineCls}`}>
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <Logo tagline centered />
          <p className="max-w-md font-display text-lg leading-relaxed">
            {d.common.footerDua}
          </p>
          <div
            className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs ${mutedCls}`}
          >
            <span>{d.common.mit}</span>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              GitHub
            </a>
            <span>{d.common.clientSide}</span>
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
  side,
  intro,
  wide = false,
  children,
}: {
  icon: string;
  title: string;
  side: string;
  intro: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const d = useDict();
  const sideIsArabic = locale !== "ar";
  return (
    <>
      <Header />
      <main className="flex-1">
        <div
          className={`mx-auto ${wide ? "max-w-5xl" : "max-w-3xl"} px-5 py-10 sm:py-14`}
        >
          <Link
            href={`${localePath(locale)}#toolkit`}
            className={`inline-flex items-center gap-1.5 text-sm ${mutedCls} transition-colors hover:text-emerald-700 dark:hover:text-emerald-400`}
          >
            <Icon icon="ph:arrow-left" className="size-4 rtl:rotate-180" />
            {d.common.allTools}
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
              lang={sideIsArabic ? "ar" : "en"}
              dir={sideIsArabic ? "rtl" : "ltr"}
              className={`${sideIsArabic ? "font-arabic text-2xl" : "font-mono text-xs uppercase tracking-[0.2em]"} ${goldCls}`}
            >
              {side}
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
