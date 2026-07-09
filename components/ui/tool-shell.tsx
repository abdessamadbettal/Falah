"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useDict, useLocale } from "@/components/locale";
import { localePath } from "@/lib/i18n";
import { Footer } from "./footer";
import { Header } from "./header";
import { goldCls, mutedCls } from "./styles";

/** The frame every tool page renders inside: header, back link, title row
 * with the calligraphic side ornament, intro, content, footer. */
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
