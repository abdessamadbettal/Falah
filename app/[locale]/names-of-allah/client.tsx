"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import {
  ToolShell,
  cardCls,
  goldCls,
  inputCls,
  mutedCls,
} from "@/components/ui";
import { NAMES_OF_ALLAH } from "@/lib/names";

export default function NamesOfAllahClient() {
  const d = useDict();
  const t = d.tools.names;
  const locale = useLocale();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = NAMES_OF_ALLAH.map((name, i) => ({ ...name, number: i + 1 })).filter(
    (n) =>
      !q ||
      n.transliteration.toLowerCase().includes(q) ||
      n.meaning.toLowerCase().includes(q) ||
      (n.meaningFr && n.meaningFr.toLowerCase().includes(q)) ||
      n.arabic.includes(query.trim()),
  );

  return (
    <ToolShell icon="ph:sparkle" title={t.title} side={t.side} intro={t.intro} wide>
      <div className="relative">
        <Icon
          icon="ph:magnifying-glass"
          className={`pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 ${mutedCls}`}
        />
        <input
          className={`${inputCls} ps-10`}
          placeholder={t.searchPh}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t.searchAria}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((name) => (
          <div key={name.number} className={`${cardCls} relative p-5`}>
            <span className={`absolute end-4 top-4 font-mono text-xs ${mutedCls}`}>
              {String(name.number).padStart(2, "0")}
            </span>
            <p lang="ar" dir="rtl" className={`font-arabic text-3xl ${goldCls}`}>
              {name.arabic}
            </p>
            <p className="mt-3 font-semibold text-emerald-700 dark:text-emerald-400">
              {name.transliteration}
            </p>
            {locale !== "ar" ? (
              <p className={`mt-0.5 text-sm ${mutedCls}`}>{name.meaning}</p>
            ) : null}
          </div>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className={`mt-6 text-sm ${mutedCls}`}>{t.noMatch(query)}</p>
      ) : null}
    </ToolShell>
  );
}
