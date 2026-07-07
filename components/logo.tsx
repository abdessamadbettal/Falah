"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useDict, useLocale } from "@/components/locale";
import { localePath } from "@/lib/i18n";

const CRESCENT_D = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";
const SPARKLE_D =
  "M12 0c0 6.075 4.925 11 11 11-6.075 0-11 4.925-11 11 0-6.075-4.925-11-11-11 6.075 0 11-4.925 11-11z";

/** Crescent moon + a twinkling sparkle, hand-drawn — no icon library. The
 * moon rises in once and settles; the sparkle keeps a slow, gentle twinkle
 * for as long as the page is open. */
function Mark({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  // A plain (non-motion) <g> carries the static position/scale for each
  // shape: browsers let a CSS `transform` (which Motion animates with)
  // replace rather than compose with an SVG `transform` attribute, so the
  // two have to live on different elements or the layout breaks.
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <g transform="translate(2 2) scale(1.5)">
        <motion.path
          className="text-emerald-700 dark:text-emerald-400"
          fill="currentColor"
          d={CRESCENT_D}
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.5, rotate: -25 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </g>
      <g transform="translate(21 3) scale(0.34)">
        <motion.path
          className="text-amber-600 dark:text-amber-300"
          fill="currentColor"
          d={SPARKLE_D}
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0 }}
          animate={
            reduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: [0, 1, 0.7, 1], scale: [0, 1.25, 0.9, 1] }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 4.5,
                  delay: 0.45,
                  times: [0, 0.16, 0.7, 1],
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }
          }
        />
      </g>
    </svg>
  );
}

export function Logo({
  tagline = false,
  centered = false,
  className = "",
}: {
  tagline?: boolean;
  centered?: boolean;
  className?: string;
}) {
  const locale = useLocale();
  const d = useDict();

  return (
    <div className={`flex flex-col ${centered ? "items-center text-center" : ""} ${className}`}>
      <Link
        href={localePath(locale)}
        className="flex items-center gap-2.5 text-zinc-900 dark:text-zinc-100"
      >
        <Mark className="size-5 shrink-0 text-emerald-700 dark:text-emerald-400" />
        <span className="font-display text-xl tracking-wide">
          Falah<span className="text-zinc-500 dark:text-zinc-400">.io</span>
        </span>
      </Link>
      {tagline ? (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-1.5 max-w-xs text-xs leading-relaxed text-zinc-500 dark:text-zinc-400"
        >
          {d.common.tagline}
        </motion.p>
      ) : null}
    </div>
  );
}
