import { goldCls, mutedCls } from "./styles";

/** Decorative, stateless pieces. No "use client" directive: rendered from a
 * server tree they stay static HTML; imported by a client component they
 * simply come along — either way they never carry their own JS. */

/** Rub el Hizb — the 8-pointed star of Islamic geometry. */
export function Star8({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        transform="translate(20 20)"
      >
        <rect x="-10" y="-10" width="20" height="20" />
        <rect x="-10" y="-10" width="20" height="20" transform="rotate(45)" />
      </g>
    </svg>
  );
}

/** A quiet tiling of 8-pointed stars, fading out radially. */
export function StarField({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      style={{
        maskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 72%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 72%)",
      }}
    >
      <defs>
        <pattern id="girih" width="56" height="56" patternUnits="userSpaceOnUse">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            transform="translate(28 28)"
          >
            <rect x="-13" y="-13" width="26" height="26" />
            <rect
              x="-13"
              y="-13"
              width="26"
              height="26"
              transform="rotate(45)"
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#girih)" />
    </svg>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Star8 className={`size-4 shrink-0 ${goldCls}`} />
      <span
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}
      >
        {children}
      </span>
      <span
        className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"
        aria-hidden="true"
      />
    </div>
  );
}
