"use client";

import { Icon } from "@iconify/react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Article } from "@/components/article";
import { Faq } from "@/components/faq";
import { useDict } from "@/components/locale";
import {
  brandCls,
  cardCls,
  Field,
  Input,
  lineCls,
  mutedCls,
  Select,
  ToolShell,
} from "@/components/ui";
import { JsonLd, faqJsonLd } from "@/lib/seo";

const NISAB_GOLD_GRAMS = 85;
const NISAB_SILVER_GRAMS = 595;
const ZAKAT_RATE = 0.025;

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

const DEFAULTS = {
  cash: "",
  goldGrams: "",
  goldPrice: "105",
  silverGrams: "",
  silverPrice: "1.20",
  investments: "",
  business: "",
  liabilities: "",
};

export default function ZakatClient() {
  const d = useDict();
  const t = d.tools.zakat;
  const reduce = useReducedMotion();
  const [currency, setCurrency] = useState("USD");
  const [cash, setCash] = useState(DEFAULTS.cash);
  const [goldGrams, setGoldGrams] = useState(DEFAULTS.goldGrams);
  const [goldPrice, setGoldPrice] = useState(DEFAULTS.goldPrice);
  const [silverGrams, setSilverGrams] = useState(DEFAULTS.silverGrams);
  const [silverPrice, setSilverPrice] = useState(DEFAULTS.silverPrice);
  const [investments, setInvestments] = useState(DEFAULTS.investments);
  const [business, setBusiness] = useState(DEFAULTS.business);
  const [liabilities, setLiabilities] = useState(DEFAULTS.liabilities);
  const [nisabBasis, setNisabBasis] = useState<"gold" | "silver">("silver");

  const goldValue = num(goldGrams) * num(goldPrice);
  const silverValue = num(silverGrams) * num(silverPrice);
  const total =
    num(cash) + goldValue + silverValue + num(investments) + num(business) - num(liabilities);
  const nisab =
    nisabBasis === "gold"
      ? NISAB_GOLD_GRAMS * num(goldPrice)
      : NISAB_SILVER_GRAMS * num(silverPrice);
  const due = total >= nisab && nisab > 0;
  const zakat = due ? total * ZAKAT_RATE : 0;
  const pct = nisab > 0 ? Math.min(100, Math.max(0, (Math.max(0, total) / nisab) * 100)) : 0;

  const fmt = (n: number) =>
    `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;

  function reset() {
    setCash(DEFAULTS.cash);
    setGoldGrams(DEFAULTS.goldGrams);
    setSilverGrams(DEFAULTS.silverGrams);
    setInvestments(DEFAULTS.investments);
    setBusiness(DEFAULTS.business);
    setLiabilities(DEFAULTS.liabilities);
  }

  return (
    <ToolShell icon="ph:coins" title={t.title} side={t.side} intro={t.intro} wide>
      <JsonLd data={faqJsonLd(t.faq)} />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className={`${cardCls} p-5`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-lg">
              <Icon icon="ph:wallet" className={`size-5 ${brandCls}`} />
              {t.assetsHeading}
            </h2>
            <button
              type="button"
              onClick={reset}
              className={`inline-flex items-center gap-1.5 text-sm ${mutedCls} transition-colors hover:text-emerald-700 dark:hover:text-emerald-400`}
            >
              <Icon icon="ph:arrow-counter-clockwise" className="size-4" />
              {t.reset}
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={t.currency}>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase().slice(0, 4))} />
            </Field>
            <Field label={t.cash}>
              <Input inputMode="decimal" placeholder="0" value={cash} onChange={(e) => setCash(e.target.value)} />
            </Field>
            <Field label={t.goldGrams}>
              <Input inputMode="decimal" placeholder="0" value={goldGrams} onChange={(e) => setGoldGrams(e.target.value)} />
            </Field>
            <Field label={t.goldPrice(currency)} hint={t.goldPriceHint}>
              <Input inputMode="decimal" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} />
            </Field>
            <Field label={t.silverGrams}>
              <Input inputMode="decimal" placeholder="0" value={silverGrams} onChange={(e) => setSilverGrams(e.target.value)} />
            </Field>
            <Field label={t.silverPrice(currency)}>
              <Input inputMode="decimal" value={silverPrice} onChange={(e) => setSilverPrice(e.target.value)} />
            </Field>
            <Field label={t.investments} hint={t.investmentsHint}>
              <Input inputMode="decimal" placeholder="0" value={investments} onChange={(e) => setInvestments(e.target.value)} />
            </Field>
            <Field label={t.business} hint={t.businessHint}>
              <Input inputMode="decimal" placeholder="0" value={business} onChange={(e) => setBusiness(e.target.value)} />
            </Field>
          </div>

          <h2 className={`mt-6 flex items-center gap-2 border-t ${lineCls} pt-5 font-display text-lg`}>
            <Icon icon="ph:scales" className={`size-5 ${brandCls}`} />
            {t.deductionsHeading}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={t.liabilities} hint={t.liabilitiesHint}>
              <Input inputMode="decimal" placeholder="0" value={liabilities} onChange={(e) => setLiabilities(e.target.value)} />
            </Field>
            <Field label={t.nisabBasis} hint={t.nisabHint}>
              <Select value={nisabBasis} onChange={(e) => setNisabBasis(e.target.value as "gold" | "silver")}>
                <option value="silver">{t.silverOpt(NISAB_SILVER_GRAMS)}</option>
                <option value="gold">{t.goldOpt(NISAB_GOLD_GRAMS)}</option>
              </Select>
            </Field>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className={`${cardCls} p-5`}>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className={mutedCls}>{t.totalWealth}</dt>
                <dd className="font-mono font-semibold" dir="ltr">{fmt(Math.max(0, total))}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className={mutedCls}>{t.nisabLabel(t.basisNames[nisabBasis])}</dt>
                <dd className="font-mono" dir="ltr">{fmt(nisab)}</dd>
              </div>
            </dl>

            {/* progress toward the nisab */}
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className={mutedCls}>{t.nisabProgress}</span>
                <span className={`font-mono ${due ? brandCls : mutedCls}`} dir="ltr">{Math.round(pct)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <motion.div
                  className={`h-full rounded-full ${due ? "bg-emerald-600 dark:bg-emerald-400" : "bg-amber-400"}`}
                  animate={{ width: `${pct}%` }}
                  transition={reduce ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className={`mt-4 border-t ${lineCls} pt-4`}>
              {due ? (
                <>
                  <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}>
                    {t.due}
                  </p>
                  <motion.p
                    key={Math.round(zakat)}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-1 font-mono text-3xl font-semibold text-emerald-700 dark:text-emerald-400"
                    dir="ltr"
                  >
                    {fmt(zakat)}
                  </motion.p>
                </>
              ) : (
                <p className={`text-sm leading-relaxed ${mutedCls}`}>{t.belowNisab}</p>
              )}
            </div>
          </div>
          <p className={`text-xs leading-relaxed ${mutedCls}`}>{t.disclaimer}</p>
        </div>
      </div>

      <Article
        eyebrow={t.content.eyebrow}
        heading={t.content.heading}
        intro={t.content.intro}
        sections={t.content.sections}
      />
      <Faq eyebrow={t.faqEyebrow} heading={t.faqH2} items={t.faq} />
    </ToolShell>
  );
}
