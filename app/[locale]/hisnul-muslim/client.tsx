"use client";

import { Icon } from "@iconify/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Faq } from "@/components/faq";
import { useDict, useLocale } from "@/components/locale";
import {
  ToolShell,
  brandCls,
  cardCls,
  goldCls,
  lineCls,
  mutedCls,
} from "@/components/ui";
import { type HisnChapter, type HisnDua, fetchHisnChapter, fetchHisnChapters } from "@/lib/hisn";
import { JsonLd, faqJsonLd } from "@/lib/seo";

export default function HisnulMuslimClient() {
  const d = useDict();
  const t = d.tools.hisnul;
  const locale = useLocale();
  const reduce = useReducedMotion();

  const [chapters, setChapters] = useState<HisnChapter[] | null>(null);
  const [chaptersErr, setChaptersErr] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [data, setData] = useState<{ key: string; duas: HisnDua[] } | null>(null);
  const [dataErr, setDataErr] = useState(false);
  const [query, setQuery] = useState("");
  const [playKey, setPlayKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // chapter list
  useEffect(() => {
    let cancelled = false;
    fetchHisnChapters(locale)
      .then((cs) => {
        if (cancelled) return;
        setChapters(cs);
        setChaptersErr(false);
        setActiveId((a) => a ?? cs[0]?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) setChaptersErr(true);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  // duas of the active chapter
  useEffect(() => {
    if (activeId == null) return;
    let cancelled = false;
    const key = `${locale}:${activeId}`;
    fetchHisnChapter(locale, activeId)
      .then((duas) => {
        if (!cancelled) {
          setData({ key, duas });
          setDataErr(false);
        }
      })
      .catch(() => {
        if (!cancelled) setDataErr(true);
      });
    return () => {
      cancelled = true;
    };
  }, [locale, activeId]);

  const activeKey = `${locale}:${activeId}`;
  const duas = data?.key === activeKey ? data.duas : null;
  const duasLoading = !duas && !dataErr && activeId != null;
  const activeChapter = chapters?.find((c) => c.id === activeId) ?? null;

  const q = query.trim().toLowerCase();
  const filtered = (chapters ?? []).filter((c) => !q || c.title.toLowerCase().includes(q));

  function selectChapter(id: number) {
    audioRef.current?.pause();
    setPlayKey(null);
    setActiveId(id);
  }

  function toggle(key: string, src: string) {
    const el = audioRef.current;
    if (!el || !src) return;
    if (playKey === key) {
      if (isPlaying) el.pause();
      else void el.play().catch(() => {});
      return;
    }
    el.src = src;
    void el.play().catch(() => {});
    setPlayKey(key);
  }

  function copy(dua: HisnDua) {
    const text = [dua.arabic, dua.translation].filter(Boolean).join("\n");
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId((c) => (c === dua.id ? null : c)), 1600);
    });
  }

  return (
    <ToolShell icon="ph:hands-praying" title={t.title} side={t.side} intro={t.intro} wide>
      <JsonLd data={faqJsonLd(t.faq)} />

      {chaptersErr ? (
        <p className="text-sm text-red-600 dark:text-red-400">{t.error}</p>
      ) : !chapters ? (
        <p className={`text-sm ${mutedCls}`}>{t.loading}</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* chapter navigator */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="relative">
              <Icon
                icon="ph:magnifying-glass"
                className={`pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 ${mutedCls} rtl:left-auto rtl:right-3`}
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPh}
                aria-label={t.searchPh}
                className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-9 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 rtl:pr-9 rtl:pl-3 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-emerald-400"
              />
            </div>
            <ul className={`mt-3 max-h-64 space-y-0.5 overflow-auto rounded-2xl border p-1.5 lg:max-h-[600px] ${lineCls} bg-white dark:bg-zinc-900/60`}>
              {filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => selectChapter(c.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors ${
                      c.id === activeId
                        ? "bg-emerald-700 font-medium text-white dark:bg-emerald-400 dark:text-emerald-950"
                        : "hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                    }`}
                  >
                    <Icon icon="ph:book-open-text" className="size-3.5 shrink-0 opacity-70" />
                    <span className="line-clamp-2">{c.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* reading pane */}
          <section>
            {activeChapter ? (
              <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-700/25 bg-emerald-50/50 p-5 dark:border-emerald-400/20 dark:bg-emerald-500/5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl">{activeChapter.title}</h2>
                    {duas ? (
                      <p className={`mt-0.5 text-sm ${mutedCls}`}>{t.count(duas.length)}</p>
                    ) : null}
                  </div>
                  {activeChapter.audio ? (
                    <button
                      type="button"
                      onClick={() => toggle(`c${activeChapter.id}`, activeChapter.audio)}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300"
                    >
                      <Icon
                        icon={playKey === `c${activeChapter.id}` && isPlaying ? "ph:pause-fill" : "ph:play-fill"}
                        className="size-4"
                      />
                      {playKey === `c${activeChapter.id}` && isPlaying ? t.pause : t.playChapter}
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            {dataErr ? (
              <p className="mt-6 text-sm text-red-600 dark:text-red-400">{t.error}</p>
            ) : duasLoading ? (
              <div className="mt-6 space-y-4" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`h-32 animate-pulse rounded-2xl border ${lineCls}`} />
                ))}
              </div>
            ) : duas ? (
              <motion.ol
                key={activeKey}
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.04 } } }}
                className="mt-6 space-y-4"
              >
                {duas.map((dua) => {
                  const playing = playKey === `d${dua.id}` && isPlaying;
                  return (
                    <motion.li
                      key={dua.id}
                      variants={{
                        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
                        show: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className={`${cardCls} p-6 transition-colors ${playing ? "border-emerald-500 dark:border-emerald-400/60" : ""}`}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        {dua.repeat > 1 ? (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-300/15 dark:text-amber-300">
                            {t.repeat(dua.repeat)}
                          </span>
                        ) : null}
                        <span className="flex-1" />
                        {dua.audio ? (
                          <button
                            type="button"
                            onClick={() => toggle(`d${dua.id}`, dua.audio)}
                            aria-label={t.playChapter}
                            className={`grid size-9 place-items-center rounded-full border transition-colors ${
                              playing
                                ? "border-emerald-600 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950"
                                : `${lineCls} ${mutedCls} hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`
                            }`}
                          >
                            <Icon icon={playing ? "ph:pause-fill" : "ph:play-fill"} className="size-4" />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => copy(dua)}
                          aria-label={t.copy}
                          className={`grid size-9 place-items-center rounded-full border transition-colors ${lineCls} ${
                            copiedId === dua.id
                              ? "text-emerald-700 dark:text-emerald-400"
                              : `${mutedCls} hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`
                          }`}
                        >
                          <Icon icon={copiedId === dua.id ? "ph:check" : "ph:copy"} className="size-4" />
                        </button>
                      </div>

                      {dua.note ? (
                        <p className={`mb-3 text-sm font-medium ${brandCls}`}>{dua.note}</p>
                      ) : null}

                      <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-loose sm:text-3xl">
                        {dua.arabic}
                      </p>

                      {locale !== "ar" && dua.translation ? (
                        <p className={`mt-4 border-t ${lineCls} pt-4 text-sm leading-relaxed ${mutedCls}`}>
                          {dua.translation}
                        </p>
                      ) : null}
                    </motion.li>
                  );
                })}
              </motion.ol>
            ) : (
              <p className={`mt-6 text-sm ${mutedCls}`}>{t.selectPrompt}</p>
            )}
          </section>
        </div>
      )}

      <Faq eyebrow={t.faqEyebrow} heading={t.faqH2} items={t.faq} />

      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setPlayKey(null);
        }}
        hidden
      />
    </ToolShell>
  );
}
