"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

/** A tiny, dependency-free slippy map over OpenStreetMap raster tiles:
 * drag to pan, buttons / double-click to zoom, with lat/lng markers. Kept
 * deliberately small — no Leaflet, no external JS, nothing to track. */

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
};

const TILE = 256;
const MIN_Z = 3;
const MAX_Z = 18;

function project(lat: number, lng: number, z: number) {
  const scale = TILE * 2 ** z;
  const x = ((lng + 180) / 360) * scale;
  const s = Math.min(Math.max(Math.sin((lat * Math.PI) / 180), -0.9999), 0.9999);
  const y = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * scale;
  return { x, y };
}
function lngAtX(x: number, z: number) {
  return (x / (TILE * 2 ** z)) * 360 - 180;
}
function latAtY(y: number, z: number) {
  const n = Math.PI - (2 * Math.PI * y) / (TILE * 2 ** z);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

export function OsmMap({
  center,
  zoom,
  onCenterChange,
  onZoomChange,
  userPos,
  radiusKm,
  markers,
  selectedId,
  onSelect,
  className,
}: {
  center: { lat: number; lng: number };
  zoom: number;
  onCenterChange: (c: { lat: number; lng: number }) => void;
  onZoomChange: (z: number) => void;
  userPos?: { lat: number; lng: number } | null;
  radiusKm?: number;
  markers: MapMarker[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const drag = useRef<{ x: number; y: number; cx: number; cy: number; moved: boolean } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const centerPx = project(center.lat, center.lng, zoom);
  const topLeft = { x: centerPx.x - size.w / 2, y: centerPx.y - size.h / 2 };
  const toScreen = (lat: number, lng: number) => {
    const p = project(lat, lng, zoom);
    return { x: p.x - topLeft.x, y: p.y - topLeft.y };
  };

  const tiles: { key: string; left: number; top: number; url: string }[] = [];
  if (size.w > 0) {
    const n = 2 ** zoom;
    const x0 = Math.floor(topLeft.x / TILE);
    const x1 = Math.floor((topLeft.x + size.w) / TILE);
    const y0 = Math.floor(topLeft.y / TILE);
    const y1 = Math.floor((topLeft.y + size.h) / TILE);
    for (let tx = x0; tx <= x1; tx++) {
      for (let ty = y0; ty <= y1; ty++) {
        if (ty < 0 || ty >= n) continue;
        const wx = ((tx % n) + n) % n;
        tiles.push({
          key: `${tx}-${ty}`,
          left: tx * TILE - topLeft.x,
          top: ty * TILE - topLeft.y,
          url: `https://tile.openstreetmap.org/${zoom}/${wx}/${ty}.png`,
        });
      }
    }
  }

  // Mirrors drag.current's truthiness: the ref drives the pan math, the
  // state drives the cursor (refs must not be read during render).
  const [dragging, setDragging] = useState(false);

  function onPointerDown(e: React.PointerEvent) {
    const c = project(center.lat, center.lng, zoom);
    drag.current = { x: e.clientX, y: e.clientY, cx: c.x, cy: c.y, moved: false };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    const dr = drag.current;
    if (!dr) return;
    const dx = e.clientX - dr.x;
    const dy = e.clientY - dr.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) dr.moved = true;
    onCenterChange({ lat: latAtY(dr.cy - dy, zoom), lng: lngAtX(dr.cx - dx, zoom) });
  }
  function onPointerUp() {
    drag.current = null;
    setDragging(false);
  }

  // radius ring (metres → pixels at this latitude/zoom)
  let ringPx = 0;
  if (radiusKm && userPos) {
    const mpp = (156543.03392 * Math.cos((userPos.lat * Math.PI) / 180)) / 2 ** zoom;
    ringPx = (radiusKm * 1000) / mpp;
  }
  const userScreen = userPos ? toScreen(userPos.lat, userPos.lng) : null;

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onDoubleClick={() => onZoomChange(Math.min(MAX_Z, zoom + 1))}
      className={`relative touch-none select-none overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${dragging ? "cursor-grabbing" : "cursor-grab"} ${className ?? ""}`}
    >
      {/* tiles */}
      {tiles.map((tl) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={tl.key}
          src={tl.url}
          alt=""
          draggable={false}
          className="pointer-events-none absolute max-w-none"
          style={{ left: tl.left, top: tl.top, width: TILE, height: TILE }}
        />
      ))}

      {/* overlays */}
      <div className="pointer-events-none absolute inset-0">
        {/* search radius */}
        {userScreen && ringPx > 0 ? (
          <div
            className="absolute rounded-full border-2 border-emerald-500/50 bg-emerald-500/10"
            style={{
              left: userScreen.x - ringPx,
              top: userScreen.y - ringPx,
              width: ringPx * 2,
              height: ringPx * 2,
            }}
          />
        ) : null}

        {/* your location */}
        {userScreen ? (
          <div className="absolute" style={{ left: userScreen.x, top: userScreen.y }}>
            <span className="absolute -left-2 -top-2 size-4 animate-ping rounded-full bg-emerald-500/60" />
            <span className="absolute -left-1.5 -top-1.5 size-3 rounded-full border-2 border-white bg-emerald-600 dark:border-zinc-900" />
          </div>
        ) : null}

        {/* mosque pins */}
        {markers.map((m) => {
          const p = toScreen(m.lat, m.lng);
          if (p.x < -40 || p.y < -40 || p.x > size.w + 40 || p.y > size.h + 40) return null;
          const on = m.id === selectedId;
          return (
            <button
              key={m.id}
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onSelect?.(m.id)}
              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-110"
              style={{ left: p.x, top: p.y, zIndex: on ? 20 : 10 }}
            >
              <Icon
                icon="ph:map-pin-fill"
                className={`size-7 drop-shadow ${on ? "text-amber-500" : "text-emerald-700 dark:text-emerald-400"}`}
              />
            </button>
          );
        })}
      </div>

      {/* zoom controls */}
      <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
        {([["ph:plus", 1], ["ph:minus", -1]] as const).map(([icon, delta]) => (
          <button
            key={icon}
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onZoomChange(Math.min(MAX_Z, Math.max(MIN_Z, zoom + delta)))}
            className="grid size-8 place-items-center text-zinc-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-zinc-200 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
          >
            <Icon icon={icon} className="size-4" />
          </button>
        ))}
      </div>

      {/* attribution (required by the OSM tile policy) */}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute bottom-0 right-0 bg-white/80 px-1.5 py-0.5 text-[10px] text-zinc-600 hover:underline dark:bg-zinc-900/80 dark:text-zinc-300"
      >
        © OpenStreetMap
      </a>
    </div>
  );
}
