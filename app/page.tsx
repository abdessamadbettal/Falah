"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
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

/* ---------------------------------- data --------------------------------- */

type Tool = {
  name: string;
  description: string;
  icon: string;
  href: string;
};

type Category = {
  label: string;
  arabic: string;
  tools: Tool[];
};

const categories: Category[] = [
  {
    label: "Time & Daily Worship",
    arabic: "العبادة اليومية",
    tools: [
      {
        name: "Prayer Times",
        description:
          "Accurate prayer times for your location or any point worldwide, with a live next-prayer countdown.",
        icon: "ph:mosque",
        href: "/tools/prayer-times",
      },
      {
        name: "Hijri Smart Calendar",
        description:
          "Islamic calendar with White Days (Ayyam al-Bid) highlighted and calendar export support.",
        icon: "ph:calendar-dots",
        href: "/tools/hijri-calendar",
      },
      {
        name: "Ramadan Countdown",
        description:
          "Live countdown to Ramadan and a daily companion for the blessed month.",
        icon: "ph:moon-stars",
        href: "/tools/ramadan-countdown",
      },
      {
        name: "Hijri ↔ Gregorian Converter",
        description: "Instant conversion between the two calendars, both ways.",
        icon: "ph:arrows-left-right",
        href: "/tools/date-converter",
      },
    ],
  },
  {
    label: "Direction & Local Community",
    arabic: "القبلة والمساجد",
    tools: [
      {
        name: "Qibla Finder",
        description:
          "Compass-based Qibla direction using your device sensors — locally, never uploaded.",
        icon: "ph:compass",
        href: "/tools/qibla",
      },
      {
        name: "Mosque Finder",
        description:
          "Find nearby mosques and prayer spaces using browser geolocation only.",
        icon: "ph:map-pin-area",
        href: "/tools/mosque-finder",
      },
    ],
  },
  {
    label: "Quran & Islamic Knowledge",
    arabic: "القرآن والعلم",
    tools: [
      {
        name: "Al-Qur'an Explorer",
        description:
          "A clean Quran reader in the Uthmani script with English translation.",
        icon: "ph:book-open-text",
        href: "/tools/quran",
      },
      {
        name: "Tafseer Explorer",
        description:
          "Read explanations and scholarly commentary alongside every verse.",
        icon: "ph:scroll",
        href: "/tools/tafseer",
      },
      {
        name: "99 Names of Allah",
        description:
          "Meanings and transliterations of al-Asma ul-Husna — works fully offline.",
        icon: "ph:sparkle",
        href: "/tools/names-of-allah",
      },
      {
        name: "Hisnul Muslim",
        description:
          "Authentic daily Duas from the Fortress of the Muslim, organized by moment.",
        icon: "ph:hands-praying",
        href: "/tools/hisnul-muslim",
      },
    ],
  },
  {
    label: "Islamic Calculators",
    arabic: "الحاسبات الشرعية",
    tools: [
      {
        name: "Zakat Calculator",
        description:
          "Cash, gold, silver, investments, and business assets — checked against the nisab.",
        icon: "ph:coins",
        href: "/tools/zakat",
      },
      {
        name: "Inheritance Calculator (Fara'id)",
        description:
          "Estate distribution with fixed Quranic shares, 'awl, and radd.",
        icon: "ph:tree-structure",
        href: "/tools/inheritance",
      },
      {
        name: "Hijri Age Calculator",
        description:
          "Your exact Hijri age, next Hijri birthday, and Islamic milestones.",
        icon: "ph:hourglass-medium",
        href: "/tools/hijri-age",
      },
    ],
  },
  {
    label: "Creative & Utility Tools",
    arabic: "أدوات إبداعية",
    tools: [
      {
        name: "Quran Card Maker",
        description:
          "Generate beautiful Quran verse cards, ready to share anywhere.",
        icon: "ph:paint-brush",
        href: "/tools/quran-cards",
      },
      {
        name: "Arabic Letterhead Date Stamp",
        description:
          "Professional Hijri date headers and stamps for Islamic documents.",
        icon: "ph:stamp",
        href: "/tools/date-stamp",
      },
    ],
  },
];

const principles = [
  {
    icon: "ph:shield-check",
    title: "100% private, client-side",
    body: "Prayer times, Zakat, Qibla, and inheritance are all computed on your device. Your data never leaves the browser.",
  },
  {
    icon: "ph:hand-heart",
    title: "No ads, no paywalls",
    body: "Faith is never monetized here. No advertisements, no sponsored listings, no premium-only features.",
  },
  {
    icon: "ph:lightning",
    title: "Offline-ready and fast",
    body: "A static Next.js architecture keeps every tool lightning fast and available even without a connection.",
  },
  {
    icon: "ph:user-circle-minus",
    title: "No accounts required",
    body: "Open the app and use every feature instantly. There is nothing to sign up for.",
  },
];

const contributions = [
  { icon: "ph:code", label: "Submit code improvements" },
  { icon: "ph:translate", label: "Help translate the project" },
  { icon: "ph:bug-beetle", label: "Report bugs" },
  { icon: "ph:book-bookmark", label: "Improve documentation" },
  { icon: "ph:megaphone", label: "Share it with others" },
];

const toolCount = categories.reduce((n, c) => n + c.tools.length, 0);

/** Today's Hijri date, computed on the visitor's own device. */
function HijriToday() {
  const mounted = useMounted();

  let date: string | null = null;
  if (mounted) {
    try {
      date = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
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
        Today is{" "}
        <span className="text-zinc-900 dark:text-zinc-100">
          {date.replace(" AH", "")} AH
        </span>
      </span>
      <span aria-hidden="true">·</span>
      <span>computed on your device just now</span>
    </p>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="max-w-xl">
          <div className="rise rise-1 flex items-center gap-3">
            <Star8 className={`size-4 ${goldCls}`} />
            <span
              className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}
            >
              Open source · Sadaqah Jariyah
            </span>
          </div>

          <h1 className="rise rise-2 mt-6 font-display text-5xl leading-[1.06] sm:text-6xl">
            {toolCount} Islamic tools.
            <br />
            <span className={brandCls}>Zero tracking.</span>
          </h1>

          <p
            className={`rise rise-3 mt-6 text-base leading-relaxed sm:text-lg ${mutedCls}`}
          >
            Prayer times, Qibla, Zakat, Quran, and more — every calculation
            runs in your browser. No accounts, no ads, no paywalls. Just
            clean, accurate tools for the Ummah, built as continuous charity.
          </p>

          <div className="rise rise-4 mt-8 flex flex-wrap items-center gap-3">
            <a href="#toolkit" className={btnPrimary}>
              Explore the toolkit
              <Icon icon="ph:arrow-down" className="size-4" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className={btnGhost}
            >
              <Icon icon="ph:github-logo" className="size-4" />
              Star on GitHub
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
                falāḥ — success
              </span>
            </div>
          </div>
          <p className={`mt-4 text-center text-xs leading-relaxed ${mutedCls}`}>
            &ldquo;Come to prayer, come to success.&rdquo; — the call this
            project is named after.
          </p>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section
      id="principles"
      className={`scroll-mt-20 border-y ${lineCls} bg-zinc-50 dark:bg-zinc-900/50`}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <Eyebrow>Different by design</Eyebrow>
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p) => (
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
  return (
    <section id="toolkit" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="max-w-2xl">
          <Eyebrow>The toolkit</Eyebrow>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl">
            Every tool ships free, forever.
          </h2>
          <p className={`mt-4 leading-relaxed ${mutedCls}`}>
            {toolCount} utilities across worship, direction, knowledge,
            calculation, and creativity — all running entirely on your device.
          </p>
        </div>

        <div className="mt-14 space-y-14">
          {categories.map((category) => (
            <div key={category.label}>
              <div
                className={`flex flex-wrap items-baseline justify-between gap-2 border-b ${lineCls} pb-3`}
              >
                <h3 className="font-display text-xl">{category.label}</h3>
                <span
                  lang="ar"
                  dir="rtl"
                  className={`font-arabic text-lg ${goldCls}`}
                >
                  {category.arabic}
                </span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className={`group ${cardCls} p-5 transition-colors hover:border-emerald-600 dark:hover:border-emerald-400`}
                  >
                    {/* icon tile shaped like a miniature mihrab arch */}
                    <span className="flex h-14 w-12 items-end justify-center rounded-t-full rounded-b-lg bg-emerald-50 pb-2.5 text-emerald-700 transition-colors group-hover:bg-emerald-700 group-hover:text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-hover:bg-emerald-400 dark:group-hover:text-emerald-950">
                      <Icon icon={tool.icon} className="size-5" />
                    </span>
                    <h4 className="mt-4 font-semibold">{tool.name}</h4>
                    <p className={`mt-1.5 text-sm leading-relaxed ${mutedCls}`}>
                      {tool.description}
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
  return (
    <section
      id="contribute"
      className={`scroll-mt-20 border-t ${lineCls} bg-zinc-50 dark:bg-zinc-900/50`}
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          <Eyebrow>Sadaqah Jariyah</Eyebrow>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl">
            Built by the community, for the Ummah.
          </h2>
          <p className={`mt-4 leading-relaxed ${mutedCls}`}>
            Falah.io will always remain open source, privacy-first, ad-free,
            and without a premium tier. If you&rsquo;d like to help cover
            hosting and domain costs, voluntary donations are welcome as
            Sadaqah Jariyah — but the most valuable contribution is your time.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={`mt-8 ${btnPrimary}`}
          >
            <Icon icon="ph:git-pull-request" className="size-4" />
            Open a pull request
          </a>
        </div>
        <ul className="space-y-3 self-center">
          {contributions.map((c) => (
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

export default function Home() {
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
