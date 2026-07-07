"use client";

import { useState } from "react";
import { useDict } from "@/components/locale";
import {
  Field,
  ToolShell,
  cardCls,
  inputCls,
  lineCls,
  mutedCls,
} from "@/components/ui";

const NISAB_GOLD_GRAMS = 85;
const NISAB_SILVER_GRAMS = 595;
const ZAKAT_RATE = 0.025;

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export default function ZakatClient() {
  const d = useDict();
  const t = d.tools.zakat;
  const [currency, setCurrency] = useState("USD");
  const [cash, setCash] = useState("");
  const [goldGrams, setGoldGrams] = useState("");
  const [goldPrice, setGoldPrice] = useState("105");
  const [silverGrams, setSilverGrams] = useState("");
  const [silverPrice, setSilverPrice] = useState("1.20");
  const [investments, setInvestments] = useState("");
  const [business, setBusiness] = useState("");
  const [liabilities, setLiabilities] = useState("");
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

  const fmt = (n: number) =>
    `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;

  return (
    <ToolShell icon="ph:coins" title={t.title} side={t.side} intro={t.intro}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className={`${cardCls} space-y-4 p-5`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.currency}>
              <input className={inputCls} value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase().slice(0, 4))} />
            </Field>
            <Field label={t.cash}>
              <input className={inputCls} inputMode="decimal" placeholder="0" value={cash} onChange={(e) => setCash(e.target.value)} />
            </Field>
            <Field label={t.goldGrams}>
              <input className={inputCls} inputMode="decimal" placeholder="0" value={goldGrams} onChange={(e) => setGoldGrams(e.target.value)} />
            </Field>
            <Field label={t.goldPrice(currency)} hint={t.goldPriceHint}>
              <input className={inputCls} inputMode="decimal" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} />
            </Field>
            <Field label={t.silverGrams}>
              <input className={inputCls} inputMode="decimal" placeholder="0" value={silverGrams} onChange={(e) => setSilverGrams(e.target.value)} />
            </Field>
            <Field label={t.silverPrice(currency)}>
              <input className={inputCls} inputMode="decimal" value={silverPrice} onChange={(e) => setSilverPrice(e.target.value)} />
            </Field>
            <Field label={t.investments} hint={t.investmentsHint}>
              <input className={inputCls} inputMode="decimal" placeholder="0" value={investments} onChange={(e) => setInvestments(e.target.value)} />
            </Field>
            <Field label={t.business} hint={t.businessHint}>
              <input className={inputCls} inputMode="decimal" placeholder="0" value={business} onChange={(e) => setBusiness(e.target.value)} />
            </Field>
            <Field label={t.liabilities} hint={t.liabilitiesHint}>
              <input className={inputCls} inputMode="decimal" placeholder="0" value={liabilities} onChange={(e) => setLiabilities(e.target.value)} />
            </Field>
            <Field label={t.nisabBasis} hint={t.nisabHint}>
              <select className={inputCls} value={nisabBasis} onChange={(e) => setNisabBasis(e.target.value as "gold" | "silver")}>
                <option value="silver">{t.silverOpt(NISAB_SILVER_GRAMS)}</option>
                <option value="gold">{t.goldOpt(NISAB_GOLD_GRAMS)}</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="space-y-4 self-start">
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
            <div className={`mt-4 border-t ${lineCls} pt-4`}>
              {due ? (
                <>
                  <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}>
                    {t.due}
                  </p>
                  <p className="mt-1 font-mono text-3xl font-semibold text-emerald-700 dark:text-emerald-400" dir="ltr">
                    {fmt(zakat)}
                  </p>
                </>
              ) : (
                <p className={`text-sm leading-relaxed ${mutedCls}`}>{t.belowNisab}</p>
              )}
            </div>
          </div>
          <p className={`text-xs leading-relaxed ${mutedCls}`}>{t.disclaimer}</p>
        </div>
      </div>
    </ToolShell>
  );
}
