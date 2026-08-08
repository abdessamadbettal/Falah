"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useDict, useLocale } from "@/components/locale";
import { localePath, locales } from "@/lib/i18n";
import { lineCls, mutedCls } from "./styles";

const LANG_NATIVE: Record<string, string> = {
  en: "English",
  ar: "العربية",
  fr: "Français",
};

const PREFIX_RE = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

/** Renders a dropdown to select the language.
 * The choice is saved so the root "/" redirect can honor it on the next visit. */
export function LanguageSwitcher({ up }: { up?: boolean }) {
  const locale = useLocale();
  const d = useDict();
  const pathname = usePathname() ?? localePath(locale);
  const rest = pathname.replace(PREFIX_RE, "") || "/";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={d.common.langAria}
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-full border ${lineCls} px-3 py-1.5 text-xs font-semibold ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
      >
        <Icon icon="ph:globe" className="size-4" />
        <span className={locale === "ar" ? "font-arabic text-sm" : "text-sm"}>
          {LANG_NATIVE[locale]}
        </span>
        <Icon icon="ph:caret-down" className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className={`absolute z-50 flex min-w-[140px] flex-col gap-1 rounded-xl border ${lineCls} bg-white p-1.5 shadow-xl dark:bg-zinc-900 ${up ? "bottom-full mb-2 ltr:left-0 rtl:right-0" : "top-full mt-2 ltr:right-0 rtl:left-0"
            }`}
        >
          {locales.map((other) => (
            <Link
              key={other}
              href={localePath(other, rest === "/" ? "" : rest)}
              hrefLang={other}
              lang={other}
              onClick={() => {
                setOpen(false);
                try {
                  localStorage.setItem("locale", other);
                } catch { }
              }}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${other === locale
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
            >
              <span className={other === "ar" ? "font-arabic" : ""}>
                {LANG_NATIVE[other]}
              </span>
              {other === locale && <Icon icon="ph:check-bold" className="size-3.5 shrink-0" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
