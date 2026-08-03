"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useDict, useLocale } from "@/components/locale";
import { goldCls, lineCls, mutedCls, Star8, StarField, ToolShell } from "@/components/ui";
import { stripLeadingBasmala } from "@/lib/arabic";
import { SURAHS, type SurahMeta, TOTAL_PAGES } from "@/lib/quran-meta";
import {
  type BrowseMode,
  fetchUnitTranslation,
  type ReaderAyah,
  type ReaderUnit,
  RECITERS,
  SPEEDS,
  audioUrl,
  unitOf,
  unitPath,
} from "@/lib/quran-reader";
import { type Anchor, anchorFromEvent, AyahTooltip } from "./ayah-tooltip";
import { ControlsPanel, iconBtnCls, type QuranUi, SeekBar, type TransMode } from "./controls";

const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const toArabicNum = (n: number) =>
  String(n)
    .split("")
    .map((c) => AR_DIGITS[Number(c)] ?? c)
    .join("");

/** Set just before navigating to the next unit, so the recitation picks back
 * up on the other side. sessionStorage survives the navigation; React state
 * does not. */
const AUTOPLAY_KEY = "falah:quran:autoplay";

/** Same trick for the follow-along preference: the recitation rolls into the
 * next unit on its own, and a toggle that quietly reset itself there would
 * read as a bug rather than a default. sessionStorage is the source of truth
 * rather than a copy of it, so there is no state to fall out of sync. */
const FOLLOW_KEY = "falah:quran:followtrans";

const followListeners = new Set<() => void>();

function subscribeFollow(cb: () => void) {
  followListeners.add(cb);
  return () => {
    followListeners.delete(cb);
  };
}

function getFollow() {
  try {
    return sessionStorage.getItem(FOLLOW_KEY) === "1";
  } catch {
    // sessionStorage unavailable (private mode, etc.) — the default holds.
    return false;
  }
}

/** Prerendered HTML can't know the preference; it starts off, like a fresh visit. */
function getFollowOnServer() {
  return false;
}

function setFollow(on: boolean) {
  try {
    sessionStorage.setItem(FOLLOW_KEY, on ? "1" : "0");
  } catch {}
  for (const cb of followListeners) cb();
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

/** A run of consecutive verses from one surah — a juz, hizb or mushaf page
 * routinely straddles two, so the text is drawn in runs. */
type Segment = { key: string; surah: SurahMeta; items: { ayah: ReaderAyah; i: number }[] };

export default function QuranClient({
  unit,
  heading,
  children,
  isHub,
}: {
  unit: ReaderUnit;
  /** H1, Arabic ornament and intro prose for this URL — built server-side
   * from the same strings the <title> and meta description use. */
  heading: { title: string; side: string; intro: string };
  /** Server-rendered links (the hub directory, or a unit's related units) —
   * already HTML, so crawlers see them without running any JavaScript. */
  children?: React.ReactNode;
  /** Whether this is the root hub page (prevents auto-overwriting memory with Surah 1) */
  isHub?: boolean;
}) {
  const d = useDict();
  const locale = useLocale();
  const t = d.tools.quran;
  const reduce = useReducedMotion();
  const router = useRouter();

  const [reciter, setReciter] = useState(RECITERS[0].id);
  const [transEdition, setTransEdition] = useState(unit.edition);
  const [transMode, setTransMode] = useState<TransMode>("click");
  const [scale, setScale] = useState(1);
  const [speed, setSpeed] = useState(1);

  /** Only set when the reader switches away from the edition this page was
   * built with; otherwise the prerendered translation is used as-is. */
  const [override, setOverride] = useState<{ edition: string; texts: string[] } | null>(null);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "ayah" | "surah">("off");
  const [sheetOpen, setSheetOpen] = useState(false);

  /** Off by default: a bubble that opens itself on every verse covers the
   * mushaf you came to read. Listeners who do want to read along turn it on
   * in the player, and it follows the recitation from there — across the
   * navigation into the next unit included. */
  const followTrans = useSyncExternalStore(subscribeFollow, getFollow, getFollowOnServer);

  const audioRef = useRef<HTMLAudioElement>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ayahs = unit.ayahs;

  // A different translation is the one thing still worth a network call.
  useEffect(() => {
    // The prerendered edition needs no fetch; translationAt() already ignores
    // a stale override, so there is nothing to reset here.
    if (transEdition === unit.edition) return;
    let cancelled = false;
    fetchUnitTranslation(unit.mode, unit.n, transEdition)
      .then((texts) => {
        if (!cancelled && texts.length === ayahs.length) {
          setOverride({ edition: transEdition, texts });
        }
      })
      .catch(() => {
        if (!cancelled) setOverride(null);
      });
    return () => {
      cancelled = true;
    };
  }, [transEdition, unit.edition, unit.mode, unit.n, ayahs.length]);

  const translationAt = (i: number) =>
    override?.edition === transEdition ? (override.texts[i] ?? "") : (ayahs[i]?.translation ?? "");

  // Resume the recitation after rolling into the next surah, juz, hizb or page.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(AUTOPLAY_KEY) !== "1") return;
    sessionStorage.removeItem(AUTOPLAY_KEY);
    playIdx(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restoredUnit = useRef("");

  // Save and restore the current reading location so other features can resume
  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentUnitKey = `${unit.mode}-${unit.n}`;
    let didRestore = false;

    // Try to restore on first visit to this unit
    if (!isHub && restoredUnit.current !== currentUnitKey) {
      restoredUnit.current = currentUnitKey;
      try {
        const read = localStorage.getItem("falah:quran:last-read");
        if (read) {
          const parsed = JSON.parse(read);
          if (parsed.mode === unit.mode && parsed.n === unit.n && parsed.ayah) {
            const idx = ayahs.findIndex((a) => a.ayah === parsed.ayah);
            if (idx !== -1) {
              setTimeout(() => {
                setActiveIdx(idx);
                document
                  .getElementById(`ayah-${idx}`)
                  ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
              }, 100);
              didRestore = true;
            }
          }
        }
      } catch {}
    }

    // Do not overwrite memory with Surah 1 just because they visited the hub,
    // unless they actually interact with the text (play audio or click verse).
    if (isHub && activeIdx === null && playingIdx === null) return;

    // Skip saving on the exact render we restored, so we don't save a stale activeIdx
    if (didRestore) return;

    const idx = activeIdx ?? playingIdx ?? 0;
    const ayah = ayahs[idx]?.ayah;

    localStorage.setItem(
      "falah:quran:last-read",
      JSON.stringify({ mode: unit.mode, n: unit.n, ayah, timestamp: Date.now() })
    );
  }, [unit.mode, unit.n, isHub, activeIdx, playingIdx, ayahs, reduce]);

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

  const transIsRtl = transEdition.startsWith("ar");
  const currentJuz = ayahs[0]?.juz;

  /** Split the loaded verses into per-surah runs. */
  const segments: Segment[] = [];
  for (const [i, ayah] of ayahs.entries()) {
    const surah = SURAHS[ayah.surah - 1];
    const last = segments.at(-1);
    if (last && last.surah.n === surah.n) last.items.push({ ayah, i });
    else segments.push({ key: `${surah.n}-${i}`, surah, items: [{ ayah, i }] });
  }

  const labelFor = (i: number) => {
    const a = ayahs[i];
    return t.verseRef(a?.surah ?? 1, a?.ayah ?? i + 1);
  };

  const focusIdx = playingIdx ?? activeIdx ?? 0;
  const headerSurah = segments[0]?.surah;

  // ---- navigation: every unit is a URL ----

  function goTo(mode: BrowseMode, n: number, autoplay = false) {
    if (mode === unit.mode && n === unit.n) return;
    audioRef.current?.pause();
    if (autoplay) sessionStorage.setItem(AUTOPLAY_KEY, "1");
    router.push(unitPath(locale, mode, n));
  }

  /** Switching the browse mode keeps your place: whichever verse you are on
   * decides which juz / hizb / page / surah you land in. */
  function switchMode(next: BrowseMode) {
    if (next === unit.mode) return;
    const at = ayahs[focusIdx] ?? ayahs[0];
    goTo(next, at ? unitOf(next, at) : 1);
  }

  /** Step to the neighbouring unit, carrying the recitation with it. Returns
   * false at the very start or end of the mushaf. */
  function stepUnit(dir: 1 | -1, autoplay = false) {
    const next = unit.n + dir;
    if (next < 1 || next > (unit.mode === "surah" ? 114 : Infinity)) return false;
    goTo(unit.mode, next, autoplay);
    return true;
  }

  // ---- playback ----

  function playIdx(idx: number) {
    const a = ayahs[idx];
    const el = audioRef.current;
    if (!a || !el) return;
    el.src = audioUrl(reciter, a.n);
    el.playbackRate = speed;
    el.muted = isMuted;
    void el.play().catch(() => { });
    setPlayingIdx(idx);
    setActiveIdx(idx);
    // Follow along: park the translation bubble on the verse being recited —
    // only for readers who asked for it in the player. Read straight from the
    // store: the autoplay effect calls this on mount, before the subscription
    // has had a chance to re-render with the restored value.
    if (getFollow() && transMode !== "off") {
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

  function applySpeed(v: number) {
    setSpeed(v);
    if (audioRef.current) audioRef.current.playbackRate = v;
  }

  function toggleMute() {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  }

  function prevAyah() {
    if (playingIdx !== null && playingIdx > 0) playIdx(playingIdx - 1);
    else stepUnit(-1, true);
  }

  function nextAyah() {
    if (playingIdx !== null && playingIdx < ayahs.length - 1) playIdx(playingIdx + 1);
    else stepUnit(1, true);
  }

  function onEnded() {
    if (repeatMode === "ayah" && playingIdx !== null) {
      playIdx(playingIdx);
      return;
    }
    const next = (playingIdx ?? -1) + 1;
    if (next < ayahs.length) playIdx(next);
    else if (repeatMode === "surah") playIdx(0);
    else if (!stepUnit(1, true)) {
      setIsPlaying(false);
      setPlayingIdx(null);
    }
  }

  function onSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (ayahs.length === 0) return;
    const targetIdx = Math.min(ayahs.length - 1, Math.max(0, Math.floor(val)));
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

  const q: QuranUi = {
    t,
    b: d.quranBrowse,
    locale,
    mode: unit.mode,
    n: unit.n,
    setMode: switchMode,
    goTo: (mode, n) => goTo(mode, n),
    metaLine: unitMeta(),
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
    followTrans,
    toggleFollowTrans: () => {
      const next = !followTrans;
      setFollow(next);
      // Reflect the choice on the verse being recited right away, rather than
      // making the reader wait for the next one to start.
      if (!next) setAnchor(null);
      else if (playingIdx !== null && transMode !== "off") {
        setAnchor({ idx: playingIdx, rect: 0, xRatio: 0.5 });
      }
    },
    scale,
    setScale,
    speed,
    setSpeed: applySpeed,
    cycleSpeed: () => applySpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]),
    repeatMode,
    cycleRepeat: () =>
      setRepeatMode((p) => (p === "off" ? "ayah" : p === "ayah" ? "surah" : "off")),
    isMuted,
    toggleMute,
    isPlaying,
    canPlay: ayahs.length > 0,
    togglePlay,
    prevAyah,
    nextAyah,
    playingIdx,
    totalAyahs: ayahs.length,
    currentTime,
    duration,
    onSeek,
  };

  function unitMeta() {
    const b = d.quranBrowse;
    if (unit.mode === "surah") {
      const s = SURAHS[unit.n - 1];
      const rev = s.revelation === "Meccan" ? b.meccan : b.medinan;
      return `${rev} · ${b.ayahCount(s.ayahs)} · ${b.juz} ${s.juz}`;
    }
    if (unit.mode === "page") {
      return `${b.page} ${unit.n} / ${TOTAL_PAGES} · ${b.juz} ${currentJuz ?? 1}`;
    }
    if (unit.mode === "hizb") {
      return `${b.juz} ${Math.ceil(unit.n / 2)} · ${b.ayahCount(ayahs.length)}`;
    }
    return `${b.ayahCount(ayahs.length)} · ${b.hizb} ${ayahs[0]?.hizb ?? 1}`;
  }

  const tipText = anchor ? translationAt(anchor.idx) : undefined;

  return (
    <ToolShell
      icon="ph:book-open-text"
      title={heading.title}
      side={heading.side}
      intro={heading.intro}
      wide
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-6">
        {/* ---- the mushaf ---- */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${unit.mode}-${unit.n}`}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-2xl border-2 border-emerald-700/25 bg-[#fbfaf2] p-2 dark:border-emerald-400/20 dark:bg-zinc-900/60"
            >
              <StarField className="pointer-events-none absolute inset-0 size-full text-emerald-800/[0.05] dark:text-emerald-400/[0.06]" />
              <div className="relative px-2 py-4 sm:px-10">
                {segments.map((seg, si) => {
                  const startsSurah = seg.items[0]?.ayah.ayah === 1;
                  const showBismillah = startsSurah && seg.surah.n !== 1 && seg.surah.n !== 9;
                  return (
                    <div key={seg.key} className={si > 0 ? "mt-10" : ""}>
                      {startsSurah ? (
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
                                {seg.surah.arabic}
                              </span>
                            </div>
                            <Star8 className="size-5 shrink-0 text-amber-500/70 dark:text-amber-300/60" />
                          </div>
                          <p className={`mt-3 text-center text-sm ${mutedCls}`}>
                            {seg.surah.translit} ·{" "}
                            {t.revelation[seg.surah.revelation] ?? seg.surah.revelation} ·{" "}
                            {seg.surah.ayahs} {t.ayahs}
                          </p>
                        </>
                      ) : (
                        // a surah carried over from the previous unit
                        <div className="flex items-center justify-center gap-3">
                          <span className="h-px flex-1 bg-emerald-700/15 dark:bg-emerald-400/15" />
                          <span lang="ar" dir="rtl" className={`font-arabic text-lg ${mutedCls}`}>
                            {seg.surah.arabic}
                            {si === 0 ? ` — ${t.continued}` : ""}
                          </span>
                          <span className="h-px flex-1 bg-emerald-700/15 dark:bg-emerald-400/15" />
                        </div>
                      )}

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
                            ayah.ayah === 1 && showBismillah
                              ? stripLeadingBasmala(ayah.arabic)
                              : ayah.arabic;
                          const on = i === activeIdx || i === playingIdx;
                          return (
                            <span
                              key={ayah.n}
                              id={`ayah-${i}`}
                              data-ayah={i}
                              onMouseEnter={transMode === "hover" ? (e) => openTip(i, e) : undefined}
                              onMouseLeave={transMode === "hover" ? scheduleTipClose : undefined}
                              onClick={transMode !== "off" ? (e) => openTip(i, e) : undefined}
                              className={`rounded-lg px-0.5 transition-colors ${transMode !== "off" ? "cursor-pointer" : ""
                                } ${on
                                  ? "bg-emerald-200/70 dark:bg-emerald-400/25"
                                  : "hover:bg-emerald-100/60 dark:hover:bg-emerald-500/10"
                                }`}
                            >
                              {text}
                              <AyahMark n={ayah.ayah} />{" "}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {unit.mode === "page" ? (
                  <p className={`mt-8 text-center text-sm ${goldCls}`}>﴿ {toArabicNum(unit.n)} ﴾</p>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* discoverability hint for the translation bubble */}
          {transMode !== "off" && !anchor ? (
            <p className={`mt-4 flex items-center justify-center gap-2 text-xs ${mutedCls}`}>
              <Icon icon="ph:hand-pointing" className="size-4" />
              {transMode === "hover" ? t.hoverHint : t.clickHint}
            </p>
          ) : null}

          {/* The tooltip is the reading experience, but it only exists after a
              pointer event — so the translation also ships as real text here,
              where a crawler (and anyone who prefers a list) can read it. */}
          <details className={`mt-6 rounded-2xl border ${lineCls} p-4`}>
            <summary className="cursor-pointer text-sm font-semibold">
              {d.quranBrowse.translationList}
            </summary>
            <ol className="mt-4 space-y-4">
              {ayahs.map((a, i) => (
                <li key={a.n} className="flex gap-3">
                  <span className={`shrink-0 font-mono text-xs ${goldCls}`}>
                    {a.surah}:{a.ayah}
                  </span>
                  <p
                    lang={transIsRtl ? "ar" : transEdition.split(".")[0]}
                    dir={transIsRtl ? "rtl" : "ltr"}
                    className={`leading-relaxed ${mutedCls} ${transIsRtl ? "text-right font-arabic text-base" : "text-sm"
                      }`}
                  >
                    {translationAt(i)}
                  </p>
                </li>
              ))}
            </ol>
          </details>
        </div>

        {/* ---- desktop sidebar ---- */}
        <aside className="hidden lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pb-2">
          <ControlsPanel q={q} />
        </aside>
      </div>

      {children}

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
            aria-label={t.prevAyah}
            className={`size-9 shrink-0 ${iconBtnCls}`}
          >
            <Icon icon="ph:skip-back-fill" className="size-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? t.pause : t.playSurah}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-700 text-white shadow-lg shadow-emerald-700/25 dark:bg-emerald-400 dark:text-emerald-950"
          >
            <Icon icon={isPlaying ? "ph:pause-fill" : "ph:play-fill"} className="size-5" />
          </button>
          <button
            type="button"
            onClick={nextAyah}
            aria-label={t.nextAyah}
            className={`size-9 shrink-0 ${iconBtnCls}`}
          >
            <Icon icon="ph:skip-forward-fill" className="size-4 rtl:rotate-180" />
          </button>

          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              <span lang="ar" dir="rtl" className="font-arabic">
                {headerSurah?.arabic ?? ""}
              </span>
              {playingIdx !== null ? (
                <span className={goldCls}> · {labelFor(playingIdx)}</span>
              ) : null}
            </p>
            <p className={`truncate text-[11px] ${mutedCls}`}>
              {RECITERS.find((r) => r.id === reciter)?.name ?? ""}
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
              <ControlsPanel q={q} onNavigate={() => setSheetOpen(false)} />
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
          canPlay={ayahs.length > 0}
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

