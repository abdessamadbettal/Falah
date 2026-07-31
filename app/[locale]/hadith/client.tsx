"use client";

import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import { goldCls, lineCls, mutedCls, Star8, ToolShell } from "@/components/ui";
import { bareArabic } from "@/lib/arabic";
import type { Grade, Hadith } from "@/lib/hadith-build";
import type { Locale } from "@/lib/i18n";
import {
  citation,
  type DisplayMode,
  defaultDisplay,
  formatNumber,
  gradeLabel,
  gradeTone,
  graderLabel,
} from "@/lib/hadith-view";

/** Every hadith the page shows is in the HTML the server rendered — the state
 * below only decides what stays visible, so a crawler (and a reader with no
 * JavaScript) still gets the whole text. */
export default function HadithReader({
  icon,
  heading,
  hadiths,
  collectionName,
  above,
  children,
}: {
  icon: string;
  /** H1, opposite-script ornament and intro prose for this URL — built
   * server-side from the same strings the <title> and description use. */
  heading: { title: string; side: string; intro: string };
  hadiths: Hadith[];
  /** For the citation line: "Sahih al-Bukhari 6018". */
  collectionName: string;
  /** Server-rendered breadcrumb, above the H1. */
  above?: React.ReactNode;
  /** Server-rendered indexes and navigation — already HTML, so crawlers see
   * them without running any JavaScript. */
  children?: React.ReactNode;
}) {
  const d = useDict();
  const locale = useLocale();
  const t = d.tools.hadith;

  const [mode, setMode] = useState<DisplayMode>(defaultDisplay(locale));
  const [scale, setScale] = useState(1);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  /** Undecorated Arabic, so a search for "الصلاة" matches text written with
   * harakat. Built once — a long kitab is 50 hadiths of two languages. */
  const haystacks = useMemo(
    () => hadiths.map((h) => `${bareArabic(h.arabic)} ${h.translation}`.toLowerCase()),
    [hadiths],
  );

  const needle = query.trim().toLowerCase();
  const bare = bareArabic(needle);
  const shown = needle
    ? hadiths.filter((_, i) => haystacks[i].includes(needle) || haystacks[i].includes(bare))
    : hadiths;

  const showArabic = mode !== "translation";
  const showTranslation = mode !== "arabic";

  async function copy(h: Hadith) {
    const parts = [h.arabic, h.translation, `— ${citation(collectionName, h.n)}`].filter(Boolean);
    try {
      await navigator.clipboard.writeText(parts.join("\n\n"));
      setCopied(h.n);
      setTimeout(() => setCopied((c) => (c === h.n ? null : c)), 1800);
    } catch {
      // Clipboard is unavailable (insecure context, or refused) — the text is
      // on screen and selectable, so there is nothing to recover from.
    }
  }

  const modes: { id: DisplayMode; label: string }[] = [
    { id: "both", label: t.showBoth },
    { id: "arabic", label: t.showArabic },
    { id: "translation", label: t.showTranslation },
  ];

  return (
    <ToolShell icon={icon} title={heading.title} side={heading.side} intro={heading.intro} above={above} wide>
      {/* ---- reading controls ---- */}
      <div
        className={`sticky top-16 z-30 -mx-5 mb-8 border-y ${lineCls} bg-white/90 px-5 py-3 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border dark:bg-zinc-950/90`}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {/* display mode */}
          <div
            role="group"
            aria-label={t.display}
            className={`flex shrink-0 rounded-full border ${lineCls} p-0.5`}
          >
            {modes.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  mode === m.id
                    ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950"
                    : `${mutedCls} hover:text-emerald-700 dark:hover:text-emerald-400`
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* text size */}
          <div className="flex shrink-0 items-center gap-1">
            <span className={`me-1 text-xs ${mutedCls}`}>{t.textSize}</span>
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.85, Number((s - 0.15).toFixed(2))))}
              aria-label={`${t.textSize} −`}
              className={`grid size-8 place-items-center rounded-full border ${lineCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
            >
              <Icon icon="ph:minus" className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(1.75, Number((s + 0.15).toFixed(2))))}
              aria-label={`${t.textSize} +`}
              className={`grid size-8 place-items-center rounded-full border ${lineCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
            >
              <Icon icon="ph:plus" className="size-3.5" />
            </button>
          </div>

          {/* filter */}
          <div className="relative min-w-48 flex-1">
            <Icon
              icon="ph:magnifying-glass"
              className={`pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 ${mutedCls}`}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.filterPh}
              aria-label={t.filterAria}
              className={`w-full rounded-full border ${lineCls} bg-transparent py-2 ps-9 pe-3 text-sm outline-none transition-colors focus:border-emerald-600 dark:focus:border-emerald-400`}
            />
          </div>

          {needle ? (
            <p className={`shrink-0 text-xs ${mutedCls}`}>{t.matchCount(shown.length)}</p>
          ) : null}
        </div>
      </div>

      {/* ---- the hadiths ---- */}
      {shown.length === 0 ? (
        <p className={`rounded-2xl border ${lineCls} p-8 text-center text-sm ${mutedCls}`}>
          {t.noMatch(query.trim())}{" "}
          <button
            type="button"
            onClick={() => setQuery("")}
            className="font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
          >
            {t.clearFilter}
          </button>
        </p>
      ) : (
        <ol className="space-y-4">
          {shown.map((h) => (
            <li key={h.n}>
              <article
                id={`h-${formatNumber(h.n)}`}
                className={`scroll-mt-32 overflow-hidden rounded-2xl border ${lineCls} bg-white dark:bg-zinc-900/60`}
              >
                {/* reference row */}
                <header
                  className={`flex items-center justify-between gap-3 border-b ${lineCls} bg-zinc-50/70 px-4 py-2.5 dark:bg-zinc-900/40`}
                >
                  <a
                    href={`#h-${formatNumber(h.n)}`}
                    aria-label={`${t.linkAria} — ${citation(collectionName, h.n)}`}
                    className="group flex min-w-0 items-center gap-2.5"
                  >
                    {/* the number in an 8-pointed medallion, as the mushaf
                        marks an ayah — the site's one motif for "unit N" */}
                    <span className="relative grid size-8 shrink-0 place-items-center">
                      <Star8 className="absolute inset-0 size-full text-amber-500/70 dark:text-amber-300/60" />
                      <span className={`relative text-[10px] font-bold ${goldCls}`}>
                        {formatNumber(h.n)}
                      </span>
                    </span>
                    <span className="truncate text-sm font-semibold">{collectionName}</span>
                    <Icon
                      icon="ph:link-simple"
                      className={`size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 ${mutedCls}`}
                    />
                  </a>
                  <button
                    type="button"
                    onClick={() => copy(h)}
                    aria-label={t.copyAria}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-colors ${
                      copied === h.n
                        ? "text-emerald-700 dark:text-emerald-400"
                        : `${mutedCls} hover:text-emerald-700 dark:hover:text-emerald-400`
                    }`}
                  >
                    <Icon icon={copied === h.n ? "ph:check" : "ph:copy"} className="size-3.5" />
                    {copied === h.n ? t.copied : t.copy}
                  </button>
                </header>

                <div className="px-4 py-5 sm:px-6">
                  {showArabic ? (
                    <p
                      lang="ar"
                      dir="rtl"
                      className="text-right font-arabic leading-[2.1] text-zinc-900 dark:text-zinc-100"
                      style={{ fontSize: `${1.25 * scale}rem` }}
                    >
                      {h.arabic}
                    </p>
                  ) : null}

                  {showTranslation && showArabic && h.translation ? (
                    <span
                      className={`my-5 flex items-center gap-3 ${mutedCls}`}
                      aria-hidden="true"
                    >
                      <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                      <Star8 className="size-3 shrink-0 text-amber-500/60 dark:text-amber-300/50" />
                      <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                    </span>
                  ) : null}

                  {showTranslation ? (
                    h.translation ? (
                      <p
                        lang="en"
                        dir="ltr"
                        className={`leading-relaxed ${mutedCls}`}
                        style={{ fontSize: `${0.95 * scale}rem` }}
                      >
                        {h.translation}
                      </p>
                    ) : (
                      <p className={`text-xs italic ${mutedCls}`}>{t.untranslated}</p>
                    )
                  ) : null}

                  {h.grades.length ? <Grades locale={locale} grades={h.grades} /> : null}
                </div>
              </article>
            </li>
          ))}
        </ol>
      )}

      {children}
    </ToolShell>
  );
}

const TONE = {
  sahih:
    "border-emerald-600/30 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  hasan:
    "border-amber-500/30 bg-amber-50 text-amber-800 dark:border-amber-300/30 dark:bg-amber-400/10 dark:text-amber-200",
  daif: "border-rose-500/30 bg-rose-50 text-rose-800 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-300",
  neutral: "border-zinc-300 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300",
};

/** The scholars' verdicts on this hadith's chain. Shown in full rather than
 * reduced to one badge — they sometimes disagree, and which scholar said what
 * is the point. */
function Grades({ locale, grades }: { locale: Locale; grades: Grade[] }) {
  const d = useDict();
  return (
    <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={d.hadithBrowse.grade}>
      {grades.map((g) => (
        <li
          key={`${g.grader}-${g.grade}`}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] ${TONE[gradeTone(g.grade)]}`}
        >
          <span className="font-semibold">{gradeLabel(locale, g.grade)}</span>
          <span className="opacity-70">· {graderLabel(locale, g.grader)}</span>
        </li>
      ))}
    </ul>
  );
}
