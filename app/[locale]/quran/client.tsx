"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useDict } from "@/components/locale";
import {
  brandCls,
  cardCls,
  goldCls,
  lineCls,
  mutedCls,
  Select,
  Star8,
  StarField,
  ToolShell,
} from "@/components/ui";
import { type Ayah, fetchSurahEditions, useSurahs } from "@/lib/quran";

/** A curated set of well-known reciters available on AlQuran.cloud. */
const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy" },
  { id: "ar.husary", name: "Mahmoud Al-Husary" },
  { id: "ar.abdurrahmaansudais", name: "Abdul Rahman Al-Sudais" },
  { id: "ar.mahermuaiqly", name: "Maher Al-Muaiqly" },
  { id: "ar.shaatree", name: "Abu Bakr Al-Shatri" },
  { id: "ar.ahmedajamy", name: "Ahmed Al-Ajamy" },
  { id: "ar.hudhaify", name: "Ali Al-Hudhaify" },
  { id: "ar.abdulsamad", name: "Abdul Basit Abdul Samad" },
];

const TRANSLATIONS = [
  { id: "en.sahih", name: "Saheeh International · EN" },
  { id: "en.pickthall", name: "Pickthall · EN" },
  { id: "en.yusufali", name: "Yusuf Ali · EN" },
  { id: "en.asad", name: "Muhammad Asad · EN" },
  { id: "en.transliteration", name: "Transliteration" },
  { id: "fr.hamidullah", name: "Hamidullah · FR" },
  { id: "ar.muyassar", name: "التفسير الميسّر · AR" },
];

const SPEEDS = [0.75, 1, 1.25, 1.5];
const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const toArabicNum = (n: number) =>
  String(n)
    .split("")
    .map((c) => AR_DIGITS[Number(c)] ?? c)
    .join("");

const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭ]/g;

/** For surahs other than Al-Fatiha, the Uthmani text prefixes the basmala to
 * the first verse. Drop it so it can be shown as its own ornamental line. */
function stripLeadingBasmala(text: string): string {
  const words = text.trim().split(/\s+/);
  const bare = (words[0] ?? "").replace(DIACRITICS, "");
  return bare === "بسم" ? words.slice(4).join(" ") : text;
}

/** The 8-pointed star medallion that closes each verse. */
function AyahMark({ n }: { n: number }) {
  return (
    <span className="relative mx-1 inline-grid size-[1.55em] place-items-center align-middle">
      <Star8 className="absolute inset-0 size-full text-amber-500/80 dark:text-amber-300/70" />
      <span className={`text-[0.44em] font-semibold ${goldCls}`}>{toArabicNum(n)}</span>
    </span>
  );
}

/** A compact pill dropdown for the reading controls: an icon for the category,
 * the current value, and a clear chevron so it reads as an interactive select
 * (the previous borderless selects looked like plain text). */
function ControlSelect({
  icon,
  ariaLabel,
  value,
  onChange,
  children,
}: {
  icon: string;
  ariaLabel: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm transition-colors ${lineCls} hover:border-emerald-600/60 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 dark:bg-zinc-900 dark:hover:border-emerald-400/60 dark:focus-within:border-emerald-400`}
    >
      <Icon icon={icon} className={`size-4 shrink-0 ${brandCls}`} />
      <span className="relative flex items-center">
        <select
          aria-label={ariaLabel}
          value={value}
          onChange={onChange}
          className="cursor-pointer appearance-none bg-transparent pe-5 font-medium text-zinc-900 focus:outline-none dark:text-zinc-100"
        >
          {children}
        </select>
        <Icon
          icon="ph:caret-down"
          className={`pointer-events-none absolute inset-e-0 size-3.5 ${mutedCls}`}
        />
      </span>
    </label>
  );
}

export default function QuranClient() {
  const d = useDict();
  const t = d.tools.quran;
  const reduce = useReducedMotion();
  const { surahs, error: listError } = useSurahs();

  const [surahNumber, setSurahNumber] = useState(1);
  const [reciter, setReciter] = useState(RECITERS[0].id);
  const [transEdition, setTransEdition] = useState(t.translationEdition);
  const [transMode, setTransMode] = useState<"hover" | "click" | "off">("hover");
  const [scale, setScale] = useState(1);
  const [speed, setSpeed] = useState(1);

  const [content, setContent] = useState<{ key: string; arabic: Ayah[]; translation: Ayah[] } | null>(null);
  const [audio, setAudio] = useState<{ key: string; ayahs: Ayah[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const contentKey = `${surahNumber}:${transEdition}`;
  const audioKey = `${surahNumber}:${reciter}`;

  // Arabic text + translation, refetched when the surah or translation changes.
  useEffect(() => {
    let cancelled = false;
    fetchSurahEditions(surahNumber, ["quran-uthmani", transEdition])
      .then(([arabic, translation]) => {
        if (!cancelled) {
          setContent({ key: `${surahNumber}:${transEdition}`, arabic, translation });
          setErr(null);
        }
      })
      .catch(() => {
        if (!cancelled) setErr(t.errSurah);
      });
    return () => {
      cancelled = true;
    };
  }, [surahNumber, transEdition, t.errSurah]);

  // Recitation audio, refetched only when the surah or reciter changes.
  useEffect(() => {
    let cancelled = false;
    fetchSurahEditions(surahNumber, [reciter])
      .then(([ayahs]) => {
        if (!cancelled) setAudio({ key: `${surahNumber}:${reciter}`, ayahs });
      })
      .catch(() => {
        if (!cancelled) setAudio(null);
      });
    return () => {
      cancelled = true;
    };
  }, [surahNumber, reciter]);

  const ready = content?.key === contentKey ? content : null;
  const audioReady = audio?.key === audioKey ? audio : null;
  const loading = !ready && !err;
  const surah = surahs?.find((s) => s.number === surahNumber);
  const showBismillah = surahNumber !== 1 && surahNumber !== 9;
  const transIsRtl = transEdition.startsWith("ar");

  function goToSurah(n: number) {
    const next = Math.min(114, Math.max(1, n));
    audioRef.current?.pause();
    setIsPlaying(false);
    setPlayingIdx(null);
    setActiveIdx(null);
    setSurahNumber(next);
  }

  function playIdx(idx: number) {
    const list = audioReady?.ayahs;
    const src = list?.[idx]?.audio;
    const el = audioRef.current;
    if (!src || !el) return;
    el.src = src;
    el.playbackRate = speed;
    void el.play().catch(() => {});
    setPlayingIdx(idx);
    setActiveIdx(idx);
    document
      .getElementById(`ayah-${idx}`)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }

  function togglePlay() {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      playIdx(playingIdx ?? activeIdx ?? 0);
    }
  }

  function onEnded() {
    const next = (playingIdx ?? -1) + 1;
    if (audioReady && next < audioReady.ayahs.length) {
      playIdx(next);
    } else {
      setIsPlaying(false);
      setPlayingIdx(null);
    }
  }

  const seg = (on: boolean) =>
    `rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
      on
        ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950"
        : `${mutedCls} hover:text-emerald-700 dark:hover:text-emerald-400`
    }`;

  return (
    <ToolShell icon="ph:book-open-text" title={t.title} side={t.side} intro={t.intro} wide>
      {/* ---- control deck ---- */}
      <div className={`${cardCls} p-4 sm:p-5`}>
        {/* row 1 — surah navigation + play */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-56 flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => goToSurah(surahNumber - 1)}
              disabled={surahNumber <= 1}
              aria-label={t.prev}
              className={`grid size-10 shrink-0 place-items-center rounded-full border ${lineCls} ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 disabled:opacity-40 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
            >
              <Icon icon="ph:caret-left" className="size-4 rtl:rotate-180" />
            </button>
            <div className="min-w-0 flex-1">
              <Select
                value={surahNumber}
                onChange={(e) => goToSurah(Number(e.target.value))}
                disabled={!surahs}
                aria-label={t.surah}
              >
                {(surahs ?? []).map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.englishName} — {s.englishNameTranslation}
                  </option>
                ))}
              </Select>
            </div>
            <button
              type="button"
              onClick={() => goToSurah(surahNumber + 1)}
              disabled={surahNumber >= 114}
              aria-label={t.next}
              className={`grid size-10 shrink-0 place-items-center rounded-full border ${lineCls} ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 disabled:opacity-40 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
            >
              <Icon icon="ph:caret-right" className="size-4 rtl:rotate-180" />
            </button>
          </div>

          <button
            type="button"
            onClick={togglePlay}
            disabled={!audioReady}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300"
          >
            <Icon icon={isPlaying ? "ph:pause-fill" : "ph:play-fill"} className="size-4" />
            {isPlaying ? t.pause : t.playSurah}
          </button>
        </div>

        {/* row 2 — recitation + reading settings */}
        <div className={`mt-4 flex flex-wrap items-center gap-2.5 border-t ${lineCls} pt-4`}>
          <ControlSelect
            icon="ph:microphone-stage"
            ariaLabel={t.reciter}
            value={reciter}
            onChange={(e) => {
              audioRef.current?.pause();
              setIsPlaying(false);
              setReciter(e.target.value);
            }}
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </ControlSelect>

          <ControlSelect
            icon="ph:gauge"
            ariaLabel={t.speed}
            value={speed}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSpeed(v);
              if (audioRef.current) audioRef.current.playbackRate = v;
            }}
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>{s}×</option>
            ))}
          </ControlSelect>

          <ControlSelect
            icon="ph:translate"
            ariaLabel={t.translation}
            value={transEdition}
            onChange={(e) => setTransEdition(e.target.value)}
          >
            {TRANSLATIONS.map((tr) => (
              <option key={tr.id} value={tr.id}>{tr.name}</option>
            ))}
          </ControlSelect>

          {/* reading settings, pushed to the trailing edge on wider screens */}
          <div className="flex flex-wrap items-center gap-2.5 sm:ms-auto">
            {/* translation reveal mode */}
            <div
              className={`flex items-center rounded-full border p-0.5 ${lineCls}`}
              role="group"
              aria-label={t.translationMode}
            >
              <button type="button" onClick={() => setTransMode("hover")} className={seg(transMode === "hover")}>{t.modeHover}</button>
              <button type="button" onClick={() => setTransMode("click")} className={seg(transMode === "click")}>{t.modeClick}</button>
              <button type="button" onClick={() => setTransMode("off")} className={seg(transMode === "off")}>{t.modeOff}</button>
            </div>

            {/* text size, with a live readout */}
            <div
              className={`flex items-center gap-0.5 rounded-full border bg-white p-0.5 ${lineCls} dark:bg-zinc-900`}
              role="group"
              aria-label={t.textSize}
            >
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.7, +(s - 0.1).toFixed(2)))}
                disabled={scale <= 0.7}
                aria-label={`${t.textSize} −`}
                className={`grid size-7 place-items-center rounded-full ${mutedCls} transition-colors hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-40 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400`}
              >
                <Icon icon="ph:text-aa" className="size-3" />
              </button>
              <span className={`min-w-11 text-center text-xs tabular-nums ${mutedCls}`}>
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(1.8, +(s + 0.1).toFixed(2)))}
                disabled={scale >= 1.8}
                aria-label={`${t.textSize} +`}
                className={`grid size-7 place-items-center rounded-full ${mutedCls} transition-colors hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-40 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400`}
              >
                <Icon icon="ph:text-aa" className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {listError ? <p className="mt-6 text-sm text-red-600 dark:text-red-400">{t.errList}</p> : null}
      {err ? <p className="mt-6 text-sm text-red-600 dark:text-red-400">{err}</p> : null}
      {loading && !listError && !err ? (
        <div className="mt-6 h-96 animate-pulse rounded-3xl bg-zinc-100 dark:bg-zinc-900" aria-hidden="true" />
      ) : null}

      {/* ---- the mushaf page ---- */}
      {ready && surah ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={surahNumber}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-6 overflow-hidden rounded-[1.75rem] border-2 border-emerald-700/25 bg-[#fbfaf2] p-2 dark:border-emerald-400/20 dark:bg-zinc-900/60"
          >
            <StarField className="pointer-events-none absolute inset-0 size-full text-emerald-800/[0.05] dark:text-emerald-400/[0.06]" />
            <div className="relative rounded-[1.4rem] border border-emerald-700/20 px-4 py-8 sm:px-10 dark:border-emerald-400/15">
              {/* surah header cartouche */}
              <div className="flex items-center justify-center gap-3">
                <Star8 className="size-5 shrink-0 text-amber-500/70 dark:text-amber-300/60" />
                <div className="rounded-full border border-emerald-700/30 bg-emerald-50/70 px-6 py-2 dark:border-emerald-400/25 dark:bg-emerald-500/10">
                  <span lang="ar" dir="rtl" className="font-arabic text-3xl text-emerald-800 sm:text-4xl dark:text-emerald-300">
                    {surah.name}
                  </span>
                </div>
                <Star8 className="size-5 shrink-0 text-amber-500/70 dark:text-amber-300/60" />
              </div>
              <p className={`mt-3 text-center text-sm ${mutedCls}`}>
                {surah.englishName} · {t.revelation[surah.revelationType] ?? surah.revelationType} ·{" "}
                {surah.numberOfAyahs} {t.ayahs}
              </p>

              {showBismillah ? (
                <p
                  lang="ar"
                  dir="rtl"
                  className="mt-7 text-center font-arabic text-2xl text-emerald-900 sm:text-3xl dark:text-emerald-200"
                >
                  {BISMILLAH}
                </p>
              ) : null}

              {/* flowing Uthmani text — each verse hoverable/clickable */}
              <div
                lang="ar"
                dir="rtl"
                className="mt-7 text-right font-arabic text-zinc-900 dark:text-zinc-100"
                style={{ fontSize: `${1.7 * scale}rem`, lineHeight: 2.35 }}
              >
                {ready.arabic.map((ayah, i) => {
                  const text = i === 0 && showBismillah ? stripLeadingBasmala(ayah.text) : ayah.text;
                  const on = i === activeIdx || i === playingIdx;
                  return (
                    <span
                      key={ayah.numberInSurah}
                      id={`ayah-${i}`}
                      onMouseEnter={transMode === "hover" ? () => setActiveIdx(i) : undefined}
                      onClick={transMode !== "off" ? () => setActiveIdx(i) : undefined}
                      className={`rounded-lg px-0.5 transition-colors ${transMode !== "off" ? "cursor-pointer" : ""} ${
                        on
                          ? "bg-emerald-200/70 dark:bg-emerald-400/25"
                          : "hover:bg-emerald-100/60 dark:hover:bg-emerald-500/10"
                      }`}
                    >
                      {text}
                      <AyahMark n={ayah.numberInSurah} />{" "}
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : null}

      {/* ---- sticky translation box ---- */}
      {ready && transMode !== "off" ? (
        <div className="sticky bottom-4 z-10 mt-4">
          <div className={`${cardCls} flex items-start gap-3 p-4 shadow-lg shadow-black/5 backdrop-blur`}>
            {activeIdx != null && ready.translation[activeIdx] ? (
              <>
                <button
                  type="button"
                  onClick={() => (playingIdx === activeIdx && isPlaying ? audioRef.current?.pause() : playIdx(activeIdx))}
                  disabled={!audioReady}
                  aria-label={t.playVerse}
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-700 text-white transition-colors hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-400 dark:text-emerald-950"
                >
                  <Icon icon={playingIdx === activeIdx && isPlaying ? "ph:pause-fill" : "ph:play-fill"} className="size-4" />
                </button>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${goldCls}`}>
                    {t.verseRef(surahNumber, activeIdx + 1)}
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeIdx}
                      initial={reduce ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      lang={transIsRtl ? "ar" : transEdition.split(".")[0]}
                      dir={transIsRtl ? "rtl" : "ltr"}
                      className={`mt-1 leading-relaxed ${transIsRtl ? "font-arabic text-lg" : "text-sm"}`}
                    >
                      {ready.translation[activeIdx].text}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <p className={`flex items-center gap-2 text-sm ${mutedCls}`}>
                <Icon icon="ph:hand-pointing" className="size-4" />
                {transMode === "hover" ? t.hoverHint : t.clickHint}
              </p>
            )}
          </div>
        </div>
      ) : null}

      <audio
        ref={audioRef}
        onEnded={onEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        hidden
      />
    </ToolShell>
  );
}
