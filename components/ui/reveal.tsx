"use client";

import { motion, useReducedMotion } from "motion/react";

/** A scroll-triggered reveal that respects reduced-motion — the site's one
 * recurring gesture for long-form sections, staggered by index within a
 * group. Fires once, so a section never re-animates on the way back up. */
export function Reveal({
  i = 0,
  className,
  children,
}: {
  i?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.06 }}
    >
      {children}
    </motion.div>
  );
}
