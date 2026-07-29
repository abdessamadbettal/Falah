"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { brandCls, cardCls, goldCls, lineCls, mutedCls, Select } from "@/components/ui";
import type { Dict } from "@/lib/i18n";
import { type Surah, TOTAL_PAGES } from "@/lib/quran";

/** A curated set of well-known reciters available on AlQuran.cloud. */
export const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy" },
  { id: "ar.husary", name: "Mahmoud Al-Husary" },
  { id: "ar.abdurrahmaansudais", name: "Abdul Rahman Al-Sudais" },
  { id: "ar.mahermuaiqly", name: "Maher Al-Muaiqly" },
  { id: "ar.shaatree", name: "Abu Bakr Al-Shatri" },
  { id: "ar.ahmedajamy", name: "Ahmed Al-Ajamy" },
  { id: "ar.hudhaify", name: "Ali Al-Hudhaify" },
  { id: "ar.abdulsamad", name: "Abdul Basit Abdul Samad" },
];

export const TRANSLATIONS = [
  { id: "en.sahih", name: "Saheeh International · EN" },
  { id: "en.pickthall", name: "Pickthall · EN" },
  { id: "en.yusufali", name: "Yusuf Ali · EN" },
  { id: "en.asad", name: "Muhammad Asad · EN" },
  { id: "en.transliteration", name: "Transliteration" },
  { id: "fr.hamidullah", name: "Hamidullah · FR" },
  { id: "ar.muyassar", name: "التفسير الميسّر · AR" },
];

export const SPEEDS = [0.75, 1, 1.25, 1.5];

export type BrowseMode = "surah" | "page";
export type TransMode = "hover" | "click" | "off";
export type RepeatMode = "off" | "ayah" | "surah";

/** Everything the control surfaces need. The state itself lives in the page
 * client; both the desktop sidebar and the mobile sheet render from this one
 * object so the two never drift apart. */
export type QuranUi = {
  t: Dict["tools"]["quran"];
  surahs: Surah[] | null;
  mode: BrowseMode;
  setMode: (m: BrowseMode) => void;
  surahNumber: number;
  pageNumber: number;
  goToSurah: (n: number) => void;
  goToPage: (n: number) => void;
  /** e.g. "Al-Baqara · Medinan · 286 ayahs" or "Page 3 of 604 · Juz 1". */
  metaLine: string;
  verseLabel: string;
  reciter: string;
  setReciter: (id: string) => void;
  transEdition: string;
  setTransEdition: (id: string) => void;
  transMode: TransMode;
  setTransMode: (m: TransMode) => void;
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
    <p className={`mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${mutedCls}`}>
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
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div role="group" aria-label={label} className={`flex items-center rounded-full border p-0.5 ${lineCls}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
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
function PageInput({ q }: { q: QuranUi }) {
  const [draft, setDraft] = useState(String(q.pageNumber));
  // Re-sync when the page changes from elsewhere (arrows, mode switch).
  const [seen, setSeen] = useState(q.pageNumber);
  if (seen !== q.pageNumber) {
    setSeen(q.pageNumber);
    setDraft(String(q.pageNumber));
  }

  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n) && n >= 1 && n <= TOTAL_PAGES) q.goToPage(n);
    else setDraft(String(q.pageNumber));
  };

  return (
    <div className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border ${lineCls} bg-white px-2 py-2 dark:bg-zinc-900`}>
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

/** Continuous scrubber across the whole surah or page: the value is
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
      <span className={`min-w-8 text-[11px] font-semibold tabular-nums ${mutedCls}`}>{percent}%</span>
    </div>
  );
}

/** Prev / play / next, plus speed, repeat and mute. Shared by the desktop
 * sidebar and the mobile sheet. */
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
            title={q.repeatMode === "ayah" ? t.repeatAyah : q.repeatMode === "surah" ? t.repeatSurah : t.repeatOff}
            aria-label={q.repeatMode === "ayah" ? t.repeatAyah : q.repeatMode === "surah" ? t.repeatSurah : t.repeatOff}
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
            <Icon icon={q.isMuted ? "ph:speaker-slash-fill" : "ph:speaker-high-fill"} className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function NavigatorCard({ q }: { q: QuranUi }) {
  const { t } = q;
  return (
    <section className={`${cardCls} p-4`}>
      <SectionTitle icon="ph:compass" label={t.navigate} />
      <Segmented
        label={t.browseBy}
        value={q.mode}
        onChange={q.setMode}
        options={[
          { value: "surah", label: t.bySurah },
          { value: "page", label: t.byPage },
        ]}
      />

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => (q.mode === "surah" ? q.goToSurah(q.surahNumber - 1) : q.goToPage(q.pageNumber - 1))}
          disabled={q.mode === "surah" ? q.surahNumber <= 1 : q.pageNumber <= 1}
          aria-label={q.mode === "surah" ? t.prev : t.prevPage}
          className={`size-10 shrink-0 ${iconBtnCls}`}
        >
          <Icon icon="ph:caret-left" className="size-4 rtl:rotate-180" />
        </button>

        {q.mode === "surah" ? (
          <div className="min-w-0 flex-1">
            <Select
              value={q.surahNumber}
              onChange={(e) => q.goToSurah(Number(e.target.value))}
              disabled={!q.surahs}
              aria-label={t.surah}
            >
              {(q.surahs ?? []).map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.englishName}
                </option>
              ))}
            </Select>
          </div>
        ) : (
          <PageInput q={q} />
        )}

        <button
          type="button"
          onClick={() => (q.mode === "surah" ? q.goToSurah(q.surahNumber + 1) : q.goToPage(q.pageNumber + 1))}
          disabled={q.mode === "surah" ? q.surahNumber >= 114 : q.pageNumber >= TOTAL_PAGES}
          aria-label={q.mode === "surah" ? t.next : t.nextPage}
          className={`size-10 shrink-0 ${iconBtnCls}`}
        >
          <Icon icon="ph:caret-right" className="size-4 rtl:rotate-180" />
        </button>
      </div>

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
    </section>
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
          { value: "hover", label: t.modeHover },
          { value: "click", label: t.modeClick },
          { value: "off", label: t.modeOff },
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
export function ControlsPanel({ q }: { q: QuranUi }) {
  return (
    <div className="flex flex-col gap-4">
      <NavigatorCard q={q} />
      <RecitationCard q={q} />
      <ReadingCard q={q} />
    </div>
  );
}
