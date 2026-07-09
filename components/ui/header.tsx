"use client";

import { Icon } from "@iconify/react";
import { useDict } from "@/components/locale";
import { Logo } from "@/components/logo";
import { GITHUB_URL } from "@/lib/site";
import { LanguageSwitcher } from "./language-switcher";
import { lineCls, mutedCls } from "./styles";
import { ThemeToggle } from "./theme-toggle";

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
