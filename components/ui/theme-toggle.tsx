"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useDict } from "@/components/locale";
import { lineCls, mutedCls } from "./styles";
import { useMounted } from "./use-mounted";

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
