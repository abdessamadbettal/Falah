"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import {
  brandCls,
  btnGhost,
  btnPrimary,
  Eyebrow,
  Footer,
  GITHUB_URL,
  goldCls,
  Header,
  Input,
  lineCls,
  mutedCls,
  StarField,
  useMounted,
} from "@/components/ui";
import { localePath } from "@/lib/i18n";
import { TOOL_CATEGORIES, TOOL_PATHS, type ToolKey } from "@/lib/seo";

/** One flat list of every tool, tagged with its category index — the shape the
 * searchable directory filters over. */
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

/** A small 8-pointed star that drifts and turns forever — hero ambience. */
function FloatingStar({
  className,
  delay = 0,
  drift = 10,
}: {
  className?: string;
  delay?: number;
  drift?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`pointer-events-none absolute ${className ?? ""}`}
      animate={
        reduce ? undefined : { y: [0, -drift, 0], rotate: [0, 45, 0] }
      }
      transition={{
        duration: 9,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Icon icon="ph:moon-stars" className="size-full" />
    </motion.div>
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
          <FloatingStar
            className="-left-3 top-6 size-6 text-amber-500/60 dark:text-amber-300/50"
            delay={0.4}
            drift={12}
          />
          <FloatingStar
            className="-right-2 bottom-24 size-8 text-emerald-600/40 dark:text-emerald-400/40"
            delay={1.6}
            drift={16}
          />
          <div
            className={`relative aspect-4/5 overflow-hidden rounded-t-full rounded-b-3xl border ${lineCls} bg-zinc-50 dark:bg-zinc-900/50`}
          >
            <StarField className="absolute inset-0 size-full text-emerald-700/25 dark:text-emerald-400/25" />
            <div
              className={`absolute inset-3 rounded-t-full rounded-b-2xl border ${lineCls}`}
            />
            {/* a soft light that breathes behind the calligraphy */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-8 top-1/4 h-40 rounded-full bg-emerald-500/20 blur-3xl dark:bg-emerald-400/15"
              animate={reduce ? undefined : { opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
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

/** Track the cursor inside a tile so a soft spotlight can follow it. */
function spotlight(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}

/** A tool as an interactive tile: the mihrab arch fills, a girih pattern
 * fades in, and an emerald spotlight tracks the pointer. */
function ToolTile({ tool }: { tool: { key: ToolKey; icon: string } }) {
  const d = useDict();
  const locale = useLocale();
  const cards = d.home.toolCards;
  const tools = d.tools;

  return (
    <Link
      href={localePath(locale, TOOL_PATHS[tool.key])}
      onMouseMove={spotlight}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${lineCls} bg-white p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-[0_18px_40px_-24px_rgba(4,120,87,0.45)] dark:bg-zinc-900/60 dark:hover:border-emerald-400/50`}
    >
      {/* pointer spotlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--x) var(--y), rgba(16,185,129,0.13), transparent 65%)",
        }}
      />
      {/* girih pattern, revealed on hover */}
      <StarField className="pointer-events-none absolute -right-10 -top-10 size-32 text-emerald-700/0 transition-colors duration-500 group-hover:text-emerald-700/[0.07] dark:group-hover:text-emerald-400/10" />

      <div className="relative flex items-start justify-between gap-3">
        {/* icon tile shaped like a miniature mihrab arch */}
        <span className="flex h-12 w-10 items-end justify-center rounded-t-full rounded-b-lg bg-emerald-50 pb-2 text-emerald-700 transition-colors duration-300 group-hover:bg-emerald-700 group-hover:text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-hover:bg-emerald-400 dark:group-hover:text-emerald-950">
          <Icon icon={tool.icon} className="size-5" />
        </span>
        {locale !== "ar" ? (
          <span
            lang="ar"
            dir="rtl"
            className={`font-arabic text-lg ${goldCls}`}
          >
            {tools[tool.key].side}
          </span>
        ) : null}
      </div>

      <h3 className="relative mt-4 font-semibold">{cards[tool.key].name}</h3>
      <p
        className={`relative mt-1.5 line-clamp-2 text-sm leading-relaxed ${mutedCls}`}
      >
        {cards[tool.key].description}
      </p>

      <span
        className={`relative mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${brandCls}`}
      >
        {d.home.openTool}
        <Icon
          icon="ph:arrow-right"
          className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
        />
      </span>
    </Link>
  );
}

/** The toolkit as a searchable, filterable spotlight grid. */
function Toolkit() {
  const d = useDict();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(-1); // -1 = all
  const [query, setQuery] = useState("");
  const cards = d.home.toolCards as Record<
    string,
    { name: string; description: string }
  >;

  const tabs = [
    { i: -1, label: d.common.allTools },
    ...d.home.categories.map((c, i) => ({ i, label: c.label })),
  ];

  const q = query.trim().toLowerCase();
  const shown = ALL_TOOLS.filter((t) => {
    if (active !== -1 && t.cat !== active) return false;
    if (!q) return true;
    const c = cards[t.key];
    return `${c.name} ${c.description}`.toLowerCase().includes(q);
  });

  return (
    <section id="toolkit" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="max-w-2xl">
          <Eyebrow>{d.home.toolkitEyebrow}</Eyebrow>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl">
            {d.home.toolkitH2}
          </h2>
          <p className={`mt-4 leading-relaxed ${mutedCls}`}>
            {d.home.toolkitP(TOOL_COUNT)}
          </p>
        </div>

        {/* controls: category selector + live search */}
        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist">
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
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                      }}
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

          <div className="relative lg:w-72">
            <Icon
              icon="ph:magnifying-glass"
              className={`pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 ${mutedCls} rtl:left-auto rtl:right-3`}
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={d.home.searchPh}
              aria-label={d.home.searchAria}
              className="pl-9 rtl:pr-9 rtl:pl-3"
            />
          </div>
        </div>

        {/* the spotlight grid */}
        {shown.length > 0 ? (
          <motion.div
            layout
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((tool) => (
                <motion.div
                  key={tool.key}
                  layout
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ToolTile tool={tool} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <p className={`mt-10 text-center text-sm ${mutedCls}`}>
            {d.home.noMatch(query.trim())}
          </p>
        )}
      </div>
    </section>
  );
}

/** One question with a smooth, SEO-safe (always in the DOM) reveal. */
function FaqItem({
  item,
  open,
  onToggle,
}: {
  item: { q: string; a: string };
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-start"
      >
        <span className="font-medium">{item.q}</span>
        <Icon
          icon="ph:plus"
          className={`size-4 shrink-0 ${brandCls} transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className={`px-5 pb-5 text-sm leading-relaxed ${mutedCls}`}>
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

function Faq() {
  const d = useDict();
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className={`scroll-mt-20 border-t ${lineCls} bg-zinc-50 dark:bg-zinc-900/50`}
    >
      <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <Eyebrow>{d.home.faqEyebrow}</Eyebrow>
        <h2 className="mt-6 font-display text-3xl sm:text-4xl">
          {d.home.faqH2}
        </h2>
        <div
          className={`mt-10 divide-y overflow-hidden rounded-2xl border bg-white ${lineCls} dark:bg-zinc-900/60`}
        >
          {d.home.faq.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeClient() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <Toolkit />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
