"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useDict } from "@/components/locale";
import { goldCls, lineCls, mutedCls, Star8, ToolShell } from "@/components/ui";
import { bareArabic } from "@/lib/arabic";

/** One searchable row: a collection, or a kitab inside one. Built on the
 * server so the index is exactly what the routes publish. */
export type SearchEntry = {
  href: string;
  label: string;
  /** The collection a kitab belongs to, or the compiler of a collection. */
  sub: string;
  /** The name in the other script, so an Arabic query finds an English page
   * and vice versa. Not displayed — only searched. */
  alt: string;
};

/** The hub: a search across all ten collections and their ~400 books, over a
 * server-rendered directory of the same routes. The index is small enough
 * (~400 rows) to ship whole, which makes the search instant and offline. */
export default function HadithHub({
  heading,
  entries,
  stat,
  children,
}: {
  heading: { title: string; side: string; intro: string };
  entries: SearchEntry[];
  /** "36,104 hadiths across 10 collections" — the headline figure. */
  stat: string;
  /** The server-rendered directory and FAQ, shown when no query is active. */
  children: React.ReactNode;
}) {
  const d = useDict();
  const t = d.tools.hadith;
  const [query, setQuery] = useState("");

  const haystacks = useMemo(
    () => entries.map((e) => bareArabic(`${e.label} ${e.sub} ${e.alt}`).toLowerCase()),
    [entries],
  );

  const needle = bareArabic(query.trim()).toLowerCase();
  const results = useMemo(() => {
    if (!needle) return [];
    const hits: SearchEntry[] = [];
    for (let i = 0; i < entries.length && hits.length < 60; i++) {
      if (haystacks[i].includes(needle)) hits.push(entries[i]);
    }
    return hits;
  }, [needle, entries, haystacks]);

  return (
    <ToolShell
      icon="ph:book-bookmark"
      title={heading.title}
      side={heading.side}
      intro={heading.intro}
      wide
    >
      <p className={`flex items-center gap-2.5 text-sm font-semibold ${goldCls}`}>
        <Star8 className="size-4 shrink-0" />
        {stat}
      </p>

      <div className="relative mt-6">
        <Icon
          icon="ph:magnifying-glass"
          className={`pointer-events-none absolute inset-s-4 top-1/2 size-5 -translate-y-1/2 ${mutedCls}`}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPh}
          aria-label={t.searchAria}
          className={`w-full rounded-full border-2 ${lineCls} bg-white py-3.5 ps-12 pe-4 text-base outline-none transition-colors focus:border-emerald-600 dark:bg-zinc-900/60 dark:focus:border-emerald-400`}
        />
      </div>

      {needle ? (
        results.length === 0 ? (
          <p className={`mt-8 rounded-2xl border ${lineCls} p-8 text-center text-sm ${mutedCls}`}>
            {t.searchEmpty(query.trim())}
          </p>
        ) : (
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {results.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className={`flex h-full items-center gap-3 rounded-2xl border ${lineCls} bg-white px-4 py-3 transition-colors hover:border-emerald-500/60 dark:bg-zinc-900/60 dark:hover:border-emerald-400/50`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{r.label}</span>
                    <span className={`block truncate text-xs ${mutedCls}`}>
                      {t.resultsIn} {r.sub}
                    </span>
                  </span>
                  <Icon
                    icon="ph:arrow-right"
                    className={`size-4 shrink-0 ${mutedCls} rtl:rotate-180`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )
      ) : (
        <>
          <p className={`mt-3 text-center text-xs ${mutedCls}`}>{t.searchHint}</p>
          {children}
        </>
      )}
    </ToolShell>
  );
}
