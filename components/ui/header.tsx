"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import { Logo } from "@/components/logo";
import { localePath } from "@/lib/i18n";
import { TOOL_PATHS } from "@/lib/seo";
import { GITHUB_URL } from "@/lib/site";
import { LanguageSwitcher } from "./language-switcher";
import { lineCls, mutedCls } from "./styles";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";

const NAV: { key: "prayer" | "quran"; icon: string }[] = [
  { key: "quran", icon: "ph:book-open-text" },
  { key: "prayer", icon: "ph:mosque" },
];

export function Header() {
  const d = useDict();
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-40 border-b ${lineCls} bg-white/85 backdrop-blur dark:bg-zinc-950/85`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />

        <div className="flex items-center gap-2.5">
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map(({ key, icon }) => {
              const href = localePath(locale, TOOL_PATHS[key]);
              const active = pathname === href;
              return (
                <Link
                  key={key}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 border-b pb-0.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${
                    active
                      ? "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400"
                      : `border-transparent ${mutedCls} hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`
                  }`}
                >
                  <Icon icon={icon} className="size-4" />
                  {d.tools[key].title}
                </Link>
              );
            })}
          </nav>

          <LanguageSwitcher />

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={d.common.githubAria}
            className={`inline-flex size-9 items-center justify-center rounded-full border transition-colors hover:border-emerald-600 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:hover:border-emerald-400 dark:hover:text-emerald-400 dark:focus-visible:ring-offset-zinc-950 ${lineCls} ${mutedCls}`}
          >
            <Icon icon="ph:github-logo" className="size-4" />
          </a>

          <ThemeToggle />

          {/* Mobile menu trigger */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex size-9 items-center justify-center rounded-full border transition-colors md:hidden ${lineCls} ${mutedCls} hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
          >
            <Icon icon={open ? "ph:x" : "ph:list"} className="size-4" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav
          className={`flex flex-col border-t ${lineCls} bg-white/95 backdrop-blur dark:bg-zinc-950/95 md:hidden`}
        >
          {NAV.map(({ key, icon }) => (
            <Link
              key={key}
              href={localePath(locale, TOOL_PATHS[key])}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 border-b px-5 py-3.5 text-sm font-medium last:border-b-0 ${lineCls} ${mutedCls} hover:text-emerald-700 dark:hover:text-emerald-400`}
            >
              <Icon icon={icon} className="size-5" />
              {d.tools[key].title}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}