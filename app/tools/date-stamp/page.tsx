"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import {
  Field,
  ToolShell,
  btnGhost,
  btnPrimary,
  cardCls,
  inputCls,
  mutedCls,
  useMounted,
} from "@/components/ui";
import {
  formatHijri,
  hijriFromGregorian,
  utcNoon,
} from "@/lib/hijri";

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.translate(x, y);
  for (const rot of [0, Math.PI / 4]) {
    ctx.save();
    ctx.rotate(rot);
    ctx.strokeRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  }
  ctx.restore();
}

export default function DateStampPage() {
  const mounted = useMounted();
  const [title, setTitle] = useState("");
  const [dateInput, setDateInput] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  });
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arabicProbe = useRef<HTMLSpanElement>(null);
  const displayProbe = useRef<HTMLSpanElement>(null);

  const parts = dateInput.split("-").map(Number);
  const date =
    parts.length === 3 && parts.every(Number.isFinite)
      ? utcNoon(parts[0], parts[1] - 1, parts[2])
      : null;
  const hijri = date ? hijriFromGregorian(date) : null;
  const gregorianLabel = date
    ? new Intl.DateTimeFormat("en", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).format(date)
    : "";
  const stampText = hijri ? `${formatHijri(hijri)} — ${gregorianLabel} CE` : "";

  function render() {
    if (!hijri || !date) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = (canvas.width = 1400);
    const H = (canvas.height = 460);
    // Tailwind hexes: emerald-950 ink on white, emerald-700 rules, amber-500 stars.
    const ink = "#022c22";
    const rule = "#047857";
    const gold = "#f59e0b";
    const arabicFont = arabicProbe.current ? getComputedStyle(arabicProbe.current).fontFamily : "serif";
    const displayFont = displayProbe.current ? getComputedStyle(displayProbe.current).fontFamily : "serif";

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = rule;
    ctx.lineWidth = 5;
    ctx.strokeRect(30, 30, W - 60, H - 60);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 48, W - 96, H - 96);
    drawStar(ctx, 110, H / 2, 26, gold);
    drawStar(ctx, W - 110, H / 2, 26, gold);

    ctx.textAlign = "center";
    ctx.fillStyle = ink;
    let y = title.trim() ? 150 : 190;
    if (title.trim()) {
      ctx.font = `400 52px ${displayFont}`;
      ctx.fillText(title.trim(), W / 2, y);
      ctx.strokeStyle = gold;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 180, y + 26);
      ctx.lineTo(W / 2 + 180, y + 26);
      ctx.stroke();
      y += 105;
    }
    ctx.direction = "rtl";
    ctx.font = `700 64px ${arabicFont}`;
    ctx.fillText(formatHijri(hijri, "ar"), W / 2, y);
    ctx.direction = "ltr";
    ctx.font = `400 36px ${displayFont}`;
    ctx.fillStyle = rule;
    ctx.fillText(`${formatHijri(hijri)}  ·  ${gregorianLabel} CE`, W / 2, y + 70);
  }

  useEffect(() => {
    document.fonts.ready.then(render);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateInput, title]);

  function download() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hijri-letterhead-${dateInput}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(stampText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <ToolShell
      icon="ph:stamp"
      title="Arabic Letterhead Date Stamp"
      arabic="ترويسة التاريخ"
      intro="A professional Hijri date header for documents and certificates — rendered in your browser, downloadable as a PNG or copied as plain text."
      wide
    >
      {!mounted ? (
        <p className={`text-sm ${mutedCls}`}>Loading the stamp maker…</p>
      ) : (
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className={`${cardCls} space-y-4 self-start p-5`}>
          <Field label="Heading (optional)" hint="Organization, masjid, or document title.">
            <input
              className={inputCls}
              placeholder="e.g. Masjid An-Noor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field label="Date">
            <input type="date" className={inputCls} value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-3 pt-1">
            <button type="button" onClick={download} className={btnPrimary} disabled={!hijri}>
              <Icon icon="ph:download-simple" className="size-4" />
              Download PNG
            </button>
            <button type="button" onClick={copyText} className={btnGhost} disabled={!hijri}>
              <Icon icon={copied ? "ph:check" : "ph:copy"} className="size-4" />
              {copied ? "Copied" : "Copy as text"}
            </button>
          </div>
          {stampText ? <p className={`font-mono text-xs ${mutedCls}`}>{stampText}</p> : null}
        </div>

        <div>
          <canvas
            ref={canvasRef}
            className="w-full rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800"
          />
          <p className={`mt-2 text-xs ${mutedCls}`}>
            1400×460 px — crops cleanly into A4 and Letter headers.
          </p>
        </div>
      </div>
      )}

      {/* invisible probes so canvas can resolve the next/font family names */}
      <span ref={arabicProbe} className="font-arabic absolute -left-full" aria-hidden="true">م</span>
      <span ref={displayProbe} className="font-display absolute -left-full" aria-hidden="true">m</span>
    </ToolShell>
  );
}
