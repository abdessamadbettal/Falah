"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useDict, useLocale } from "@/components/locale";
import {
  Eyebrow,
  Footer,
  GITHUB_URL,
  Header,
  Star8,
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
import { TOOL_PATHS } from "@/lib/seo";

const CATEGORY_TOOLS: { icon: string; key: string }[][] = [
  [
    { key: "prayer", icon: "ph:mosque" },
    { key: "calendar", icon: "ph:calendar-dots" },
    { key: "ramadan", icon: "ph:moon-stars" },
    { key: "converter", icon: "ph:arrows-left-right" },
  ],
  [
    { key: "qibla", icon: "ph:compass" },
    { key: "mosque", icon: "ph:map-pin-area" },
  ],
  [
    { key: "quran", icon: "ph:book-open-text" },
    { key: "tafseer", icon: "ph:scroll" },
    { key: "names", icon: "ph:sparkle" },
    { key: "hisnul", icon: "ph:hands-praying" },
  ],
  [
    { key: "zakat", icon: "ph:coins" },
    { key: "inheritance", icon: "ph:tree-structure" },
    { key: "age", icon: "ph:hourglass-medium" },
  ],
  [
    { key: "cards", icon: "ph:paint-brush" },
    { key: "stamp", icon: "ph:stamp" },
  ],
];

const TOOL_COUNT = CATEGORY_TOOLS.flat().length;

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
      <Star8 className={`size-3 ${goldCls}`} />
      <span>
        {d.home.todayIs}{" "}
        <span className="text-zinc-900 dark:text-zinc-100">{date}</span>
      </span>
      <span aria-hidden="true">·</span>
      <span>{d.home.computedNow}</span>
    </p>
  );
}

function Hero() {
  const d = useDict();
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="max-w-xl">
          <div className="rise rise-1 flex items-center gap-3">
            <Star8 className={`size-4 ${goldCls}`} />
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
              <span
                lang="ar"
                dir="rtl"
                className={`pb-14 font-arabic text-8xl font-bold leading-none sm:text-9xl ${brandCls}`}
              >
                فلاح
              </span>
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

function Principles() {
  const d = useDict();
  return (
    <section
      id="principles"
      className={`scroll-mt-20 border-y ${lineCls} bg-zinc-50 dark:bg-zinc-900/50`}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <Eyebrow>{d.home.principlesEyebrow}</Eyebrow>
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {d.home.principles.map((p) => (
            <div key={p.title}>
              <Icon icon={p.icon} className={`size-6 ${brandCls}`} />
              <h3 className="mt-4 font-display text-lg">{p.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${mutedCls}`}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Toolkit() {
  const d = useDict();
  const locale = useLocale();
  const cards = d.home.toolCards as Record<
    string,
    { name: string; description: string }
  >;
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

        <div className="mt-14 space-y-14">
          {d.home.categories.map((category, i) => (
            <div key={category.label}>
              <div
                className={`flex flex-wrap items-baseline justify-between gap-2 border-b ${lineCls} pb-3`}
              >
                <h3 className="font-display text-xl">{category.label}</h3>
                <span
                  lang={locale === "ar" ? "en" : "ar"}
                  dir={locale === "ar" ? "ltr" : "rtl"}
                  className={`${locale === "ar" ? "font-mono text-xs uppercase tracking-[0.2em]" : "font-arabic text-lg"} ${goldCls}`}
                >
                  {category.side}
                </span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {CATEGORY_TOOLS[i].map((tool) => (
                  <Link
                    key={tool.key}
                    href={`/${locale}${TOOL_PATHS[tool.key]}`}
                    className={`group ${cardCls} p-5 transition-colors hover:border-emerald-600 dark:hover:border-emerald-400`}
                  >
                    {/* icon tile shaped like a miniature mihrab arch */}
                    <span className="flex h-14 w-12 items-end justify-center rounded-t-full rounded-b-lg bg-emerald-50 pb-2.5 text-emerald-700 transition-colors group-hover:bg-emerald-700 group-hover:text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-hover:bg-emerald-400 dark:group-hover:text-emerald-950">
                      <Icon icon={tool.icon} className="size-5" />
                    </span>
                    <h4 className="mt-4 font-semibold">
                      {cards[tool.key].name}
                    </h4>
                    <p className={`mt-1.5 text-sm leading-relaxed ${mutedCls}`}>
                      {cards[tool.key].description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
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
        <Principles />
        <Toolkit />
        <Contribute />
      </main>
      <Footer />
    </>
  );
}
