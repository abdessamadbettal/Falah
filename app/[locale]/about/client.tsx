"use client";

import { Icon } from "@iconify/react";
import { motion, useReducedMotion } from "motion/react";
import { useDict } from "@/components/locale";
import {
  Eyebrow,
  Footer,
  GITHUB_URL,
  Header,
  StarField,
  brandCls,
  btnPrimary,
  cardCls,
  lineCls,
  mutedCls,
} from "@/components/ui";

/** A reveal that respects reduced-motion — the About page's one recurring
 * gesture, staggered by index within each group. */
function Reveal({
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

function Intro() {
  const d = useDict();
  return (
    <section className="relative overflow-hidden">
      <StarField className="pointer-events-none absolute -right-16 -top-20 size-80 text-emerald-700/10 dark:text-emerald-400/10" />
      <div className="relative mx-auto max-w-3xl px-5 pb-6 pt-16 text-center sm:pt-24">
        <div className="rise rise-1 flex items-center justify-center gap-3">
          <Icon icon="ph:hands-praying" className={`size-4 ${brandCls}`} />
          <span
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}
          >
            {d.about.eyebrow}
          </span>
        </div>
        <h1 className="rise rise-2 mt-6 font-display text-4xl leading-[1.12] sm:text-5xl">
          {d.about.h1a}
          <br />
          <span className={brandCls}>{d.about.h1b}</span>
        </h1>
        <p
          className={`rise rise-3 mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${mutedCls}`}
        >
          {d.about.lead}
        </p>
      </div>
    </section>
  );
}

/** The nine reasons Falah is built the way it is — the heart of the page. */
function Principles() {
  const d = useDict();
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <Eyebrow>{d.about.principlesEyebrow}</Eyebrow>
      <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {d.about.principles.map((p, i) => (
          <Reveal key={p.title} i={i % 3}>
            <div className="group">
              {/* icon tile shaped like a miniature mihrab arch */}
              <span className="flex h-12 w-10 items-end justify-center rounded-t-full rounded-b-lg bg-emerald-50 pb-2 text-emerald-700 transition-colors group-hover:bg-emerald-700 group-hover:text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-hover:bg-emerald-400 dark:group-hover:text-emerald-950">
                <Icon icon={p.icon} className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-lg">{p.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${mutedCls}`}>
                {p.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** A short narrative panel — "why it works this way". */
function Story() {
  const d = useDict();
  return (
    <section className={`border-y ${lineCls} bg-zinc-50 dark:bg-zinc-900/50`}>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <Eyebrow>{d.about.storyTitle}</Eyebrow>
            <p className="mt-6 font-display text-2xl leading-snug sm:text-3xl">
              {d.common.tagline}
            </p>
          </Reveal>
          <div className="space-y-5">
            {d.about.story.map((para, i) => (
              <Reveal key={i} i={i}>
                <p className={`leading-relaxed ${mutedCls}`}>{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Closing invitation — reuses the Sadaqah Jariyah / contribute copy. */
function Contribute() {
  const d = useDict();
  const reduce = useReducedMotion();
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2">
      <Reveal>
        <Eyebrow>{d.home.contributeEyebrow}</Eyebrow>
        <h2 className="mt-6 font-display text-3xl sm:text-4xl">
          {d.home.contributeH2}
        </h2>
        <p className={`mt-4 leading-relaxed ${mutedCls}`}>{d.home.contributeP}</p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className={`mt-8 ${btnPrimary}`}
        >
          <Icon icon="ph:git-pull-request" className="size-4" />
          {d.home.contributeCta}
        </a>
      </Reveal>
      <ul className="space-y-3 self-center">
        {d.home.contributions.map((c, i) => (
          <motion.li
            key={c.label}
            className={`flex items-center gap-4 ${cardCls} px-5 py-4`}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.06 }}
          >
            <Icon icon={c.icon} className={`size-5 shrink-0 ${brandCls}`} />
            <span className="text-sm font-medium">{c.label}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

export default function AboutClient() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Intro />
        <Principles />
        <Story />
        <Contribute />
      </main>
      <Footer />
    </>
  );
}
