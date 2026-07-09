"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useDict, useLocale } from "@/components/locale";
import { Logo } from "@/components/logo";
import { localePath } from "@/lib/i18n";
import { TOOL_PATHS } from "@/lib/seo";
import { GITHUB_URL } from "@/lib/site";
import { LanguageSwitcher } from "./language-switcher";
import { lineCls, mutedCls } from "./styles";
import { ThemeToggle } from "./theme-toggle";

/** The two most-used tools get a direct link in the header; everything else
 * lives in the footer directory and the home grid. */
const NAV: { key: "prayer" | "quran"; icon: string }[] = [
  { key: "quran", icon: "ph:book-open-text" },
  { key: "prayer", icon: "ph:mosque" },
];

export function Header() {
  const d = useDict();
  const locale = useLocale();
  return (
    <header
      className={`sticky top-0 z-40 border-b ${lineCls} bg-white/85 backdrop-blur dark:bg-zinc-950/85`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-7">
          <Logo />
         
        </div>
        <div className="flex items-center gap-6">
           <nav className="hidden items-center gap-6 md:flex">
            {NAV.map(({ key, icon }) => (
              <Link
                key={key}
                href={localePath(locale, TOOL_PATHS[key])}
                className={`inline-flex items-center gap-1.5 text-sm font-medium ${mutedCls} transition-colors hover:text-emerald-700 dark:hover:text-emerald-400`}
              >
                <Icon icon={icon} className="size-4" />
                {d.tools[key].title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={d.common.githubAria}
            className={` size-9 items-center justify-center rounded-full border inline-flex ${lineCls} ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
          >
            <Icon icon="ph:github-logo" className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
