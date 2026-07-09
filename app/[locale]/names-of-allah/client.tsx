"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Faq } from "@/components/faq";
import { useDict, useLocale } from "@/components/locale";
import {
  brandCls,
  cardCls,
  goldCls,
  Input,
  lineCls,
  mutedCls,
  Star8,
  StarField,
  ToolShell,
} from "@/components/ui";
import { NAMES_OF_ALLAH } from "@/lib/names";
import { JsonLd, faqJsonLd } from "@/lib/seo";

export default function NamesOfAllahClient() {
  const d = useDict();
  const t = d.tools.names;
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState<number | null>(null);

  const short = (i: number) => (locale === "ar" ? NAMES_OF_ALLAH[i].meaningAr : NAMES_OF_ALLAH[i].meaning);

  const q = query.trim().toLowerCase();
  const results = NAMES_OF_ALLAH.map((name, i) => ({ ...name, index: i })).filter(
    (n) =>
      !q ||
      n.transliteration.toLowerCase().includes(q) ||
      n.meaning.toLowerCase().includes(q) ||
      n.meaningAr.includes(query.trim()) ||
      n.explanation.toLowerCase().includes(q) ||
      n.arabic.includes(query.trim()),
  );

  // keyboard nav inside the detail view
  useEffect(() => {
    if (sel == null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSel(null);
      else if (e.key === "ArrowRight") setSel((s) => (s == null ? s : Math.min(98, s + 1)));
      else if (e.key === "ArrowLeft") setSel((s) => (s == null ? s : Math.max(0, s - 1)));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel]);

  const name = sel != null ? NAMES_OF_ALLAH[sel] : null;

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.title,
    numberOfItems: NAMES_OF_ALLAH.length,
    itemListElement: NAMES_OF_ALLAH.map((n, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${n.transliteration} — ${n.arabic}`,
      description: locale === "ar" ? n.meaningAr : `${n.meaning}. ${n.explanation}`,
    })),
  };

  return (
    <ToolShell icon="ph:sparkle" title={t.title} side={t.side} intro={t.intro} wide>
      <JsonLd data={itemListLd} />
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

      {/* grid */}
      <motion.div
        layout
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {results.map((n) => (
          <motion.button
            key={n.index}
            layout
            type="button"
            onClick={() => setSel(n.index)}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative overflow-hidden ${cardCls} p-5 text-start transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-[0_18px_40px_-24px_rgba(4,120,87,0.45)] dark:hover:border-emerald-400/50`}
          >
            {/* ornamental number */}
            <span className="absolute end-4 top-4 grid size-8 place-items-center">
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
            <span className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${mutedCls} transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400`}>
              {locale === "ar" ? "المزيد" : "Read more"}
              <Icon icon="ph:arrow-right" className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </span>
          </motion.button>
        ))}
      </motion.div>
      {results.length === 0 ? (
        <p className={`mt-6 text-sm ${mutedCls}`}>{t.noMatch(query)}</p>
      ) : null}

      {/* detail view */}
      <AnimatePresence>
        {name && sel != null ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSel(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="relative w-full max-w-lg overflow-hidden rounded-t-3xl border border-emerald-700/20 bg-white sm:rounded-3xl dark:border-emerald-400/15 dark:bg-zinc-900"
            >
              <StarField className="pointer-events-none absolute inset-0 size-full text-emerald-800/[0.05] dark:text-emerald-400/[0.06]" />
              {/* header controls */}
              <div className="relative flex items-center justify-between px-5 pt-4">
                <span className={`font-mono text-xs ${mutedCls}`}>{t.nameLabel(sel + 1)}</span>
                <button
                  type="button"
                  onClick={() => setSel(null)}
                  aria-label={t.close}
                  className={`grid size-9 place-items-center rounded-full border ${lineCls} ${mutedCls} transition-colors hover:text-emerald-700 dark:hover:text-emerald-400`}
                >
                  <Icon icon="ph:x" className="size-4" />
                </button>
              </div>

              <div className="relative px-6 pb-6 pt-2 text-center">
                {/* mihrab arch framing the name */}
                <div className={`mx-auto flex aspect-square max-w-56 flex-col items-center justify-center rounded-t-full rounded-b-2xl border ${lineCls} bg-emerald-50/60 dark:bg-emerald-500/5`}>
                  <p lang="ar" dir="rtl" className={`font-arabic text-6xl ${goldCls}`}>
                    {name.arabic}
                  </p>
                </div>
                <p className={`mt-4 font-display text-2xl ${brandCls}`}>{name.transliteration}</p>
                <p className="mt-1 font-medium">{locale === "ar" ? name.meaningAr : name.meaning}</p>
                {locale !== "ar" ? (
                  <p className={`mt-4 text-sm leading-relaxed ${mutedCls}`}>{name.explanation}</p>
                ) : null}

                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard?.writeText(`${name.arabic} — ${name.transliteration} — ${name.meaning}`)
                  }
                  className={`mt-5 inline-flex items-center gap-1.5 rounded-full border ${lineCls} px-4 py-2 text-sm ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
                >
                  <Icon icon="ph:copy" className="size-4" />
                  {t.copy}
                </button>
              </div>

              {/* prev / next */}
              <div className={`relative flex items-center justify-between border-t ${lineCls} px-3 py-2`}>
                <button
                  type="button"
                  onClick={() => setSel((s) => (s == null ? s : Math.max(0, s - 1)))}
                  disabled={sel <= 0}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm ${mutedCls} transition-colors hover:text-emerald-700 disabled:opacity-40 dark:hover:text-emerald-400`}
                >
                  <Icon icon="ph:caret-left" className="size-4 rtl:rotate-180" />
                  {t.prev}
                </button>
                <button
                  type="button"
                  onClick={() => setSel((s) => (s == null ? s : Math.min(98, s + 1)))}
                  disabled={sel >= 98}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm ${mutedCls} transition-colors hover:text-emerald-700 disabled:opacity-40 dark:hover:text-emerald-400`}
                >
                  {t.next}
                  <Icon icon="ph:caret-right" className="size-4 rtl:rotate-180" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Faq eyebrow={t.faqEyebrow} heading={t.faqH2} items={t.faq} />
    </ToolShell>
  );
}
