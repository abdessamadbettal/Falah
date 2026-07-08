"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { Eyebrow, brandCls, lineCls, mutedCls } from "@/components/ui";

/** A shared, SEO-safe FAQ accordion: every answer stays in the DOM (it's
 * revealed with a CSS grid-rows transition, not unmounted) so crawlers read
 * it even while collapsed. Pair it with `faqJsonLd` for rich results. */
export function Faq({
  eyebrow,
  heading,
  items,
}: {
  eyebrow: string;
  heading: string;
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState(0);
  return (
    <section className="mt-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 font-display text-2xl sm:text-3xl">{heading}</h2>
      <div
        className={`mt-6 divide-y overflow-hidden rounded-2xl border bg-white ${lineCls} dark:bg-zinc-900/60`}
      >
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-start"
              >
                <span className="font-medium">{item.q}</span>
                <Icon
                  icon="ph:plus"
                  className={`size-4 shrink-0 ${brandCls} transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className={`px-5 pb-5 text-sm leading-relaxed ${mutedCls}`}>
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
