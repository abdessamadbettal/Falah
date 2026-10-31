"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { useDict } from "@/components/locale";
import {
  btnPrimary,
  cardCls,
  Field,
  Input,
  mutedCls,
  Select,
  ToolShell,
} from "@/components/ui";
import { fetchAyah, useSurahs } from "@/lib/quran";

// Tailwind palette hexes, since canvas can't use utility classes.
const STYLES = {
  emerald: { top: "#064e3b", bottom: "#022c22", text: "#ffffff", accent: "#fcd34d" },
  night: { top: "#18181b", bottom: "#09090b", text: "#f4f4f5", accent: "#34d399" },
  parchment: { top: "#fffbeb", bottom: "#fef3c7", text: "#1c1917", accent: "#047857" },
  royal: { top: "#1e1b4b", bottom: "#312e81", text: "#ffffff", accent: "#fbbf24" },
  sunset: { top: "#4c0519", bottom: "#881337", text: "#ffffff", accent: "#fcd34d" },
  ocean: { top: "#083344", bottom: "#164e63", text: "#f0fdfa", accent: "#67e8f9" },
  slate: { top: "#0f172a", bottom: "#1e293b", text: "#f8fafc", accent: "#94a3b8" },
} as const;

type StyleKey = keyof typeof STYLES;

const TRANSLATIONS = [
  { id: "en.sahih", label: "English - Sahih International" },
  { id: "en.pickthall", label: "English - Pickthall" },
  { id: "ur.jalandhry", label: "Urdu - Jalandhry" },
  { id: "id.indonesian", label: "Indonesian - Kemenag" },
  { id: "fr.hamidullah", label: "French - Hamidullah" },
  { id: "ar.muyassar", label: "Arabic - Muyassar" },
];

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

export default function QuranCardsClient() {
  const d = useDict();
  const t = d.tools.cards;
  const { surahs } = useSurahs();

  // Data State
  const [surahNumber, setSurahNumber] = useState(55);
  const [ayahNumber, setAyahNumber] = useState(13);
  const [style, setStyle] = useState<StyleKey>("emerald");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  // Customization State
  const [showTranslation, setShowTranslation] = useState(true);
  const [translationSource, setTranslationSource] = useState(
    d.tools.quran.translationEdition === "ar.muyassar" ? "en.sahih" : d.tools.quran.translationEdition
  );
  const [isAutoSize, setIsAutoSize] = useState(true);
  const [manualArabicSize, setManualArabicSize] = useState(64);
  const [manualTransSize, setManualTransSize] = useState(30);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arabicProbe = useRef<HTMLSpanElement>(null);
  const displayProbe = useRef<HTMLSpanElement>(null);

  const surah = surahs?.find((s) => s.number === surahNumber);
  const maxAyah = surah?.numberOfAyahs ?? 286;

  async function render() {
    setStatus("loading");
    try {
      const editions = ["quran-uthmani"];
      if (showTranslation) editions.push(translationSource);

      const result = await fetchAyah(surahNumber, ayahNumber, editions);
      const arabic = result[0];
      const translation = showTranslation ? result[1] : null;

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

      const maxWidth = W - 220;
      const maxBlockHeight = H - 320;

      let arabicSize = isAutoSize ? 80 : manualArabicSize;
      let transSize = isAutoSize ? 32 : manualTransSize;
      let arabicLines: string[] = [];
      let translationLines: string[] = [];

      // Check if translation is RTL (for text direction)
      const isRtlTrans = translationSource.startsWith("ar.") || translationSource.startsWith("ur.");
      // No quotes around the translation
      const transText = translation ? translation.text : "";

      if (isAutoSize) {
        // --- SMART AUTO SIZING ---

        ctx.font = `700 ${arabicSize}px ${arabicFont}`;
        const tempLines = wrap(ctx, arabic.text, maxWidth);

        if (tempLines.length === 1) {
          const widthAtBase = ctx.measureText(arabic.text).width;
          const targetWidth = maxWidth * 0.85;
          if (widthAtBase < targetWidth) {
            arabicSize = Math.min((targetWidth / widthAtBase) * arabicSize, 140);
            transSize = Math.max(18, Math.floor(arabicSize * 0.4));
          }
        }

        let iterations = 0;
        while (arabicSize >= 18 && iterations < 60) {
          ctx.font = `700 ${arabicSize}px ${arabicFont}`;
          arabicLines = wrap(ctx, arabic.text, maxWidth);

          if (translation) {
            ctx.font = `400 ${transSize}px ${displayFont}`;
            translationLines = wrap(ctx, transText, maxWidth);
          }

          const arabicHeight = arabicLines.length * (arabicSize * 1.8);
          const transHeight = translation ? 40 + (translationLines.length * (transSize * 1.4)) : 0;
          const totalHeight = arabicHeight + transHeight;

          if (totalHeight <= maxBlockHeight) break;

          arabicSize -= 2;
          transSize = Math.max(14, Math.floor(arabicSize * 0.4));
          iterations++;
        }
      } else {
        // Manual Sizing
        ctx.font = `700 ${arabicSize}px ${arabicFont}`;
        arabicLines = wrap(ctx, arabic.text, maxWidth);
        if (translation) {
          ctx.font = `400 ${transSize}px ${displayFont}`;
          translationLines = wrap(ctx, transText, maxWidth);
        }
      }

      // 4. Draw Main Text
      const arabicLineHeight = arabicSize * 1.8;
      const transLineHeight = transSize * 1.4;
      const blockHeight =
        (arabicLines.length * arabicLineHeight) +
        (translation ? 60 + (translationLines.length * transLineHeight) : 0);

      let y = (H - blockHeight) / 2 + arabicLineHeight * 0.6;

      ctx.font = `700 ${arabicSize + 4}px ${arabicFont}`;
      for (const line of arabicLines) {
        ctx.fillText(line, W / 2, y);
        y += arabicLineHeight;
      }

      if (translation) {
        y += 20;
        // Set direction based on language (keeps punctuation flowing correctly)
        ctx.direction = isRtlTrans ? "rtl" : "ltr";
        ctx.font = `400 ${transSize}px ${displayFont}`;
        ctx.globalAlpha = 0.9;
        for (const line of translationLines) {
          ctx.fillText(line, W / 2, y);
          y += transLineHeight;
        }
        ctx.globalAlpha = 1;
      }

      // 5. Draw Footer
      ctx.fillStyle = c.accent;
      ctx.font = `400 28px ${displayFont}`;

      const sName = surah?.englishName ?? String(surahNumber);
      const sMeaning = surah?.englishNameTranslation ?? "";

      // Updated footer format: Surah Name (Meaning) · surah number : ayah number
      const footerText = `${sName} ${sMeaning ? `(${sMeaning})` : ''} · ${surahNumber} : ${ayahNumber}`;

      ctx.fillText(footerText, W / 2, H - 100);

      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  const hasSurahs = surahs !== null;

  useEffect(() => {
    if (!hasSurahs) return;
    const timer = setTimeout(render, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasSurahs,
    style,
    showTranslation,
    translationSource,
    isAutoSize,
    manualArabicSize,
    manualTransSize
  ]);

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
    <ToolShell icon="ph:paint-brush" title={t.title} side={t.side} intro={t.intro} wide>
      {/* invisible probes so canvas can resolve the next/font family names */}
      <span ref={arabicProbe} className="font-arabic absolute -left-full" aria-hidden="true">م</span>
      <span ref={displayProbe} className="font-display absolute -left-full" aria-hidden="true">m</span>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`${cardCls} space-y-4 self-start p-5 max-h-[calc(100vh-100px)] overflow-y-auto`}>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t.surah}>
              <Select
                value={surahNumber}
                onChange={(e) => { setSurahNumber(Number(e.target.value)); setAyahNumber(1); }}
                disabled={!surahs}
              >
                {(surahs ?? []).map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.englishName}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t.ayah(maxAyah)}>
              <Input
                type="number"
                min={1}
                max={maxAyah}
                value={ayahNumber}
                onChange={(e) => setAyahNumber(Math.max(1, Math.min(maxAyah, Number(e.target.value) || 1)))}
              />
            </Field>
          </div>

          <Field label={t.style}>
            <Select value={style} onChange={(e) => setStyle(e.target.value as StyleKey)}>
              {(Object.keys(STYLES) as StyleKey[]).map((key) => (
                <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
              ))}
            </Select>
          </Field>

          <hr className="border-zinc-200 dark:border-zinc-800 my-2" />

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="toggle-translation"
              checked={showTranslation}
              onChange={(e) => setShowTranslation(e.target.checked)}
              className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="toggle-translation" className="text-sm font-medium cursor-pointer">
              {t.includeTranslation}
            </label>
          </div>

          {showTranslation && (
            <Field label={t.translationSource}>
              <Select value={translationSource} onChange={(e) => setTranslationSource(e.target.value)}>
                {TRANSLATIONS.map((trans) => (
                  <option key={trans.id} value={trans.id}>{trans.label}</option>
                ))}
              </Select>
            </Field>
          )}

          <div className="flex items-center gap-2 py-1 mt-2">
            <input
              type="checkbox"
              id="toggle-autosize"
              checked={isAutoSize}
              onChange={(e) => setIsAutoSize(e.target.checked)}
              className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="toggle-autosize" className="text-sm font-medium cursor-pointer">
              {t.autoSizeFont}
            </label>
          </div>

          {!isAutoSize && (
            <div className={`grid ${showTranslation ? 'grid-cols-2' : 'grid-cols-1'} gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg transition-all`}>
              <Field label={t.arabicSize}>
                <Input
                  type="number"
                  min={20}
                  max={140}
                  value={manualArabicSize}
                  onChange={(e) => setManualArabicSize(Number(e.target.value) || 64)}
                />
              </Field>
              {showTranslation && (
                <Field label={t.translationSize}>
                  <Input
                    type="number"
                    min={12}
                    max={60}
                    value={manualTransSize}
                    onChange={(e) => setManualTransSize(Number(e.target.value) || 30)}
                  />
                </Field>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4">
            <button type="button" onClick={render} disabled={status === "loading" || !surahs} className={btnPrimary}>
              <Icon icon="ph:arrows-clockwise" className="size-4" />
              {status === "loading" ? t.rendering : t.generate}
            </button>
            <button type="button" onClick={download} disabled={status !== "ready"} className={btnPrimary}>
              <Icon icon="ph:download-simple" className="size-4" />
              {t.download}
            </button>
          </div>
          {status === "error" ? (
            <p className="text-sm text-red-600 dark:text-red-400">{t.error}</p>
          ) : null}
        </div>

        <div>
          <canvas
            ref={canvasRef}
            className="aspect-square w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl"
          />
          <p className={`mt-2 text-xs ${mutedCls}`}>{t.sizeNote}</p>
        </div>
      </div>
    </ToolShell>
  );
}
