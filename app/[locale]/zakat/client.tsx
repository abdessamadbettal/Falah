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
import type { ToolArticle } from "@/lib/articles";

const NISAB_GOLD_GRAMS = 85;
const NISAB_SILVER_GRAMS = 595;
const ZAKAT_RATE = 0.025;

const COMMON_CURRENCIES = [
  "USD", "EUR", "GBP", "SAR", "AED", "KWD", "BHD", "OMR", "QAR", "JOD", 
  "DZD", "MAD", "TND", "EGP", "LBP", "TRY", "PKR", "INR", "IDR", "MYR", 
  "CAD", "AUD", "SGD", "ZAR", "NGN"
];

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

type ZakatLogEntry = {
  id: string;
  date: string;
  yearLabel: string;
  totalWealth: number;
  zakatDue: number;
  currency: string;
  nisabBasis: "gold" | "silver";
  due: boolean;
};

export default function ZakatClient({ article }: { article: ToolArticle }) {
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

  const [logs, setLogs] = useState<ZakatLogEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("falah_zakat_logs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [customYearLabel, setCustomYearLabel] = useState("");
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

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

  const fmt = (n: number, c = currency) =>
    `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${c}`;

  function reset() {
    setCash(DEFAULTS.cash);
    setGoldGrams(DEFAULTS.goldGrams);
    setSilverGrams(DEFAULTS.silverGrams);
    setInvestments(DEFAULTS.investments);
    setBusiness(DEFAULTS.business);
    setLiabilities(DEFAULTS.liabilities);
  }

  function saveToHistory() {
    const label = customYearLabel.trim() || `${new Date().getFullYear()}`;
    const newEntry: ZakatLogEntry = {
      id: String(Date.now()),
      date: new Date().toLocaleDateString(),
      yearLabel: label,
      totalWealth: Math.max(0, total),
      zakatDue: zakat,
      currency,
      nisabBasis,
      due,
    };
    const updated = [newEntry, ...logs];
    setLogs(updated);
    try {
      localStorage.setItem("falah_zakat_logs", JSON.stringify(updated));
    } catch { }
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2500);
  }

  function deleteLog(id: string) {
    const updated = logs.filter((l) => l.id !== id);
    setLogs(updated);
    try {
      localStorage.setItem("falah_zakat_logs", JSON.stringify(updated));
    } catch { }
  }

  function clearAllLogs() {
    setLogs([]);
    try {
      localStorage.removeItem("falah_zakat_logs");
    } catch { }
  }

  function handlePrint() {
    window.print();
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
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {COMMON_CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label={t.cash}>
              <Input inputMode="decimal" placeholder="0" value={cash} onChange={(e) => setCash(e.target.value.replace(/[^0-9.]/g, ""))} />
            </Field>
            <Field label={t.goldGrams}>
              <Input inputMode="decimal" placeholder="0" value={goldGrams} onChange={(e) => setGoldGrams(e.target.value.replace(/[^0-9.]/g, ""))} />
            </Field>
            <Field label={t.goldPrice(currency)} hint={t.goldPriceHint}>
              <Input inputMode="decimal" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value.replace(/[^0-9.]/g, ""))} />
            </Field>
            <Field label={t.silverGrams}>
              <Input inputMode="decimal" placeholder="0" value={silverGrams} onChange={(e) => setSilverGrams(e.target.value.replace(/[^0-9.]/g, ""))} />
            </Field>
            <Field label={t.silverPrice(currency)}>
              <Input inputMode="decimal" value={silverPrice} onChange={(e) => setSilverPrice(e.target.value.replace(/[^0-9.]/g, ""))} />
            </Field>
            <Field label={t.investments} hint={t.investmentsHint}>
              <Input inputMode="decimal" placeholder="0" value={investments} onChange={(e) => setInvestments(e.target.value.replace(/[^0-9.]/g, ""))} />
            </Field>
            <Field label={t.business} hint={t.businessHint}>
              <Input inputMode="decimal" placeholder="0" value={business} onChange={(e) => setBusiness(e.target.value.replace(/[^0-9.]/g, ""))} />
            </Field>
          </div>

          <h2 className={`mt-6 flex items-center gap-2 border-t ${lineCls} pt-5 font-display text-lg`}>
            <Icon icon="ph:scales" className={`size-5 ${brandCls}`} />
            {t.deductionsHeading}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={t.liabilities} hint={t.liabilitiesHint}>
              <Input inputMode="decimal" placeholder="0" value={liabilities} onChange={(e) => setLiabilities(e.target.value.replace(/[^0-9.]/g, ""))} />
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

            {/* Action Buttons: Save Log & Export Summary */}
            <div className={`mt-5 border-t ${lineCls} pt-4 flex flex-col gap-2.5`}>
              <div className="flex items-center gap-2">
                <Input
                  placeholder={t.yearLabel}
                  value={customYearLabel}
                  onChange={(e) => setCustomYearLabel(e.target.value)}
                  className="text-xs py-1.5"
                />
                <button
                  type="button"
                  onClick={saveToHistory}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-800 dark:bg-emerald-400 dark:text-emerald-950"
                >
                  <Icon icon="ph:bookmark-simple-fill" className="size-3.5" />
                  {showSavedFeedback ? t.savedSuccess : t.saveLog}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <Icon icon="ph:printer-fill" className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                {t.exportSummary}
              </button>
            </div>
          </div>
          <p className={`text-xs leading-relaxed ${mutedCls}`}>{t.disclaimer}</p>
        </div>
      </div>

      {/* ---- Annual Zakat Log History Section ---- */}
      <section className="mt-8">
        <div className={`${cardCls} p-5 sm:p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl">
              <Icon icon="ph:clock-counter-clockwise" className={`size-5 ${brandCls}`} />
              {t.historyHeading}
            </h2>
            {logs.length > 0 && (
              <button
                type="button"
                onClick={clearAllLogs}
                className={`inline-flex items-center gap-1 text-xs ${mutedCls} hover:text-red-600 dark:hover:text-red-400`}
              >
                <Icon icon="ph:trash" className="size-3.5" />
                {t.clearHistory}
              </button>
            )}
          </div>

          {logs.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead>
                  <tr className={`border-b ${lineCls} text-xs font-semibold uppercase ${mutedCls}`}>
                    <th className="pb-3 text-start">{t.yearLabel}</th>
                    <th className="pb-3 text-start">{t.totalWealth}</th>
                    <th className="pb-3 text-start">{t.due}</th>
                    <th className="pb-3 text-end"></th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${lineCls}`}>
                  {logs.map((log) => (
                    <tr key={log.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                      <td className="py-3 font-medium">
                        <div>{log.yearLabel}</div>
                        <div className={`text-xs ${mutedCls}`}>{log.date}</div>
                      </td>
                      <td className="py-3 font-mono" dir="ltr">
                        {fmt(log.totalWealth, log.currency)}
                      </td>
                      <td className="py-3 font-mono font-semibold text-emerald-700 dark:text-emerald-400" dir="ltr">
                        {log.due ? fmt(log.zakatDue, log.currency) : fmt(0, log.currency)}
                      </td>
                      <td className="py-3 text-end">
                        <button
                          type="button"
                          onClick={() => deleteLog(log.id)}
                          aria-label={t.clearHistory}
                          className={`p-1.5 ${mutedCls} hover:text-red-600 dark:hover:text-red-400`}
                        >
                          <Icon icon="ph:x" className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={`mt-3 text-sm ${mutedCls}`}>{t.noHistory}</p>
          )}
        </div>
      </section>

      {/* ---- Printable / Downloadable Export Summary Modal ---- */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b pb-4 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Icon icon="ph:receipt" className="size-6 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-display text-xl font-bold">{t.title} — {t.exportSummary}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <Icon icon="ph:x" className="size-5" />
              </button>
            </div>

            {/* Printable Card Area */}
            <div className="my-6 space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Falah.io — Zakat Summary</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>

              <div className="grid gap-2 text-sm">
                <div className="flex justify-between border-b pb-2 dark:border-zinc-800">
                  <span className={mutedCls}>{t.cash}</span>
                  <span className="font-mono font-medium" dir="ltr">{fmt(num(cash))}</span>
                </div>
                <div className="flex justify-between border-b pb-2 dark:border-zinc-800">
                  <span className={mutedCls}>{t.goldGrams} ({goldGrams || 0}g)</span>
                  <span className="font-mono font-medium" dir="ltr">{fmt(goldValue)}</span>
                </div>
                <div className="flex justify-between border-b pb-2 dark:border-zinc-800">
                  <span className={mutedCls}>{t.silverGrams} ({silverGrams || 0}g)</span>
                  <span className="font-mono font-medium" dir="ltr">{fmt(silverValue)}</span>
                </div>
                <div className="flex justify-between border-b pb-2 dark:border-zinc-800">
                  <span className={mutedCls}>{t.investments}</span>
                  <span className="font-mono font-medium" dir="ltr">{fmt(num(investments))}</span>
                </div>
                <div className="flex justify-between border-b pb-2 dark:border-zinc-800">
                  <span className={mutedCls}>{t.business}</span>
                  <span className="font-mono font-medium" dir="ltr">{fmt(num(business))}</span>
                </div>
                <div className="flex justify-between border-b pb-2 text-red-600 dark:border-zinc-800 dark:text-red-400">
                  <span>− {t.liabilities}</span>
                  <span className="font-mono font-medium" dir="ltr">− {fmt(num(liabilities))}</span>
                </div>
              </div>

              <div className="mt-4 border-t-2 border-emerald-600/30 pt-3">
                <div className="flex justify-between font-medium">
                  <span>{t.totalWealth}</span>
                  <span className="font-mono font-bold" dir="ltr">{fmt(Math.max(0, total))}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  <span>{t.nisabLabel(t.basisNames[nisabBasis])}</span>
                  <span className="font-mono" dir="ltr">{fmt(nisab)}</span>
                </div>
                <div className="flex justify-between items-baseline mt-3 pt-3 border-t dark:border-zinc-800">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">{t.due}</span>
                  <span className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400" dir="ltr">
                    {due ? fmt(zakat) : fmt(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-800 dark:bg-emerald-400 dark:text-emerald-950"
              >
                <Icon icon="ph:printer-fill" className="size-4" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <Article {...article} />
      <Faq eyebrow={t.faqEyebrow} heading={t.faqH2} items={t.faq} />
    </ToolShell>
  );
}
