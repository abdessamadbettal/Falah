"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import {
  Eyebrow,
  Footer,
  GITHUB_URL,
  Header,
  StarField,
  brandCls,
  btnGhost,
  btnPrimary,
  cardCls,
  goldCls,
  lineCls,
  mutedCls,
  useMounted,
} from "@/components/ui";
import { localePath } from "@/lib/i18n";
import { TOOL_CATEGORIES, TOOL_PATHS } from "@/lib/seo";

/** One flat list of every tool, tagged with its category index — the shape the
 * animated directory filters over. */
const ALL_TOOLS = TOOL_CATEGORIES.flatMap((tools, cat) =>
  tools.map((tool) => ({ ...tool, cat })),
);
const TOOL_COUNT = ALL_TOOLS.length;

/** Today's Hijri date, computed on the visitor's own device. */
function HijriToday() {
  const d = useDict();
  const locale = useLocale();
  const mounted = useMounted();

  let date: string | null = null;
  if (mounted) {
    try {
      date = new Intl.DateTimeFormat(`${locale}-u-ca-islamic-umalqura`, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
    } catch {}
  }

  if (!date) {
    return null;
  }

  return (
    <p
      className={`inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border ${lineCls} bg-zinc-50 px-4 py-2 font-mono text-xs ${mutedCls} dark:bg-zinc-900/60`}
    >
      <Icon icon="ph:moon" className="size-3" />
      <span>
        {d.home.todayIs}{" "}
        <span className="text-zinc-900 dark:text-zinc-100">{date}</span>
      </span>
    </p>
  );
}

function Hero() {
  const d = useDict();
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="max-w-xl">
          <div className="rise rise-1 flex items-center gap-3">
            <Icon icon="ph:github-logo" className={`size-4 ${brandCls}`} />
            <span
              className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}
            >
              {d.home.eyebrow}
            </span>
          </div>

          <h1 className="rise rise-2 mt-6 font-display text-5xl leading-[1.1] sm:text-6xl">
            {d.home.h1a(TOOL_COUNT)}
            <br />
            <span className={brandCls}>{d.home.h1b}</span>
          </h1>

          <p
            className={`rise rise-3 mt-6 text-base leading-relaxed sm:text-lg ${mutedCls}`}
          >
            {d.home.heroP}
          </p>

          <div className="rise rise-4 mt-8 flex flex-wrap items-center gap-3">
            <a href="#toolkit" className={btnPrimary}>
              {d.home.ctaExplore}
              <Icon icon="ph:arrow-down" className="size-4" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className={btnGhost}
            >
              <Icon icon="ph:github-logo" className="size-4" />
              {d.home.ctaGithub}
            </a>
          </div>

          <div className="rise rise-4 mt-10">
            <HijriToday />
          </div>
        </div>

        {/* Signature: mihrab arch framing "falah" in calligraphy */}
        <div className="rise rise-3 relative mx-auto w-full max-w-xs lg:max-w-sm">
          <div
            className={`relative aspect-4/5 overflow-hidden rounded-t-full rounded-b-3xl border ${lineCls} bg-zinc-50 dark:bg-zinc-900/50`}
          >
            <StarField className="absolute inset-0 size-full text-emerald-700/25 dark:text-emerald-400/25" />
            <div
              className={`absolute inset-3 rounded-t-full rounded-b-2xl border ${lineCls}`}
            />
            <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <motion.span
                lang="ar"
                dir="rtl"
                className={`pb-14 font-arabic text-8xl font-bold leading-none sm:text-9xl ${brandCls}`}
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                فلاح
              </motion.span>
              <span
                className={`font-mono text-xs uppercase tracking-[0.22em] ${mutedCls}`}
              >
                {d.home.falahCaption}
              </span>
            </div>
          </div>
          <p className={`mt-4 text-center text-xs leading-relaxed ${mutedCls}`}>
            {d.home.heroQuote}
          </p>
        </div>
      </div>
    </section>
  );
}

/** A single tool in the directory: no card box — a full-width row that fills
 * with emerald on hover, like a name being illuminated in an index. */
function ToolRow({
  tool,
}: {
  tool: { key: string; icon: string };
}) {
  const d = useDict();
  const locale = useLocale();
  const cards = d.home.toolCards as Record<
    string,
    { name: string; description: string }
  >;
  const tools = d.tools as Record<string, { side: string }>;

  return (
    <Link
      href={localePath(locale, TOOL_PATHS[tool.key])}
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl px-3 py-4 sm:gap-5 sm:px-5"
    >
      {/* emerald wipe, anchored to the reading edge */}
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-emerald-700 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 rtl:origin-right dark:bg-emerald-400"
      />

      {/* icon tile shaped like a miniature mihrab arch */}
      <span className="relative flex h-12 w-10 shrink-0 items-end justify-center rounded-t-full rounded-b-lg bg-emerald-50 pb-2 text-emerald-700 transition-colors group-hover:bg-white/20 group-hover:text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-hover:bg-emerald-950/20 dark:group-hover:text-emerald-950">
        <Icon icon={tool.icon} className="size-5" />
      </span>

      <div className="relative min-w-0 flex-1">
        <h4 className="truncate font-semibold transition-colors group-hover:text-white dark:group-hover:text-emerald-950">
          {cards[tool.key].name}
        </h4>
        <p
          className={`mt-0.5 truncate text-sm ${mutedCls} transition-colors group-hover:text-emerald-50 dark:group-hover:text-emerald-900`}
        >
          {cards[tool.key].description}
        </p>
      </div>

      {/* Arabic calligraphy accent — the tool's name in Arabic (Latin locales) */}
      {locale !== "ar" ? (
        <span
          lang="ar"
          dir="rtl"
          className={`relative hidden shrink-0 font-arabic text-lg ${goldCls} transition-colors group-hover:text-amber-100 sm:block`}
        >
          {tools[tool.key].side}
        </span>
      ) : null}

      <Icon
        icon="ph:arrow-right"
        className="relative size-4 shrink-0 -translate-x-1 text-zinc-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-white group-hover:opacity-100 rtl:rotate-180 rtl:translate-x-1 rtl:group-hover:translate-x-0 dark:group-hover:text-emerald-950"
      />
    </Link>
  );
}

/** The toolkit as an illuminated index, filtered by an animated category
 * selector instead of split into static sections. */
function Toolkit() {
  const d = useDict();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(-1); // -1 = all

  const tabs = [
    { i: -1, label: d.common.allTools },
    ...d.home.categories.map((c, i) => ({ i, label: c.label })),
  ];
  const shown =
    active === -1 ? ALL_TOOLS : ALL_TOOLS.filter((t) => t.cat === active);

  return (
    <section id="toolkit" className="scroll-mt-20">
      <div className="mx-auto max-w-4xl px-5 py-16 sm:py-24">
        <div className="max-w-2xl">
          <Eyebrow>{d.home.toolkitEyebrow}</Eyebrow>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl">
            {d.home.toolkitH2}
          </h2>
          <p className={`mt-4 leading-relaxed ${mutedCls}`}>
            {d.home.toolkitP(TOOL_COUNT)}
          </p>
        </div>

        {/* category selector — a sliding pill marks the active filter */}
        <div className="mt-10 flex flex-wrap gap-2" role="tablist">
          {tabs.map((tab) => {
            const on = active === tab.i;
            return (
              <button
                key={tab.i}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(tab.i)}
                className={`relative rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  on
                    ? "border-transparent"
                    : `${lineCls} ${mutedCls} hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`
                }`}
              >
                {on ? (
                  <motion.span
                    layoutId="toolFilter"
                    className="absolute inset-0 rounded-full bg-emerald-700 dark:bg-emerald-400"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span
                  className={`relative z-10 ${on ? "text-white dark:text-emerald-950" : ""}`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* the filtered directory */}
        <motion.ul layout className="mt-8 divide-y divide-zinc-100 dark:divide-zinc-900">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((tool) => (
              <motion.li
                key={tool.key}
                layout
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <ToolRow tool={tool} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
function Contribute() {
  const d = useDict();
  return (
    <section
      id="contribute"
      className={`scroll-mt-20 border-t ${lineCls} bg-zinc-50 dark:bg-zinc-900/50`}
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          <Eyebrow>{d.home.contributeEyebrow}</Eyebrow>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl">
            {d.home.contributeH2}
          </h2>
          <p className={`mt-4 leading-relaxed ${mutedCls}`}>
            {d.home.contributeP}
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={`mt-8 ${btnPrimary}`}
          >
            <Icon icon="ph:git-pull-request" className="size-4" />
            {d.home.contributeCta}
          </a>
        </div>
        <ul className="space-y-3 self-center">
          {d.home.contributions.map((c) => (
            <li
              key={c.label}
              className={`flex items-center gap-4 ${cardCls} px-5 py-4`}
            >
              <Icon icon={c.icon} className={`size-5 shrink-0 ${brandCls}`} />
              <span className="text-sm font-medium">{c.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function HomeClient() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Toolkit />
        <Contribute />
      </main>
      <Footer />
    </>
  );
}
