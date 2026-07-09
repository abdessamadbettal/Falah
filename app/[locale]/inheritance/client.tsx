"use client";

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
  ToolShell,
} from "@/components/ui";
import type { Dict } from "@/lib/i18n";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import type { ToolArticle } from "@/lib/articles";

/* ------------------------- exact fraction helpers ------------------------- */

type Frac = { n: number; d: number };
const F = (n: number, d = 1): Frac => simplify({ n, d });
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
function simplify(f: Frac): Frac {
  const g = gcd(Math.abs(f.n), Math.abs(f.d)) || 1;
  return { n: f.n / g, d: f.d / g };
}
const add = (a: Frac, b: Frac) => F(a.n * b.d + b.n * a.d, a.d * b.d);
const mul = (a: Frac, b: Frac) => F(a.n * b.n, a.d * b.d);
const toNum = (f: Frac) => f.n / f.d;
const fracLabel = (f: Frac) => (f.n === 0 ? "0" : f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`);

/* ------------------------------- the solver ------------------------------- */

type Heirs = {
  husband: boolean;
  wives: number;
  sons: number;
  daughters: number;
  father: boolean;
  mother: boolean;
  grandfather: boolean;
  grandmother: boolean;
  brothers: number;
  sisters: number;
};

type Share = { label: string; fraction: Frac; perPerson?: Frac; count: number; spouse?: boolean };

type T = Dict["tools"]["inheritance"];

function solve(h: Heirs, t: T): { shares: Share[]; notes: string[] } {
  const notes: string[] = [];
  const shares: Share[] = [];
  const hasChild = h.sons + h.daughters > 0;
  const fatherFigure = h.father || (!h.father && h.grandfather);
  const siblingCount = h.brothers + h.sisters;

  // Siblings are excluded by a son, father, or grandfather.
  const siblingsBlocked = h.sons > 0 || fatherFigure;
  if (siblingsBlocked && siblingCount > 0) {
    notes.push(t.noteBlocked);
  }

  let fixed = F(0);
  const push = (label: string, fraction: Frac, count = 1, spouse = false) => {
    shares.push({
      label,
      fraction,
      count,
      spouse,
      perPerson: count > 1 ? mul(fraction, F(1, count)) : undefined,
    });
    fixed = add(fixed, fraction);
  };

  if (h.husband) push(t.husband, hasChild ? F(1, 4) : F(1, 2), 1, true);
  if (h.wives > 0)
    push(h.wives > 1 ? t.hWives(h.wives) : t.hWife, hasChild ? F(1, 8) : F(1, 4), h.wives, true);
  if (h.mother) push(t.mother, hasChild || siblingCount >= 2 ? F(1, 6) : F(1, 3));
  if (h.grandmother && !h.mother) push(t.grandmother, F(1, 6));

  let fatherLabel: string | null = null;
  if (h.father) fatherLabel = t.father;
  else if (h.grandfather) fatherLabel = t.hGrandfather;
  if (fatherLabel && hasChild) push(fatherLabel, F(1, 6));

  // Daughters' fixed shares apply only when there is no son to make them residuaries.
  if (h.sons === 0 && h.daughters > 0) {
    push(
      h.daughters > 1 ? t.hDaughters(h.daughters) : t.hDaughter,
      h.daughters > 1 ? F(2, 3) : F(1, 2),
      h.daughters,
    );
  }

  // Sisters take the daughters' fixed shares when no children, no father figure, no brothers.
  const sistersAsSharers =
    !hasChild && !fatherFigure && h.brothers === 0 && h.sisters > 0;
  if (sistersAsSharers) {
    push(
      h.sisters > 1 ? t.hSisters(h.sisters) : t.hSister,
      h.sisters > 1 ? F(2, 3) : F(1, 2),
      h.sisters,
    );
  }

  let residue = add(F(1), F(-fixed.n, fixed.d));

  if (toNum(residue) > 1e-12) {
    // Residuaries, in order of priority.
    if (h.sons > 0) {
      const units = h.sons * 2 + h.daughters;
      const sonShare = mul(residue, F(2 * h.sons, units));
      shares.push({ label: h.sons > 1 ? t.hSons(h.sons) : t.hSon, fraction: sonShare, count: h.sons, perPerson: h.sons > 1 ? mul(sonShare, F(1, h.sons)) : undefined });
      if (h.daughters > 0) {
        const dShare = mul(residue, F(h.daughters, units));
        shares.push({ label: h.daughters > 1 ? t.hDaughters(h.daughters) : t.hDaughter, fraction: dShare, count: h.daughters, perPerson: h.daughters > 1 ? mul(dShare, F(1, h.daughters)) : undefined });
      }
      notes.push(t.note411);
    } else if (fatherLabel) {
      const existing = shares.find((s) => s.label === fatherLabel);
      if (existing) {
        existing.fraction = add(existing.fraction, residue);
        notes.push(t.noteFatherResidue(fatherLabel));
      } else {
        shares.push({ label: fatherLabel, fraction: residue, count: 1 });
      }
    } else if (!siblingsBlocked && h.brothers > 0) {
      const units = h.brothers * 2 + h.sisters;
      const bShare = mul(residue, F(2 * h.brothers, units));
      shares.push({ label: h.brothers > 1 ? t.hBrothers(h.brothers) : t.hBrother, fraction: bShare, count: h.brothers, perPerson: h.brothers > 1 ? mul(bShare, F(1, h.brothers)) : undefined });
      if (h.sisters > 0) {
        const sShare = mul(residue, F(h.sisters, units));
        shares.push({ label: h.sisters > 1 ? t.hSisters(h.sisters) : t.hSister, fraction: sShare, count: h.sisters, perPerson: h.sisters > 1 ? mul(sShare, F(1, h.sisters)) : undefined });
      }
    } else {
      distributeRadd(shares, residue, notes, t);
      residue = F(0);
    }
  } else if (toNum(fixed) > 1 + 1e-12) {
    // Awl: shares exceed the estate, so every share is scaled down pro rata.
    for (const s of shares) {
      s.fraction = mul(s.fraction, F(fixed.d, fixed.n));
      if (s.perPerson) s.perPerson = mul(s.fraction, F(1, s.count));
    }
    notes.push(t.noteAwl(fracLabel(fixed)));
  }

  return { shares, notes };
}

function distributeRadd(shares: Share[], residue: Frac, notes: string[], t: T) {
  const sharers = shares.filter((s) => !s.spouse);
  if (sharers.length > 0) {
    const base = sharers.reduce((acc, s) => add(acc, s.fraction), F(0));
    for (const s of sharers) {
      s.fraction = add(s.fraction, mul(residue, mul(s.fraction, F(base.d, base.n))));
      if (s.perPerson) s.perPerson = mul(s.fraction, F(1, s.count));
    }
    notes.push(t.noteRadd);
  } else if (shares.length > 0) {
    const base = shares.reduce((acc, s) => add(acc, s.fraction), F(0));
    for (const s of shares) {
      s.fraction = add(s.fraction, mul(residue, mul(s.fraction, F(base.d, base.n))));
      if (s.perPerson) s.perPerson = mul(s.fraction, F(1, s.count));
    }
    notes.push(t.noteRaddSpouse);
  } else {
    notes.push(t.noteBaytAlMal);
  }
}

/* ---------------------------------- page ---------------------------------- */

export default function InheritanceClient({ article }: { article: ToolArticle }) {
  const d = useDict();
  const t = d.tools.inheritance;
  const [estate, setEstate] = useState("100000");
  const [heirs, setHeirs] = useState<Heirs>({
    husband: false,
    wives: 0,
    sons: 0,
    daughters: 0,
    father: false,
    mother: false,
    grandfather: false,
    grandmother: false,
    brothers: 0,
    sisters: 0,
  });

  const estateNum = Math.max(0, parseFloat(estate) || 0);
  const anyHeir =
    heirs.husband || heirs.wives > 0 || heirs.sons > 0 || heirs.daughters > 0 ||
    heirs.father || heirs.mother || heirs.grandfather || heirs.grandmother ||
    heirs.brothers > 0 || heirs.sisters > 0;
  const result = anyHeir ? solve(heirs, t) : null;

  const reduce = useReducedMotion();
  const set = <K extends keyof Heirs>(key: K, value: Heirs[K]) =>
    setHeirs((h) => ({ ...h, [key]: value }));

  const countInput = (label: string, key: keyof Heirs, max = 20) => (
    <Field label={label}>
      <Input
        type="number"
        min={0}
        max={max}
        value={heirs[key] as number}
        onChange={(e) => set(key, Math.max(0, Math.min(max, Number(e.target.value) || 0)) as never)}
      />
    </Field>
  );

  const checkbox = (label: string, key: keyof Heirs, disabled = false) => (
    <label className={`flex items-center gap-2 text-sm font-medium ${disabled ? "opacity-40" : ""}`}>
      <input
        type="checkbox"
        className="size-4 accent-emerald-700 dark:accent-emerald-400"
        checked={heirs[key] as boolean}
        disabled={disabled}
        onChange={(e) => set(key, e.target.checked as never)}
      />
      {label}
    </label>
  );

  return (
    <ToolShell icon="ph:tree-structure" title={t.title} side={t.side} intro={t.intro} wide>
      <JsonLd data={faqJsonLd(t.faq)} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`${cardCls} space-y-5 p-5`}>
          <Field label={t.estate} hint={t.estateHint}>
            <Input inputMode="decimal" value={estate} onChange={(e) => setEstate(e.target.value)} />
          </Field>
          <div>
            <p className="mb-2 text-sm font-semibold">{t.spouse}</p>
            <div className="grid grid-cols-2 items-end gap-3">
              {checkbox(t.husband, "husband", heirs.wives > 0)}
              {countInput(t.wivesLabel, "wives", 4)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">{t.descendants}</p>
            <div className="grid grid-cols-2 gap-3">
              {countInput(t.sonsLabel, "sons")}
              {countInput(t.daughtersLabel, "daughters")}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">{t.ascendants}</p>
            <div className="grid grid-cols-2 gap-2">
              {checkbox(t.father, "father")}
              {checkbox(t.mother, "mother")}
              {checkbox(t.grandfather, "grandfather", heirs.father)}
              {checkbox(t.grandmother, "grandmother", heirs.mother)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">{t.siblings}</p>
            <div className="grid grid-cols-2 gap-3">
              {countInput(t.brothersLabel, "brothers")}
              {countInput(t.sistersLabel, "sisters")}
            </div>
          </div>
        </div>

        <div className="space-y-4 self-start">
          {result && result.shares.length > 0 ? (
            <div className={`overflow-hidden rounded-2xl border ${lineCls} bg-white dark:bg-zinc-900/60`}>
              <div className={`flex items-center justify-between border-b ${lineCls} bg-zinc-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide dark:bg-zinc-900`}>
                <span>{t.heir}</span>
                <span>{t.amount}</span>
              </div>
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
                {result.shares.map((s, i) => {
                  const frac = toNum(s.fraction);
                  return (
                    <li key={s.label} className="px-5 py-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-medium">{s.label}</span>
                        <span className="font-mono text-sm" dir="ltr">
                          {(estateNum * frac).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <motion.div
                            className="h-full rounded-full bg-emerald-600 dark:bg-emerald-400"
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: `${Math.min(100, frac * 100)}%` }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : i * 0.04 }}
                          />
                        </div>
                        <span className={`shrink-0 font-mono text-xs ${brandCls}`} dir="ltr">
                          {fracLabel(s.fraction)}
                          {s.perPerson ? (
                            <span className={`ms-1 ${mutedCls}`}>{t.each(fracLabel(s.perPerson))}</span>
                          ) : null}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className={`${cardCls} p-5 text-sm ${mutedCls}`}>{t.selectPrompt}</p>
          )}
          {result?.notes.map((note) => (
            <p key={note} className={`text-xs leading-relaxed ${mutedCls}`}>• {note}</p>
          ))}
          <p className="rounded-xl border border-amber-400/60 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-200">
            {t.disclaimer}
          </p>
        </div>
      </div>

      <Article {...article} />
      <Faq eyebrow={t.faqEyebrow} heading={t.faqH2} items={t.faq} />
    </ToolShell>
  );
}
