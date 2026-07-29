"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useDict } from "@/components/locale";
import { goldCls, lineCls, mutedCls, Star8, StarField, ToolShell } from "@/components/ui";
import {
  type Ayah,
  fetchPageEditions,
  fetchSurahEditions,
  type Surah,
  TOTAL_PAGES,
  useSurahs,
} from "@/lib/quran";
import { type Anchor, anchorFromEvent, AyahTooltip } from "./ayah-tooltip";
import {
  type BrowseMode,
  ControlsPanel,
  iconBtnCls,
  type QuranUi,
  RECITERS,
  SeekBar,
  SPEEDS,
  type TransMode,
} from "./controls";

const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const toArabicNum = (n: number) =>
  String(n)
    .split("")
    .map((c) => AR_DIGITS[Number(c)] ?? c)
    .join("");

const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭ]/g;

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

/** A run of consecutive verses from one surah. A mushaf page can straddle two
 * surahs, so the text is drawn in runs rather than as a single block. */
type Segment = { key: string; surah?: Surah; items: { ayah: Ayah; i: number }[] };

export default function QuranClient() {
  const d = useDict();
  const t = d.tools.quran;
  const reduce = useReducedMotion();
  const { surahs, error: listError } = useSurahs();

  const [mode, setMode] = useState<BrowseMode>("surah");
  const [surahNumber, setSurahNumber] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [reciter, setReciter] = useState(RECITERS[0].id);
  const [transEdition, setTransEdition] = useState(t.translationEdition);
  const [transMode, setTransMode] = useState<TransMode>("hover");
  const [scale, setScale] = useState(1);
  const [speed, setSpeed] = useState(1);

  const [content, setContent] = useState<{
    key: string;
    /** The browse mode and surah/page this text was fetched for — rendering
     * reads these, not the live state, so a pending fetch can't relabel the
     * text still on screen. */
    mode: BrowseMode;
    unit: number;
    arabic: Ayah[];
    translation: Ayah[];
  } | null>(null);
  const [audio, setAudio] = useState<{ key: string; ayahs: Ayah[] } | null>(null);
  // Tagged with the request it belongs to, so navigating away retires it.
  const [err, setErr] = useState<{ key: string; msg: string } | null>(null);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "ayah" | "surah">("off");
  const [sheetOpen, setSheetOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoPlayFirstAyah = useRef(false);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unit = mode === "surah" ? surahNumber : pageNumber;
  const contentKey = `${mode}:${unit}:${transEdition}`;
  const audioKey = `${mode}:${unit}:${reciter}`;

  // Arabic text + translation, refetched when the surah/page or translation changes.
  useEffect(() => {
    let cancelled = false;
    const key = `${mode}:${unit}:${transEdition}`;
    const editions = ["quran-uthmani", transEdition];
    const load =
      mode === "surah" ? fetchSurahEditions(unit, editions) : fetchPageEditions(unit, editions);
    load
      .then(([arabic, translation]) => {
        if (!cancelled) {
          setContent({ key, mode, unit, arabic, translation });
          setErr(null);
        }
      })
      .catch(() => {
        if (!cancelled) setErr({ key, msg: t.errSurah });
      });
    return () => {
      cancelled = true;
    };
  }, [mode, unit, transEdition, t.errSurah]);

  // Recitation audio, refetched only when the surah/page or reciter changes.
  useEffect(() => {
    let cancelled = false;
    const key = `${mode}:${unit}:${reciter}`;
    const load =
      mode === "surah" ? fetchSurahEditions(unit, [reciter]) : fetchPageEditions(unit, [reciter]);
    load
      .then(([ayahs]) => {
        if (!cancelled) setAudio({ key, ayahs });
      })
      .catch(() => {
        if (!cancelled) setAudio(null);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, unit, reciter]);

  const ready = content?.key === contentKey ? content : null;
  const audioReady = audio?.key === audioKey ? audio : null;
  // While the next surah/page loads, keep the previous one on screen, dimmed —
  // paging through the mushaf shouldn't flash a skeleton on every tap.
  const shown = ready ?? content;
  const errMsg = err?.key === contentKey ? err.msg : null;
  const loading = !shown && !errMsg;

  // Autoplay the first verse when playback rolls into the next surah or page.
  useEffect(() => {
    if (shouldAutoPlayFirstAyah.current && audioReady && audioReady.ayahs.length > 0) {
      shouldAutoPlayFirstAyah.current = false;
      playIdx(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioReady]);

  // Escape or a click elsewhere dismisses the translation bubble — on touch
  // there is no pointer-leave to close it with.
  useEffect(() => {
    if (!anchor) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAnchor(null);
    };
    const onDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest('[role="tooltip"]') || el?.closest("[data-ayah]")) return;
      setAnchor(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [anchor]);

  // Lock the page behind the mobile sheet so only the sheet scrolls.
  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sheetOpen]);

  const surahMeta = surahs?.find((s) => s.number === surahNumber);
  const currentJuz = shown?.arabic[0]?.juz;
  const transIsRtl = transEdition.startsWith("ar");

  /** Split the loaded verses into per-surah runs. */
  const segments: Segment[] = [];
  shown?.arabic.forEach((ayah, i) => {
    const s = ayah.surah ?? (shown.mode === "surah" ? surahMeta : undefined);
    const last = segments.at(-1);
    if (last && last.surah?.number === s?.number) last.items.push({ ayah, i });
    else segments.push({ key: `${s?.number ?? "x"}-${i}`, surah: s, items: [{ ayah, i }] });
  });

  const labelFor = (i: number) => {
    const a = shown?.arabic[i];
    return t.verseRef(a?.surah?.number ?? surahNumber, a?.numberInSurah ?? i + 1);
  };

  const focusIdx = playingIdx ?? activeIdx ?? 0;
  const headerSurah = segments[0]?.surah;

  function resetPlayback() {
    audioRef.current?.pause();
    setIsPlaying(false);
    setPlayingIdx(null);
    setActiveIdx(null);
    setAnchor(null);
    setCurrentTime(0);
    setDuration(0);
  }

  function goToSurah(n: number) {
    const next = Math.min(114, Math.max(1, n));
    if (mode === "surah" && next === surahNumber) return;
    resetPlayback();
    setMode("surah");
    setSurahNumber(next);
  }

  function goToPage(n: number) {
    const next = Math.min(TOTAL_PAGES, Math.max(1, n));
    if (mode === "page" && next === pageNumber) return;
    resetPlayback();
    setMode("page");
    setPageNumber(next);
  }

  /** Switching browse mode keeps your place: surah → the page the current
   * verse sits on, page → the surah that verse belongs to. */
  function switchMode(next: BrowseMode) {
    if (next === mode) return;
    const at = shown?.arabic[focusIdx];
    if (next === "page") goToPage(at?.page ?? 1);
    else goToSurah(at?.surah?.number ?? surahNumber);
  }

  function playIdx(idx: number) {
    const src = audioReady?.ayahs[idx]?.audio;
    const el = audioRef.current;
    if (!src || !el) return;
    el.src = src;
    el.playbackRate = speed;
    el.muted = isMuted;
    void el.play().catch(() => {});
    setPlayingIdx(idx);
    setActiveIdx(idx);
    // Follow along: park the translation bubble on the verse being recited.
    if (transMode !== "off") {
      if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
      setAnchor({ idx, rect: 0, xRatio: 0.5 });
    }
    document
      .getElementById(`ayah-${idx}`)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }

  function togglePlay() {
    if (isPlaying) audioRef.current?.pause();
    else playIdx(playingIdx ?? activeIdx ?? 0);
  }

  function cycleSpeed() {
    applySpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]);
  }

  function applySpeed(v: number) {
    setSpeed(v);
    if (audioRef.current) audioRef.current.playbackRate = v;
  }

  function toggleMute() {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  }

  function cycleRepeat() {
    setRepeatMode((prev) => (prev === "off" ? "ayah" : prev === "ayah" ? "surah" : "off"));
  }

  /** Step to the neighbouring surah or page and pick the recitation back up.
   * Returns false at the very start or end of the mushaf. */
  function stepUnit(dir: 1 | -1) {
    const next = (mode === "surah" ? surahNumber : pageNumber) + dir;
    const max = mode === "surah" ? 114 : TOTAL_PAGES;
    if (next < 1 || next > max) return false;
    shouldAutoPlayFirstAyah.current = true;
    if (mode === "surah") goToSurah(next);
    else goToPage(next);
    return true;
  }

  function prevAyah() {
    if (playingIdx !== null && playingIdx > 0) playIdx(playingIdx - 1);
    else stepUnit(-1);
  }

  function nextAyah() {
    if (audioReady && playingIdx !== null && playingIdx < audioReady.ayahs.length - 1) {
      playIdx(playingIdx + 1);
    } else {
      stepUnit(1);
    }
  }

  function onEnded() {
    if (repeatMode === "ayah" && playingIdx !== null) {
      playIdx(playingIdx);
      return;
    }
    const next = (playingIdx ?? -1) + 1;
    if (audioReady && next < audioReady.ayahs.length) playIdx(next);
    else if (repeatMode === "surah") playIdx(0);
    else if (!stepUnit(1)) {
      setIsPlaying(false);
      setPlayingIdx(null);
    }
  }

  function onSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (!audioReady || audioReady.ayahs.length === 0) return;
    const targetIdx = Math.min(audioReady.ayahs.length - 1, Math.max(0, Math.floor(val)));
    const fraction = val - targetIdx;

    if (targetIdx !== playingIdx) {
      playIdx(targetIdx);
      setTimeout(() => {
        if (audioRef.current?.duration) {
          audioRef.current.currentTime = fraction * audioRef.current.duration;
        }
      }, 100);
    } else if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = fraction * duration;
      setCurrentTime(fraction * duration);
    }
  }

  // ---- translation bubble ----

  function openTip(i: number, e: React.MouseEvent<HTMLElement>) {
    if (transMode === "off") return;
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    setActiveIdx(i);
    setAnchor(anchorFromEvent(i, e));
  }

  function scheduleTipClose() {
    if (transMode !== "hover") return;
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = setTimeout(() => setAnchor(null), 220);
  }

  function cancelTipClose() {
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
  }

  const metaLine =
    mode === "surah"
      ? surahMeta
        ? `${surahMeta.englishName} · ${t.revelation[surahMeta.revelationType] ?? surahMeta.revelationType} · ${surahMeta.numberOfAyahs} ${t.ayahs}`
        : ""
      : `${t.pageOf(pageNumber, TOTAL_PAGES)}${currentJuz ? ` · ${t.juz(currentJuz)}` : ""}`;

  const q: QuranUi = {
    t,
    surahs,
    mode,
    setMode: switchMode,
    surahNumber,
    pageNumber,
    goToSurah,
    goToPage,
    metaLine,
    verseLabel: labelFor(focusIdx),
    reciter,
    setReciter: (id) => {
      audioRef.current?.pause();
      setIsPlaying(false);
      setReciter(id);
    },
    transEdition,
    setTransEdition,
    transMode,
    setTransMode: (m) => {
      setTransMode(m);
      if (m === "off") setAnchor(null);
    },
    scale,
    setScale,
    speed,
    setSpeed: applySpeed,
    cycleSpeed,
    repeatMode,
    cycleRepeat,
    isMuted,
    toggleMute,
    isPlaying,
    canPlay: !!audioReady,
    togglePlay,
    prevAyah,
    nextAyah,
    playingIdx,
    totalAyahs: audioReady?.ayahs.length ?? shown?.arabic.length ?? 1,
    currentTime,
    duration,
    onSeek,
  };

  const tipText = anchor ? ready?.translation[anchor.idx]?.text : undefined;

  return (
    <ToolShell icon="ph:book-open-text" title={t.title} side={t.side} intro={t.intro} wide>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-6">
        {/* ---- the mushaf ---- */}
        <div className="min-w-0">
          {listError ? <p className="mb-4 text-sm text-red-600 dark:text-red-400">{t.errList}</p> : null}
          {errMsg ? <p className="mb-4 text-sm text-red-600 dark:text-red-400">{errMsg}</p> : null}
          {loading && !listError ? (
            <div className="h-96 animate-pulse rounded-3xl bg-zinc-100 dark:bg-zinc-900" aria-hidden="true" />
          ) : null}

          {shown ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={shown.key}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                aria-busy={ready ? undefined : true}
                className={`relative overflow-hidden rounded-2xl border-2 border-emerald-700/25 bg-[#fbfaf2] p-2 transition-opacity dark:border-emerald-400/20 dark:bg-zinc-900/60 ${
                  ready ? "" : "opacity-50"
                }`}
              >
                <StarField className="pointer-events-none absolute inset-0 size-full text-emerald-800/[0.05] dark:text-emerald-400/[0.06]" />
                <div className="relative  px-2 py-4 sm:px-10 ">
                  {segments.map((seg, si) => {
                    const startsSurah = seg.items[0]?.ayah.numberInSurah === 1;
                    const showBismillah =
                      startsSurah && seg.surah?.number !== 1 && seg.surah?.number !== 9;
                    return (
                      <div key={seg.key} className={si > 0 ? "mt-10" : ""}>
                        {seg.surah && startsSurah ? (
                          <>
                            {/* surah header cartouche */}
                            <div className="flex items-center justify-center gap-3">
                              <Star8 className="size-5 shrink-0 text-amber-500/70 dark:text-amber-300/60" />
                              <div className="rounded-2xl border border-emerald-700/30 bg-emerald-50/70 px-6 py-2 dark:border-emerald-400/25 dark:bg-emerald-500/10">
                                <span
                                  lang="ar"
                                  dir="rtl"
                                  className="font-arabic text-3xl text-emerald-800 sm:text-4xl dark:text-emerald-300"
                                >
                                  {seg.surah.name}
                                </span>
                              </div>
                              <Star8 className="size-5 shrink-0 text-amber-500/70 dark:text-amber-300/60" />
                            </div>
                            <p className={`mt-3 text-center text-sm ${mutedCls}`}>
                              {seg.surah.englishName} ·{" "}
                              {t.revelation[seg.surah.revelationType] ?? seg.surah.revelationType} ·{" "}
                              {seg.surah.numberOfAyahs} {t.ayahs}
                            </p>
                          </>
                        ) : seg.surah ? (
                          // a surah carried over from the previous page
                          <div className="flex items-center justify-center gap-3">
                            <span className="h-px flex-1 bg-emerald-700/15 dark:bg-emerald-400/15" />
                            <span lang="ar" dir="rtl" className={`font-arabic text-lg ${mutedCls}`}>
                              {seg.surah.name}
                              {si === 0 ? ` — ${t.continued}` : ""}
                            </span>
                            <span className="h-px flex-1 bg-emerald-700/15 dark:bg-emerald-400/15" />
                          </div>
                        ) : null}

                        {showBismillah ? (
                          <p
                            lang="ar"
                            dir="rtl"
                            className="mt-7 text-center font-arabic text-2xl text-emerald-900 sm:text-3xl dark:text-emerald-200"
                          >
                            {BISMILLAH}
                          </p>
                        ) : null}

                        {/* flowing Uthmani text — each verse hoverable/tappable */}
                        <div
                          lang="ar"
                          dir="rtl"
                          className="mt-7 text-right font-arabic text-zinc-900 dark:text-zinc-100"
                          style={{ fontSize: `${1.7 * scale}rem`, lineHeight: 2.35 }}
                        >
                          {seg.items.map(({ ayah, i }) => {
                            const text =
                              ayah.numberInSurah === 1 && showBismillah
                                ? stripLeadingBasmala(ayah.text)
                                : ayah.text;
                            const on = i === activeIdx || i === playingIdx;
                            return (
                              <span
                                key={`${seg.key}-${ayah.numberInSurah}`}
                                id={`ayah-${i}`}
                                data-ayah={i}
                                onMouseEnter={transMode === "hover" ? (e) => openTip(i, e) : undefined}
                                onMouseLeave={transMode === "hover" ? scheduleTipClose : undefined}
                                onClick={transMode !== "off" ? (e) => openTip(i, e) : undefined}
                                className={`rounded-lg px-0.5 transition-colors ${
                                  transMode !== "off" ? "cursor-pointer" : ""
                                } ${
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
                    );
                  })}

                  {shown.mode === "page" ? (
                    <p className={`mt-8 text-center text-sm ${goldCls}`}>﴿ {toArabicNum(shown.unit)} ﴾</p>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}

          {/* discoverability hint for the translation bubble */}
          {shown && transMode !== "off" && !anchor ? (
            <p className={`mt-4 flex items-center justify-center gap-2 text-xs ${mutedCls}`}>
              <Icon icon="ph:hand-pointing" className="size-4" />
              {transMode === "hover" ? t.hoverHint : t.clickHint}
            </p>
          ) : null}
        </div>

        {/* ---- desktop sidebar ---- */}
        <aside className="hidden lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pb-2">
          <ControlsPanel q={q} />
        </aside>
      </div>

      {/* keeps the page footer clear of the fixed mobile bar */}
      <div className="h-20 lg:hidden" aria-hidden="true" />

      {/* ---- mobile: one bar with the controls and the player ---- */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t ${lineCls} bg-white/95 backdrop-blur-md lg:hidden dark:bg-zinc-950/95`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <SeekBar q={q} className="m-0 block h-1 w-full rounded-none" />
        <div className="flex items-center gap-2 px-3 py-2">
          <button
            type="button"
            onClick={prevAyah}
            disabled={!audioReady}
            aria-label={t.prevAyah}
            className={`size-9 shrink-0 ${iconBtnCls}`}
          >
            <Icon icon="ph:skip-back-fill" className="size-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            disabled={!audioReady}
            aria-label={isPlaying ? t.pause : t.playSurah}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-700 text-white shadow-lg shadow-emerald-700/25 disabled:opacity-50 dark:bg-emerald-400 dark:text-emerald-950"
          >
            <Icon icon={isPlaying ? "ph:pause-fill" : "ph:play-fill"} className="size-5" />
          </button>
          <button
            type="button"
            onClick={nextAyah}
            disabled={!audioReady}
            aria-label={t.nextAyah}
            className={`size-9 shrink-0 ${iconBtnCls}`}
          >
            <Icon icon="ph:skip-forward-fill" className="size-4 rtl:rotate-180" />
          </button>

          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              <span lang="ar" dir="rtl" className="font-arabic">
                {headerSurah?.name ?? ""}
              </span>
              {playingIdx !== null ? <span className={goldCls}> · {labelFor(playingIdx)}</span> : null}
            </p>
            <p className={`truncate text-[11px] ${mutedCls}`}>
              {mode === "page"
                ? `${t.pageOf(pageNumber, TOTAL_PAGES)}${currentJuz ? ` · ${t.juz(currentJuz)}` : ""}`
                : (RECITERS.find((r) => r.id === reciter)?.name ?? "")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label={t.openControls}
            aria-expanded={sheetOpen}
            className={`size-9 shrink-0 ${iconBtnCls}`}
          >
            <Icon icon="ph:sliders-horizontal" className="size-4" />
          </button>
        </div>
      </div>

      {/* ---- mobile controls sheet ---- */}
      <AnimatePresence>
        {sheetOpen ? (
          <>
            <motion.button
              key="backdrop"
              type="button"
              tabIndex={-1}
              aria-label={t.close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label={t.controls}
              initial={reduce ? { opacity: 0 } : { y: "100%" }}
              animate={reduce ? { opacity: 1 } : { y: 0 }}
              exit={reduce ? { opacity: 0 } : { y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className={`fixed inset-x-0 bottom-0 z-50 max-h-[86vh] overflow-y-auto rounded-t-3xl border-t ${lineCls} bg-zinc-50 px-4 pt-3 pb-8 lg:hidden dark:bg-zinc-950`}
            >
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="mb-3 flex items-center justify-between">
                <p className="font-display text-lg">{t.controls}</p>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label={t.close}
                  className={`size-8 ${iconBtnCls}`}
                >
                  <Icon icon="ph:x" className="size-4" />
                </button>
              </div>
              <ControlsPanel q={q} />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      {/* ---- the translation, as a bubble on the verse itself ---- */}
      {anchor && tipText ? (
        <AyahTooltip
          anchor={anchor}
          label={labelFor(anchor.idx)}
          text={tipText}
          lang={transIsRtl ? "ar" : transEdition.split(".")[0]}
          dir={transIsRtl ? "rtl" : "ltr"}
          playing={playingIdx === anchor.idx && isPlaying}
          canPlay={!!audioReady}
          dismissible={transMode === "click"}
          playLabel={t.playVerse}
          closeLabel={t.close}
          onTogglePlay={() =>
            playingIdx === anchor.idx && isPlaying ? audioRef.current?.pause() : playIdx(anchor.idx)
          }
          onClose={() => setAnchor(null)}
          onPointerEnter={cancelTipClose}
          onPointerLeave={scheduleTipClose}
          reduce={reduce}
        />
      ) : null}

      <audio
        ref={audioRef}
        onEnded={onEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        hidden
      />
    </ToolShell>
  );
}
