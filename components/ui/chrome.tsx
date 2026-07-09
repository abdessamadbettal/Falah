"use client";

import { Icon } from "@iconify/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useDict, useLocale } from "@/components/locale";
import { Logo } from "@/components/logo";
import { localePath, locales } from "@/lib/i18n";
import { TOOL_CATEGORIES, TOOL_PATHS } from "@/lib/seo";
import { GITHUB_URL } from "@/lib/site";
import { Eyebrow, Star8, StarField } from "./ornaments";
import { goldCls, lineCls, mutedCls } from "./styles";

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

const LANG_NATIVE: Record<string, string> = {
  en: "English",
  ar: "العربية",
};

const PREFIXED_LOCALES = locales.filter((l) => l !== "en");
const PREFIX_RE = new RegExp(`^/(${PREFIXED_LOCALES.join("|")})(?=/|$)`);

/** A one-click toggle to the other language — with only two locales, a
 * dropdown menu is more interaction than the site needs. Shows the
 * language you'd switch to, not the current one. */
function LanguageSwitcher() {
  const locale = useLocale();
  const d = useDict();
  const pathname = usePathname() ?? localePath(locale);
  const rest = pathname.replace(PREFIX_RE, "") || "/";
  const other = locales.find((l) => l !== locale) ?? locale;

  return (
    <Link
      href={localePath(other, rest === "/" ? "" : rest)}
      hrefLang={other}
      lang={other}
      onClick={() => {
        try {
          localStorage.setItem("locale", other);
        } catch {}
      }}
      aria-label={d.common.langAria}
      className={`flex items-center gap-1.5 rounded-full border ${lineCls} px-3 py-1.5 text-xs font-semibold ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
    >
      <Icon icon="ph:globe" className="size-4" />
      <span className={other === "ar" ? "font-arabic  text-sm" : " text-sm"}>
        {LANG_NATIVE[other]}
      </span>
    </Link>
  );
}

/* --------------------------------- chrome --------------------------------- */

export function Header() {
  const d = useDict();
  return (
    <header
      className={`sticky top-0 z-40 border-b ${lineCls} bg-white/85 backdrop-blur dark:bg-zinc-950/85`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />
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
  const locale = useLocale();
  const reduce = useReducedMotion();
  const tools = d.tools;

  return (
    <footer
      className={`relative overflow-hidden border-t ${lineCls} bg-zinc-50 dark:bg-zinc-900/40`}
    >
      <StarField className="pointer-events-none absolute -right-10 -top-16 size-72 text-emerald-700/10 dark:text-emerald-400/10" />
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-x-8 gap-y-12 lg:grid-cols-[1.05fr_1.95fr]">
          {/* brand block */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <Logo tagline />
            <p className="mt-6 max-w-xs font-display text-lg leading-relaxed">
              {d.common.footerDua}
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <LanguageSwitcher />
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                aria-label={d.common.githubAria}
                className={`inline-flex size-9 items-center justify-center rounded-full border ${lineCls} ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
              >
                <Icon icon="ph:github-logo" className="size-4" />
              </a>
            </div>
          </motion.div>

          {/* every tool, grouped by category */}
          <div>
            <Eyebrow>{d.home.toolkitEyebrow}</Eyebrow>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3">
              {d.home.categories.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.06 }}
                >
                  <h3
                    className={`text-xs font-semibold uppercase tracking-[0.14em] ${mutedCls}`}
                  >
                    {cat.label}
                  </h3>
                  <ul className="mt-3.5 space-y-2.5">
                    {TOOL_CATEGORIES[i].map((tool) => (
                      <li key={tool.key}>
                        <Link
                          href={localePath(locale, TOOL_PATHS[tool.key])}
                          className="group inline-flex items-center gap-1.5 text-sm text-zinc-700 transition-colors hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-400"
                        >
                          <Icon
                            icon={tool.icon}
                            className={`size-4 shrink-0 ${mutedCls} transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400`}
                          />
                          {tools[tool.key].title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`mt-14 flex flex-col items-center gap-4 border-t ${lineCls} pt-8 text-xs ${mutedCls} sm:flex-row sm:justify-between`}
        >
          <span className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>© Falah.io · {d.common.mit}</span>
            <Link
              href={localePath(locale, "/about")}
              className="font-medium transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {d.common.nav.about}
            </Link>
          </span>
          <span className="inline-flex items-center gap-2">
            <Star8 className={`size-3.5 ${goldCls}`} />
            {d.common.clientSide}
          </span>
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
  // Each dict carries the *other* script as the ornament: Arabic calligraphy
  // for Latin locales, a Latin transliteration for Arabic.
  const renderSideAsArabic = locale !== "ar";
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
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
              lang={renderSideAsArabic ? "ar" : "en"}
              dir={renderSideAsArabic ? "rtl" : "ltr"}
              className={`${renderSideAsArabic ? "font-arabic text-2xl" : "font-mono text-xs uppercase tracking-[0.2em]"} ${goldCls}`}
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
