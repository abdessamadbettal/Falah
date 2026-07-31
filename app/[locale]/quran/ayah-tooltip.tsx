"use client";

import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { goldCls, lineCls, mutedCls } from "@/components/ui";

/** Where the tooltip hangs from. `rect` is the index of the verse's client
 * rect — a verse wraps across lines, so we remember which line was pointed at
 * — and `xRatio` the horizontal position within it. Both survive scrolling,
 * which lets the tooltip re-anchor itself instead of drifting away. */
export type Anchor = { idx: number; rect: number; xRatio: number };

/** Build an anchor from a pointer event on a verse. */
export function anchorFromEvent(idx: number, e: React.MouseEvent<HTMLElement>): Anchor {
  const rects = Array.from(e.currentTarget.getClientRects());
  const at = rects.findIndex((r) => e.clientY >= r.top && e.clientY <= r.bottom);
  const rect = at >= 0 ? at : 0;
  const r = rects[rect];
  const xRatio = r && r.width > 0 && e.clientX ? (e.clientX - r.left) / r.width : 0.5;
  return { idx, rect, xRatio: Math.min(0.9, Math.max(0.1, xRatio)) };
}

type Placement = "top" | "bottom";
const MARGIN = 12;
const GAP = 10;

export function AyahTooltip({
  anchor,
  label,
  text,
  lang,
  dir,
  playing,
  canPlay,
  dismissible,
  playLabel,
  closeLabel,
  onTogglePlay,
  onClose,
  onPointerEnter,
  onPointerLeave,
  reduce,
}: {
  anchor: Anchor;
  label: string;
  text: string;
  lang: string;
  dir: "rtl" | "ltr";
  playing: boolean;
  canPlay: boolean;
  dismissible: boolean;
  playLabel: string;
  closeLabel: string;
  onTogglePlay: () => void;
  onClose: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  reduce: boolean | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{
    left: number;
    top: number;
    arrow: number;
    place: Placement;
  } | null>(null);

  // Re-measure against the live verse rect: on mount, and on every scroll or
  // resize, so the bubble stays glued to its verse.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    const update = () => {
      const target = document.getElementById(`ayah-${anchor.idx}`);
      if (!target) return;
      const rects = Array.from(target.getClientRects());
      const r = rects[Math.min(anchor.rect, rects.length - 1)] ?? target.getBoundingClientRect();
      const { offsetWidth: w, offsetHeight: h } = el;
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const x = r.left + anchor.xRatio * r.width;

      const fitsBelow = r.bottom + GAP + h <= vh - MARGIN;
      const fitsAbove = r.top - GAP - h >= MARGIN;
      const place: Placement = fitsBelow || !fitsAbove ? "bottom" : "top";

      const rawTop = place === "bottom" ? r.bottom + GAP : r.top - GAP - h;
      const left = Math.min(Math.max(x - w / 2, MARGIN), Math.max(MARGIN, vw - w - MARGIN));
      setPos({
        left,
        top: Math.min(Math.max(rawTop, MARGIN), Math.max(MARGIN, vh - h - MARGIN)),
        arrow: Math.min(Math.max(x - left, 14), Math.max(14, w - 14)),
        place,
      });
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, [anchor, text]);

  return createPortal(
    <motion.div
      ref={ref}
      role="tooltip"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: pos ? 1 : 0, scale: 1 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
      style={{ left: pos?.left ?? 0, top: pos?.top ?? 0 }}
      className={`fixed z-50 w-[min(23rem,calc(100vw-1.5rem))] rounded-2xl border ${lineCls} bg-white/95 p-3 shadow-xl shadow-black/10 backdrop-blur-md dark:bg-zinc-900/95 dark:shadow-black/40`}
    >
      {/* the little beak, kept under the pointed-at spot */}
      <span
        aria-hidden="true"
        style={{ left: (pos?.arrow ?? 14) - 5 }}
        className={`absolute size-2.5 border-t border-l bg-white ${lineCls} dark:bg-zinc-900 ${
          pos?.place === "top" ? "-bottom-1.5 rotate-225" : "-top-1.5 rotate-45"
        }`}
      />

      <div className="flex items-center justify-between gap-2">
        <span className={`text-[11px] font-semibold uppercase tracking-wide ${goldCls}`}>{label}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={!canPlay}
            aria-label={playLabel}
            className="grid size-7 place-items-center rounded-full bg-emerald-700 text-white transition-colors hover:bg-emerald-800 disabled:opacity-40 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300"
          >
            <Icon icon={playing ? "ph:pause-fill" : "ph:play-fill"} className="size-3.5" />
          </button>
          {dismissible ? (
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className={`grid size-7 place-items-center rounded-full ${mutedCls} transition-colors hover:text-emerald-700 dark:hover:text-emerald-400`}
            >
              <Icon icon="ph:x" className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      <p
        lang={lang}
        dir={dir}
        className={`mt-1.5 max-h-[40vh] overflow-y-auto leading-relaxed text-zinc-800 dark:text-zinc-200 ${
          dir === "rtl" ? "font-arabic text-lg" : "text-sm"
        }`}
      >
        {text}
      </p>
    </motion.div>,
    document.body,
  );
}
