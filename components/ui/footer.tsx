"use client";

import { Icon } from "@iconify/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useDict, useLocale } from "@/components/locale";
import { Logo } from "@/components/logo";
import { localePath } from "@/lib/i18n";
import { TOOL_CATEGORIES, TOOL_PATHS } from "@/lib/seo";
import { GITHUB_URL } from "@/lib/site";
import { Eyebrow } from "./eyebrow";
import { LanguageSwitcher } from "./language-switcher";
import { Star8 } from "./star8";
import { StarField } from "./star-field";
import { goldCls, lineCls, mutedCls } from "./styles";

export function Footer() {
  const d = useDict();
  const locale = useLocale();
  const reduce = useReducedMotion();
  const tools = d.tools;

  return (
    <footer
      className={`relative overflow-hidden border-t ${lineCls} bg-zinc-50 dark:bg-zinc-900/40`}
    >
      <StarField className="pointer-events-none absolute -right-10 -top-16 size-72 text-emerald-700/10 dark:text-emerald-400/10" />
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-x-8 gap-y-12 lg:grid-cols-[1.05fr_1.95fr]">
          {/* brand block */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <Logo tagline />
            <p className="mt-6 max-w-xs font-display text-lg leading-relaxed">
              {d.common.footerDua}
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <LanguageSwitcher />
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                aria-label={d.common.githubAria}
                className={`inline-flex size-9 items-center justify-center rounded-full border ${lineCls} ${mutedCls} transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
              >
                <Icon icon="ph:github-logo" className="size-4" />
              </a>
            </div>
          </motion.div>

          {/* every tool, grouped by category */}
          <div>
            <Eyebrow>{d.home.toolkitEyebrow}</Eyebrow>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3">
              {d.home.categories.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.06 }}
                >
                  <h3
                    className={`text-xs font-semibold uppercase tracking-[0.14em] ${mutedCls}`}
                  >
                    {cat.label}
                  </h3>
                  <ul className="mt-3.5 space-y-2.5">
                    {TOOL_CATEGORIES[i].map((tool) => (
                      <li key={tool.key}>
                        <Link
                          href={localePath(locale, TOOL_PATHS[tool.key])}
                          className="group inline-flex items-center gap-1.5 text-sm text-zinc-700 transition-colors hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-400"
                        >
                          <Icon
                            icon={tool.icon}
                            className={`size-4 shrink-0 ${mutedCls} transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400`}
                          />
                          {tools[tool.key].title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`mt-14 flex flex-col items-center gap-4 border-t ${lineCls} pt-8 text-xs ${mutedCls} sm:flex-row sm:justify-between`}
        >
          <span className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>© Falah.io · {d.common.mit}</span>
            <Link
              href={localePath(locale, "/about")}
              className="font-medium transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {d.common.nav.about}
            </Link>
          </span>
          <span className="inline-flex items-center gap-2">
            <Star8 className={`size-3.5 ${goldCls}`} />
            {d.common.clientSide}
          </span>
        </div>
      </div>
    </footer>
  );
}
