"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDict, useLocale } from "@/components/locale";
import { localePath, locales } from "@/lib/i18n";
import { lineCls, mutedCls } from "./styles";

const LANG_NATIVE: Record<string, string> = {
  en: "English",
  ar: "العربية",
};

const PREFIX_RE = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

/** A one-click toggle to the other language — with only two locales, a
 * dropdown menu is more interaction than the site needs. Shows the
 * language you'd switch to, not the current one. The choice is saved so
 * the root "/" redirect can honor it on the next visit. */
export function LanguageSwitcher() {
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
