"use client";

import { useState } from "react";
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

export default function ZakatPage() {
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
    <ToolShell
      icon="ph:coins"
      title="Zakat Calculator"
      arabic="حاسبة الزكاة"
      intro="Add up your zakatable wealth, compare it with the nisab, and get the 2.5% due — all computed on your device. Nothing you type is sent anywhere."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className={`${cardCls} space-y-4 p-5`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Currency">
              <input className={inputCls} value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase().slice(0, 4))} />
            </Field>
            <Field label="Cash & bank balances">
              <input className={inputCls} inputMode="decimal" placeholder="0" value={cash} onChange={(e) => setCash(e.target.value)} />
            </Field>
            <Field label="Gold (grams)">
              <input className={inputCls} inputMode="decimal" placeholder="0" value={goldGrams} onChange={(e) => setGoldGrams(e.target.value)} />
            </Field>
            <Field label={`Gold price per gram (${currency})`} hint="Check today's price with your local dealer.">
              <input className={inputCls} inputMode="decimal" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} />
            </Field>
            <Field label="Silver (grams)">
              <input className={inputCls} inputMode="decimal" placeholder="0" value={silverGrams} onChange={(e) => setSilverGrams(e.target.value)} />
            </Field>
            <Field label={`Silver price per gram (${currency})`}>
              <input className={inputCls} inputMode="decimal" value={silverPrice} onChange={(e) => setSilverPrice(e.target.value)} />
            </Field>
            <Field label="Investments & shares" hint="Stocks, funds, crypto held for gain.">
              <input className={inputCls} inputMode="decimal" placeholder="0" value={investments} onChange={(e) => setInvestments(e.target.value)} />
            </Field>
            <Field label="Business assets" hint="Trade goods and receivables.">
              <input className={inputCls} inputMode="decimal" placeholder="0" value={business} onChange={(e) => setBusiness(e.target.value)} />
            </Field>
            <Field label="Short-term liabilities" hint="Debts due now — subtracted from the total.">
              <input className={inputCls} inputMode="decimal" placeholder="0" value={liabilities} onChange={(e) => setLiabilities(e.target.value)} />
            </Field>
            <Field label="Nisab basis" hint="The silver nisab is lower; many scholars prefer it so more zakat reaches the poor.">
              <select className={inputCls} value={nisabBasis} onChange={(e) => setNisabBasis(e.target.value as "gold" | "silver")}>
                <option value="silver">Silver ({NISAB_SILVER_GRAMS} g)</option>
                <option value="gold">Gold ({NISAB_GOLD_GRAMS} g)</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="space-y-4 self-start">
          <div className={`${cardCls} p-5`}>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className={mutedCls}>Zakatable wealth</dt>
                <dd className="font-mono font-semibold">{fmt(Math.max(0, total))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className={mutedCls}>Nisab ({nisabBasis})</dt>
                <dd className="font-mono">{fmt(nisab)}</dd>
              </div>
            </dl>
            <div className={`mt-4 border-t ${lineCls} pt-4`}>
              {due ? (
                <>
                  <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}>
                    Zakat due (2.5%)
                  </p>
                  <p className="mt-1 font-mono text-3xl font-semibold text-emerald-700 dark:text-emerald-400">
                    {fmt(zakat)}
                  </p>
                </>
              ) : (
                <p className={`text-sm leading-relaxed ${mutedCls}`}>
                  Your wealth is below the nisab — no zakat is due. Voluntary charity (sadaqah) is
                  always rewarded.
                </p>
              )}
            </div>
          </div>
          <p className={`text-xs leading-relaxed ${mutedCls}`}>
            Zakat is due after one lunar year (hawl) above the nisab. This calculator covers the
            common cases; for complex holdings, ask a qualified scholar.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
