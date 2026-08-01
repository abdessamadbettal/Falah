"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import { brandCls, cardCls, goldCls, lineCls, mutedCls, Select } from "@/components/ui";
import type { Dict, Locale } from "@/lib/i18n";
import { JUZ, SURAHS, TOTAL_PAGES } from "@/lib/quran-meta";
import {
  type BrowseMode,
  RECITERS,
  TRANSLATIONS,
  UNIT_TOTAL,
  unitPath,
} from "@/lib/quran-reader";

export type TransMode = "hover" | "click" | "off";
export type RepeatMode = "off" | "ayah" | "surah";

/** Everything the control surfaces need. The state lives in the reader; both
 * the desktop sidebar and the mobile sheet render from this one object so the
 * two never drift apart. */
export type QuranUi = {
  /** Reader chrome (reciter, speed, play…). */
  t: Dict["tools"]["quran"];
  /** Browse vocabulary (surah, juz, hizb, page…), shared with the SEO copy. */
  b: Dict["quranBrowse"];
  locale: Locale;
  /** Which division is being read, and which one of it. */
  mode: BrowseMode;
  n: number;
  setMode: (m: BrowseMode) => void;
  goTo: (mode: BrowseMode, n: number) => void;
  metaLine: string;
  verseLabel: string;
  reciter: string;
  setReciter: (id: string) => void;
  transEdition: string;
  setTransEdition: (id: string) => void;
  transMode: TransMode;
  setTransMode: (m: TransMode) => void;
  /** Opt-in: reveal each verse's translation as the reciter reaches it. */
  followTrans: boolean;
  toggleFollowTrans: () => void;
  scale: number;
  setScale: (next: (s: number) => number) => void;
  speed: number;
  setSpeed: (v: number) => void;
  cycleSpeed: () => void;
  repeatMode: RepeatMode;
  cycleRepeat: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  isPlaying: boolean;
  canPlay: boolean;
  togglePlay: () => void;
  prevAyah: () => void;
  nextAyah: () => void;
  playingIdx: number | null;
  totalAyahs: number;
  currentTime: number;
  duration: number;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function formatTime(sec: number) {
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

/** The neutral round icon button used across every control surface. */
export const iconBtnCls = `grid place-items-center rounded-full border ${lineCls} ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 disabled:opacity-40 dark:hover:border-emerald-400 dark:hover:text-emerald-400`;

function SectionTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <p
      className={`mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${mutedCls}`}
    >
      <Icon icon={icon} className={`size-3.5 ${brandCls}`} />
      {label}
    </p>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={`mb-1 block text-xs font-medium ${mutedCls}`}>{label}</span>
      {children}
    </label>
  );
}

function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
  compact = false,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  compact?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`flex items-center rounded-full border p-0.5 ${lineCls}`}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`flex-1 rounded-full py-1.5 font-medium transition-colors ${
            compact ? "px-2 text-[11px]" : "px-3 text-xs"
          } ${
            value === o.value
              ? "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-emerald-950"
              : `${mutedCls} hover:text-emerald-700 dark:hover:text-emerald-400`
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Page jump box: free typing while focused, committed on blur or Enter. */
function PageInput({ q, onNavigate }: { q: QuranUi; onNavigate?: () => void }) {
  const [draft, setDraft] = useState(String(q.n));
  // Re-sync when the page changes from elsewhere (arrows, mode switch).
  const [seen, setSeen] = useState(q.n);
  if (seen !== q.n) {
    setSeen(q.n);
    setDraft(String(q.n));
  }

  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n) && n >= 1 && n <= TOTAL_PAGES && n !== q.n) {
      onNavigate?.();
      q.goTo("page", n);
    } else if (n !== q.n) {
      setDraft(String(q.n));
    }
  };

  return (
    <div
      className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border ${lineCls} bg-white px-2 py-2 dark:bg-zinc-900`}
    >
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={TOTAL_PAGES}
        value={draft}
        aria-label={q.t.page}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
            commit();
          }
        }}
        className="w-12 [appearance:textfield] bg-transparent text-center text-sm font-semibold tabular-nums text-zinc-900 focus:outline-none dark:text-zinc-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <span className={`text-xs ${mutedCls}`}>/ {TOTAL_PAGES}</span>
    </div>
  );
}

/** Continuous scrubber across the whole unit: the value is
 * `verseIndex + fractionOfThatVerse`, so one drag walks the recitation. */
export function SeekBar({ q, className = "" }: { q: QuranUi; className?: string }) {
  const value = (q.playingIdx ?? 0) + (q.duration > 0 ? q.currentTime / q.duration : 0);
  return (
    <input
      type="range"
      min={0}
      max={q.totalAyahs || 1}
      step={0.01}
      value={value}
      onChange={q.onSeek}
      disabled={!q.canPlay}
      aria-label={q.verseLabel}
      dir="ltr"
      className={`cursor-pointer appearance-none rounded-full bg-zinc-200 accent-emerald-600 disabled:cursor-not-allowed dark:bg-zinc-800 dark:accent-emerald-400 ${className}`}
    />
  );
}

function ProgressRow({ q }: { q: QuranUi }) {
  const value = (q.playingIdx ?? 0) + (q.duration > 0 ? q.currentTime / q.duration : 0);
  const percent = q.totalAyahs ? Math.min(100, Math.round((value / q.totalAyahs) * 100)) : 0;
  return (
    <div className="flex items-center gap-2" dir="ltr">
      <span className="min-w-9 text-end text-[11px] font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
        {formatTime(q.currentTime)}
      </span>
      <SeekBar q={q} className="h-1.5 w-full" />
      <span className={`min-w-8 text-[11px] font-semibold tabular-nums ${mutedCls}`}>
        {percent}%
      </span>
    </div>
  );
}

/** Prev / play / next, plus speed, repeat and mute. */
export function Transport({ q }: { q: QuranUi }) {
  const { t } = q;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={q.prevAyah}
          disabled={!q.canPlay}
          aria-label={t.prevAyah}
          className={`size-9 ${iconBtnCls}`}
        >
          <Icon icon="ph:skip-back-fill" className="size-4 rtl:rotate-180" />
        </button>
        <button
          type="button"
          onClick={q.togglePlay}
          disabled={!q.canPlay}
          aria-label={q.isPlaying ? t.pause : t.playSurah}
          className="grid size-12 place-items-center rounded-full bg-emerald-700 text-white shadow-lg shadow-emerald-700/25 transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 dark:bg-emerald-400 dark:text-emerald-950 dark:shadow-emerald-400/20"
        >
          <Icon icon={q.isPlaying ? "ph:pause-fill" : "ph:play-fill"} className="size-5" />
        </button>
        <button
          type="button"
          onClick={q.nextAyah}
          disabled={!q.canPlay}
          aria-label={t.nextAyah}
          className={`size-9 ${iconBtnCls}`}
        >
          <Icon icon="ph:skip-forward-fill" className="size-4 rtl:rotate-180" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={q.cycleSpeed}
          title={t.speed}
          aria-label={`${t.speed}: ${q.speed}×`}
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${lineCls} ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
        >
          <Icon icon="ph:gauge" className="size-3.5" />
          {q.speed}×
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={q.cycleRepeat}
            title={
              q.repeatMode === "ayah"
                ? t.repeatAyah
                : q.repeatMode === "surah"
                  ? t.repeatSurah
                  : t.repeatOff
            }
            aria-label={
              q.repeatMode === "ayah"
                ? t.repeatAyah
                : q.repeatMode === "surah"
                  ? t.repeatSurah
                  : t.repeatOff
            }
            className={
              q.repeatMode !== "off"
                ? "grid size-8 place-items-center rounded-full border border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-400"
                : `size-8 ${iconBtnCls}`
            }
          >
            <Icon icon={q.repeatMode === "ayah" ? "ph:repeat-once" : "ph:repeat"} className="size-4" />
          </button>
          <button
            type="button"
            onClick={q.toggleMute}
            title={q.isMuted ? t.unmute : t.mute}
            aria-label={q.isMuted ? t.unmute : t.mute}
            className={`size-8 ${iconBtnCls} ${q.isMuted ? "text-red-500 dark:text-red-400" : ""}`}
          >
            <Icon
              icon={q.isMuted ? "ph:speaker-slash-fill" : "ph:speaker-high-fill"}
              className="size-4"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Prev / next stepper. Real <Link>s, so the neighbouring unit is a crawlable
 * URL and not just an onClick. */
function Stepper({
  q,
  onNavigate,
  children,
}: {
  q: QuranUi;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  const max = UNIT_TOTAL[q.mode];
  const arrow = (dir: -1 | 1) => {
    const n = q.n + dir;
    const disabled = n < 1 || n > max;
    const icon = dir === -1 ? "ph:caret-left" : "ph:caret-right";
    const label = dir === -1 ? q.b.prev : q.b.next;
    if (disabled) {
      return (
        <span aria-hidden="true" className={`size-10 shrink-0 opacity-40 ${iconBtnCls}`}>
          <Icon icon={icon} className="size-4 rtl:rotate-180" />
        </span>
      );
    }
    return (
      <Link
        href={unitPath(q.locale, q.mode, n)}
        onClick={onNavigate}
        aria-label={label}
        className={`size-10 shrink-0 ${iconBtnCls}`}
      >
        <Icon icon={icon} className="size-4 rtl:rotate-180" />
      </Link>
    );
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      {arrow(-1)}
      {children}
      {arrow(1)}
    </div>
  );
}

function NavigatorCard({ q, onNavigate }: { q: QuranUi; onNavigate?: () => void }) {
  const { b } = q;
  const isAr = q.locale === "ar";

  const pick = (n: number) => {
    onNavigate?.();
    q.goTo(q.mode, n);
  };

  return (
    <section className={`${cardCls} p-4`}>
      <SectionTitle icon="ph:compass" label={b.navigate} />
      <Segmented
        compact
        label={b.browseBy}
        value={q.mode}
        onChange={(m) => {
          onNavigate?.();
          q.setMode(m);
        }}
        options={[
          { value: "surah" as const, label: b.bySurah },
          { value: "juz" as const, label: b.byJuz },
          { value: "hizb" as const, label: b.byHizb },
          { value: "page" as const, label: b.byPage },
        ]}
      />

      <Stepper q={q} onNavigate={onNavigate}>
        {q.mode === "page" ? (
          <PageInput q={q} onNavigate={onNavigate} />
        ) : (
          <div className="min-w-0 flex-1">
            <Select
              value={q.n}
              onChange={(e) => pick(Number(e.target.value))}
              aria-label={q.mode === "surah" ? b.surah : q.mode === "juz" ? b.juz : b.hizb}
            >
              {q.mode === "surah"
                ? SURAHS.map((s) => (
                    <option key={s.n} value={s.n}>
                      {s.n}. {isAr ? s.arabic.replace(/^سُورَةُ\s*/, "") : s.translit}
                    </option>
                  ))
                : q.mode === "juz"
                  ? JUZ.map((j) => (
                      <option key={j.n} value={j.n}>
                        {b.juz} {j.n} · {isAr ? j.arabic : j.translit}
                      </option>
                    ))
                  : Array.from({ length: UNIT_TOTAL.hizb }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {b.hizb} {n}
                      </option>
                    ))}
            </Select>
          </div>
        )}
      </Stepper>

      <p className={`mt-3 text-xs ${mutedCls}`}>{q.metaLine}</p>
    </section>
  );
}

function RecitationCard({ q }: { q: QuranUi }) {
  const { t } = q;
  return (
    <section className={`${cardCls} p-4`}>
      <SectionTitle icon="ph:microphone-stage" label={t.recitation} />
      <FieldRow label={t.reciter}>
        <Select value={q.reciter} onChange={(e) => q.setReciter(e.target.value)}>
          {RECITERS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </Select>
      </FieldRow>

      <p className={`mt-3 text-xs font-semibold ${q.playingIdx !== null ? goldCls : mutedCls}`}>
        {q.playingIdx !== null ? q.verseLabel : t.nothingPlaying}
      </p>

      <div className="mt-2">
        <ProgressRow q={q} />
      </div>
      <div className="mt-3">
        <Transport q={q} />
      </div>

      <div className={`mt-4 border-t pt-3 ${lineCls}`}>
        <FollowTransToggle q={q} />
      </div>
    </section>
  );
}

/** Reading along is a preference, not a default — the bubble stays shut during
 * recitation until this is switched on. Meaningless while the translation is
 * hidden altogether, so it disables itself and says why. */
function FollowTransToggle({ q }: { q: QuranUi }) {
  const { t } = q;
  const disabled = q.transMode === "off";
  const on = q.followTrans && !disabled;
  return (
    <div className={`flex items-start justify-between gap-3 ${disabled ? "opacity-50" : ""}`}>
      <span className="min-w-0">
        <span className="block text-xs font-medium text-zinc-900 dark:text-zinc-100">
          {t.followTrans}
        </span>
        <span className={`mt-0.5 block text-[11px] leading-snug ${mutedCls}`}>
          {disabled ? t.offHint : t.followTransHint}
        </span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={t.followTrans}
        disabled={disabled}
        onClick={q.toggleFollowTrans}
        className={`mt-0.5 inline-flex h-6 w-10 shrink-0 items-center rounded-full border p-0.5 transition-colors disabled:cursor-not-allowed ${
          on
            ? "border-emerald-600 bg-emerald-600 dark:border-emerald-400 dark:bg-emerald-400"
            : `${lineCls} bg-zinc-200 dark:bg-zinc-800`
        }`}
      >
        <span
          className={`size-4 rounded-full bg-white shadow-sm transition-transform dark:bg-zinc-950 ${
            on ? "translate-x-4 rtl:-translate-x-4" : ""
          }`}
        />
      </button>
    </div>
  );
}

function ReadingCard({ q }: { q: QuranUi }) {
  const { t } = q;
  return (
    <section className={`${cardCls} p-4`}>
      <SectionTitle icon="ph:book-open-text" label={t.reading} />
      <FieldRow label={t.translation}>
        <Select value={q.transEdition} onChange={(e) => q.setTransEdition(e.target.value)}>
          {TRANSLATIONS.map((tr) => (
            <option key={tr.id} value={tr.id}>
              {tr.name}
            </option>
          ))}
        </Select>
      </FieldRow>

      <p className={`mt-3 mb-1 text-xs font-medium ${mutedCls}`}>{t.translationMode}</p>
      <Segmented
        label={t.translationMode}
        value={q.transMode}
        onChange={q.setTransMode}
        options={[
          { value: "hover" as const, label: t.modeHover },
          { value: "click" as const, label: t.modeClick },
          { value: "off" as const, label: t.modeOff },
        ]}
      />

      <p className={`mt-3 mb-1 text-xs font-medium ${mutedCls}`}>{t.textSize}</p>
      <div className={`flex items-center justify-between gap-1 rounded-full border p-1 ${lineCls}`}>
        <button
          type="button"
          onClick={() => q.setScale((s) => Math.max(0.7, +(s - 0.1).toFixed(2)))}
          disabled={q.scale <= 0.7}
          aria-label={`${t.textSize} −`}
          className={`size-7 ${iconBtnCls} border-transparent`}
        >
          <Icon icon="ph:text-aa" className="size-3" />
        </button>
        <span className={`text-xs tabular-nums ${mutedCls}`}>{Math.round(q.scale * 100)}%</span>
        <button
          type="button"
          onClick={() => q.setScale((s) => Math.min(1.8, +(s + 0.1).toFixed(2)))}
          disabled={q.scale >= 1.8}
          aria-label={`${t.textSize} +`}
          className={`size-7 ${iconBtnCls} border-transparent`}
        >
          <Icon icon="ph:text-aa" className="size-4" />
        </button>
      </div>
    </section>
  );
}

/** The full control stack — the desktop sidebar renders it as-is, the mobile
 * sheet renders the same thing inside a bottom drawer. */
export function ControlsPanel({ q, onNavigate }: { q: QuranUi; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <NavigatorCard q={q} onNavigate={onNavigate} />
      <RecitationCard q={q} />
      <ReadingCard q={q} />
    </div>
  );
}
