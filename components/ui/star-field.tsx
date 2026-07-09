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
