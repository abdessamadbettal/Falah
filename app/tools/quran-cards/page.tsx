"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import {
  Field,
  ToolShell,
  btnPrimary,
  cardCls,
  inputCls,
  mutedCls,
} from "@/components/ui";
import { fetchAyah, useSurahs } from "@/lib/quran";

// Tailwind palette hexes, since canvas can't use utility classes.
const STYLES = {
  emerald: { top: "#064e3b", bottom: "#022c22", text: "#ffffff", accent: "#fcd34d" },
  night: { top: "#18181b", bottom: "#09090b", text: "#f4f4f5", accent: "#34d399" },
  parchment: { top: "#fffbeb", bottom: "#fef3c7", text: "#1c1917", accent: "#047857" },
} as const;

type StyleKey = keyof typeof STYLES;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.translate(x, y);
  for (const rot of [0, Math.PI / 4]) {
    ctx.save();
    ctx.rotate(rot);
    ctx.strokeRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  }
  ctx.restore();
}

export default function QuranCardsPage() {
  const { surahs } = useSurahs();
  const [surahNumber, setSurahNumber] = useState(55);
  const [ayahNumber, setAyahNumber] = useState(13);
  const [style, setStyle] = useState<StyleKey>("emerald");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arabicProbe = useRef<HTMLSpanElement>(null);
  const displayProbe = useRef<HTMLSpanElement>(null);

  const surah = surahs?.find((s) => s.number === surahNumber);
  const maxAyah = surah?.numberOfAyahs ?? 286;

  async function render() {
    setStatus("loading");
    try {
      const [arabic, english] = await fetchAyah(surahNumber, ayahNumber, [
        "quran-uthmani",
        "en.sahih",
      ]);
      await document.fonts.ready;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const W = (canvas.width = 1080);
      const H = (canvas.height = 1080);
      const c = STYLES[style];
      const arabicFont = arabicProbe.current
        ? getComputedStyle(arabicProbe.current).fontFamily
        : "serif";
      const displayFont = displayProbe.current
        ? getComputedStyle(displayProbe.current).fontFamily
        : "serif";

      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, c.top);
      grad.addColorStop(1, c.bottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 3;
      ctx.strokeRect(48, 48, W - 96, H - 96);
      drawStar(ctx, W / 2, 110, 22, c.accent);

      ctx.textAlign = "center";
      ctx.direction = "rtl";
      ctx.fillStyle = c.text;

      let arabicSize = 64;
      let arabicLines: string[];
      do {
        ctx.font = `700 ${arabicSize}px ${arabicFont}`;
        arabicLines = wrap(ctx, arabic.text, W - 220);
        arabicSize -= 4;
      } while (arabicLines.length > 6 && arabicSize > 30);
      const arabicLineHeight = arabicSize * 1.9;

      ctx.font = `400 30px ${displayFont}`;
      const englishLines = wrap(ctx, `“${english.text}”`, W - 260);
      const englishLineHeight = 44;

      const blockHeight =
        arabicLines.length * arabicLineHeight + 60 + englishLines.length * englishLineHeight;
      let y = (H - blockHeight) / 2 + arabicLineHeight * 0.6;

      ctx.font = `700 ${arabicSize + 4}px ${arabicFont}`;
      for (const line of arabicLines) {
        ctx.fillText(line, W / 2, y);
        y += arabicLineHeight;
      }

      y += 20;
      ctx.direction = "ltr";
      ctx.font = `400 30px ${displayFont}`;
      ctx.globalAlpha = 0.9;
      for (const line of englishLines) {
        ctx.fillText(line, W / 2, y);
        y += englishLineHeight;
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = c.accent;
      ctx.font = `400 28px ${displayFont}`;
      ctx.fillText(
        `Surah ${surah?.englishName ?? surahNumber} · ${surahNumber}:${ayahNumber}`,
        W / 2,
        H - 100,
      );
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    if (!surahs) return;
    const t = setTimeout(render, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahs !== null, style]);

  function download() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quran-${surahNumber}-${ayahNumber}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <ToolShell
      icon="ph:paint-brush"
      title="Quran Card Maker"
      arabic="بطاقات قرآنية"
      intro="Pick any verse and generate a share-ready card, rendered entirely in your browser with the canvas API."
      wide
    >
      {/* invisible probes so canvas can resolve the next/font family names */}
      <span ref={arabicProbe} className="font-arabic absolute -left-full" aria-hidden="true">م</span>
      <span ref={displayProbe} className="font-display absolute -left-full" aria-hidden="true">m</span>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`${cardCls} space-y-4 self-start p-5`}>
          <Field label="Surah">
            <select
              className={inputCls}
              value={surahNumber}
              onChange={(e) => { setSurahNumber(Number(e.target.value)); setAyahNumber(1); }}
              disabled={!surahs}
            >
              {(surahs ?? []).map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.englishName}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`Ayah (1–${maxAyah})`}>
            <input
              type="number"
              min={1}
              max={maxAyah}
              className={inputCls}
              value={ayahNumber}
              onChange={(e) => setAyahNumber(Math.max(1, Math.min(maxAyah, Number(e.target.value) || 1)))}
            />
          </Field>
          <Field label="Style">
            <select className={inputCls} value={style} onChange={(e) => setStyle(e.target.value as StyleKey)}>
              <option value="emerald">Emerald</option>
              <option value="night">Night</option>
              <option value="parchment">Parchment</option>
            </select>
          </Field>
          <div className="flex flex-wrap gap-3 pt-1">
            <button type="button" onClick={render} disabled={status === "loading" || !surahs} className={btnPrimary}>
              <Icon icon="ph:arrows-clockwise" className="size-4" />
              {status === "loading" ? "Rendering…" : "Generate card"}
            </button>
            <button type="button" onClick={download} disabled={status !== "ready"} className={btnPrimary}>
              <Icon icon="ph:download-simple" className="size-4" />
              Download PNG
            </button>
          </div>
          {status === "error" ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              Could not fetch that verse. Check the ayah number and your connection.
            </p>
          ) : null}
        </div>

        <div>
          <canvas
            ref={canvasRef}
            className="aspect-square w-full rounded-2xl border border-zinc-200 dark:border-zinc-800"
          />
          <p className={`mt-2 text-xs ${mutedCls}`}>
            1080×1080 px — sized for social media.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
