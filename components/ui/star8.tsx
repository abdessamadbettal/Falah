/** Rub el Hizb — the 8-pointed star of Islamic geometry. Stateless, so it
 * carries no "use client" directive and ships no JS of its own. */
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
