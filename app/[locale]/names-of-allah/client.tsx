"use client";

import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Faq } from "@/components/faq";
import { useDict, useLocale } from "@/components/locale";
import {
  brandCls,
  cardCls,
  goldCls,
  Input,
  mutedCls,
  Star8,
  StarField,
  ToolShell,
} from "@/components/ui";
import { localePath, type Locale } from "@/lib/i18n";
import { NAMES_OF_ALLAH } from "@/lib/names";
import { namePath } from "@/lib/names-seo";
import { JsonLd, faqJsonLd } from "@/lib/seo";

export default function NamesOfAllahClient({ children }: { children?: React.ReactNode }) {
  const d = useDict();
  const t = d.tools.names;
  const locale = useLocale() as Locale;
  const [query, setQuery] = useState("");

  const short = (i: number) =>
    locale === "ar"
      ? NAMES_OF_ALLAH[i].meaningAr
      : locale === "fr"
        ? NAMES_OF_ALLAH[i].meaningFr
        : NAMES_OF_ALLAH[i].meaning;

  const q = query.trim().toLowerCase();
  const results = NAMES_OF_ALLAH.map((name, i) => ({ ...name, index: i })).filter(
    (n) =>
      !q ||
      n.transliteration.toLowerCase().includes(q) ||
      n.meaning.toLowerCase().includes(q) ||
      n.meaningFr.toLowerCase().includes(q) ||
      n.meaningAr.includes(query.trim()) ||
      n.explanation.toLowerCase().includes(q) ||
      n.arabic.includes(query.trim()),
  );

  return (
    <ToolShell icon="ph:sparkle" title={t.title} side={t.side} intro={t.intro} wide>
      <JsonLd data={faqJsonLd(t.faq)} />

      {/* hadith hero */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-700/20 bg-emerald-50/50 p-6 text-center dark:border-emerald-400/15 dark:bg-emerald-500/5">
        <StarField className="pointer-events-none absolute inset-0 size-full text-emerald-800/[0.05] dark:text-emerald-400/[0.06]" />
        <Star8 className={`relative mx-auto size-6 ${goldCls}`} />
        <p className="relative mx-auto mt-3 max-w-2xl font-display text-lg leading-relaxed sm:text-xl">
          {t.hadith}
        </p>
      </div>

      {/* search */}
      <div className="relative mt-6">
        <Icon
          icon="ph:magnifying-glass"
          className={`pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 ${mutedCls}`}
        />
        <Input
          className="ps-10"
          placeholder={t.searchPh}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t.searchAria}
        />
      </div>

      {/* the grid — every card is a real link to that name's own page, so the
          ninety-nine routes are reachable from the HTML and each one is
          shareable. Filtering stays client-side; the links do not depend on it. */}
      <motion.ul layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((n) => (
          <motion.li key={n.slug} layout>
            <Link
              href={localePath(locale, namePath(n.slug))}
              className={`group relative block h-full overflow-hidden ${cardCls} p-5 text-start transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-[0_18px_40px_-24px_rgba(4,120,87,0.45)] dark:hover:border-emerald-400/50`}
            >
              {/* ornamental number */}
              <span className="absolute end-4 left-4 grid size-8 place-items-center">
                <Star8 className="absolute inset-0 size-full text-amber-500/25 dark:text-amber-300/20" />
                <span className={`relative font-mono text-xs ${mutedCls}`}>
                  {String(n.index + 1).padStart(2, "0")}
                </span>
              </span>
              <p lang="ar" dir="rtl" className={`font-arabic text-4xl ${goldCls}`}>
                {n.arabic}
              </p>
              <p className={`mt-3 font-semibold ${brandCls}`}>{n.transliteration}</p>
              <p className={`mt-1 text-sm ${mutedCls}`}>{short(n.index)}</p>
              <span
                className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${mutedCls} transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400`}
              >
                {t.readMore}
                <Icon
                  icon="ph:arrow-right"
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                />
              </span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
      {results.length === 0 ? (
        <p className={`mt-6 text-sm ${mutedCls}`}>{t.noMatch(query)}</p>
      ) : null}

      {children}

      <Faq eyebrow={t.faqEyebrow} heading={t.faqH2} items={t.faq} />
    </ToolShell>
  );
}
