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

type Share = { label: string; fraction: Frac; perPerson?: Frac; count: number };

function solve(h: Heirs): { shares: Share[]; notes: string[] } {
  const notes: string[] = [];
  const shares: Share[] = [];
  const hasChild = h.sons + h.daughters > 0;
  const fatherFigure = h.father || (!h.father && h.grandfather);
  const siblingCount = h.brothers + h.sisters;

  // Siblings are excluded by a son, father, or grandfather.
  const siblingsBlocked = h.sons > 0 || fatherFigure;
  if (siblingsBlocked && siblingCount > 0) {
    notes.push("Brothers and sisters are excluded here (blocked by a son, father, or grandfather).");
  }

  let fixed = F(0);
  const push = (label: string, fraction: Frac, count = 1) => {
    shares.push({
      label,
      fraction,
      count,
      perPerson: count > 1 ? mul(fraction, F(1, count)) : undefined,
    });
    fixed = add(fixed, fraction);
  };

  if (h.husband) push("Husband", hasChild ? F(1, 4) : F(1, 2));
  if (h.wives > 0)
    push(h.wives > 1 ? `Wives (${h.wives}, shared)` : "Wife", hasChild ? F(1, 8) : F(1, 4), h.wives);
  if (h.mother)
    push("Mother", hasChild || siblingCount >= 2 ? F(1, 6) : F(1, 3));
  if (h.grandmother && !h.mother) push("Grandmother", F(1, 6));

  let fatherLabel: string | null = null;
  if (h.father) fatherLabel = "Father";
  else if (h.grandfather) fatherLabel = "Grandfather (in place of the father)";
  if (fatherLabel && hasChild) push(fatherLabel, F(1, 6));

  // Daughters' fixed shares apply only when there is no son to make them residuaries.
  if (h.sons === 0 && h.daughters > 0) {
    push(
      h.daughters > 1 ? `Daughters (${h.daughters}, shared)` : "Daughter",
      h.daughters > 1 ? F(2, 3) : F(1, 2),
      h.daughters,
    );
  }

  // Sisters take the daughters' fixed shares when no children, no father figure, no brothers.
  const sistersAsSharers =
    !hasChild && !fatherFigure && h.brothers === 0 && h.sisters > 0;
  if (sistersAsSharers) {
    push(
      h.sisters > 1 ? `Full sisters (${h.sisters}, shared)` : "Full sister",
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
      shares.push({ label: h.sons > 1 ? `Sons (${h.sons}, shared)` : "Son", fraction: sonShare, count: h.sons, perPerson: h.sons > 1 ? mul(sonShare, F(1, h.sons)) : undefined });
      if (h.daughters > 0) {
        const dShare = mul(residue, F(h.daughters, units));
        shares.push({ label: h.daughters > 1 ? `Daughters (${h.daughters}, shared)` : "Daughter", fraction: dShare, count: h.daughters, perPerson: h.daughters > 1 ? mul(dShare, F(1, h.daughters)) : undefined });
      }
      notes.push("Sons and daughters share the remainder, a son receiving twice a daughter's portion (Quran 4:11).");
    } else if (fatherLabel) {
      const existing = shares.find((s) => s.label === fatherLabel);
      if (existing) {
        existing.fraction = add(existing.fraction, residue);
        notes.push(`${fatherLabel} takes 1/6 plus the remainder (with only daughters present).`);
      } else {
        shares.push({ label: fatherLabel, fraction: residue, count: 1 });
      }
    } else if (!siblingsBlocked && h.brothers > 0) {
      const units = h.brothers * 2 + h.sisters;
      const bShare = mul(residue, F(2 * h.brothers, units));
      shares.push({ label: h.brothers > 1 ? `Full brothers (${h.brothers}, shared)` : "Full brother", fraction: bShare, count: h.brothers, perPerson: h.brothers > 1 ? mul(bShare, F(1, h.brothers)) : undefined });
      if (h.sisters > 0) {
        const sShare = mul(residue, F(h.sisters, units));
        shares.push({ label: h.sisters > 1 ? `Full sisters (${h.sisters}, shared)` : "Full sister", fraction: sShare, count: h.sisters, perPerson: h.sisters > 1 ? mul(sShare, F(1, h.sisters)) : undefined });
      }
    } else if (!siblingsBlocked && sistersAsSharers && h.daughters === 0) {
      // Sisters already took their fixed share; leftover goes to radd below.
      distributeRadd(shares, residue, notes);
      residue = F(0);
    } else {
      distributeRadd(shares, residue, notes);
      residue = F(0);
    }
  } else if (toNum(fixed) > 1 + 1e-12) {
    // Awl: shares exceed the estate, so every share is scaled down pro rata.
    for (const s of shares) {
      s.fraction = mul(s.fraction, F(fixed.d, fixed.n));
      if (s.perPerson) s.perPerson = mul(s.fraction, F(1, s.count));
    }
    notes.push(`The fixed shares exceeded the whole (${fracLabel(fixed)}), so all were proportionally reduced ('awl).`);
  }

  return { shares, notes };
}

function distributeRadd(shares: Share[], residue: Frac, notes: string[]) {
  const sharers = shares.filter((s) => !s.label.startsWith("Husband") && !s.label.startsWith("Wi"));
  if (sharers.length > 0) {
    const base = sharers.reduce((acc, s) => add(acc, s.fraction), F(0));
    for (const s of sharers) {
      s.fraction = add(s.fraction, mul(residue, mul(s.fraction, F(base.d, base.n))));
      if (s.perPerson) s.perPerson = mul(s.fraction, F(1, s.count));
    }
    notes.push("The remainder was returned proportionally to the blood-relative sharers (radd).");
  } else if (shares.length > 0) {
    const base = shares.reduce((acc, s) => add(acc, s.fraction), F(0));
    for (const s of shares) {
      s.fraction = add(s.fraction, mul(residue, mul(s.fraction, F(base.d, base.n))));
      if (s.perPerson) s.perPerson = mul(s.fraction, F(1, s.count));
    }
    notes.push("With no other heirs, the remainder was returned to the spouse.");
  } else {
    notes.push("With no listed heirs, the estate passes to the public treasury (bayt al-mal).");
  }
}

/* ---------------------------------- page ---------------------------------- */

export default function InheritancePage() {
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
  const result = anyHeir ? solve(heirs) : null;

  const set = <K extends keyof Heirs>(key: K, value: Heirs[K]) =>
    setHeirs((h) => ({ ...h, [key]: value }));

  const countInput = (label: string, key: keyof Heirs, max = 20) => (
    <Field label={label}>
      <input
        type="number"
        min={0}
        max={max}
        className={inputCls}
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
    <ToolShell
      icon="ph:tree-structure"
      title="Inheritance Calculator"
      arabic="حاسبة الفرائض"
      intro="Distribution of an estate among the most common heirs, following the fixed shares of Surah An-Nisa with 'awl and radd adjustments. Everything is computed locally."
      wide
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`${cardCls} space-y-5 p-5`}>
          <Field label="Net estate value" hint="After funeral costs, debts, and any bequest (wasiyyah, at most one third).">
            <input className={inputCls} inputMode="decimal" value={estate} onChange={(e) => setEstate(e.target.value)} />
          </Field>
          <div>
            <p className="mb-2 text-sm font-semibold">Spouse</p>
            <div className="grid grid-cols-2 items-end gap-3">
              {checkbox("Husband", "husband", heirs.wives > 0)}
              {countInput("Wives", "wives", 4)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Descendants</p>
            <div className="grid grid-cols-2 gap-3">
              {countInput("Sons", "sons")}
              {countInput("Daughters", "daughters")}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Ascendants</p>
            <div className="grid grid-cols-2 gap-2">
              {checkbox("Father", "father")}
              {checkbox("Mother", "mother")}
              {checkbox("Grandfather", "grandfather", heirs.father)}
              {checkbox("Grandmother", "grandmother", heirs.mother)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Full siblings</p>
            <div className="grid grid-cols-2 gap-3">
              {countInput("Brothers", "brothers")}
              {countInput("Sisters", "sisters")}
            </div>
          </div>
        </div>

        <div className="space-y-4 self-start">
          {result && result.shares.length > 0 ? (
            <div className={`overflow-hidden rounded-2xl border ${lineCls} bg-white dark:bg-zinc-900/60`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${lineCls} bg-zinc-50 text-left dark:bg-zinc-900`}>
                    <th className="px-4 py-3 font-semibold">Heir</th>
                    <th className="px-4 py-3 font-semibold">Share</th>
                    <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {result.shares.map((s) => (
                    <tr key={s.label}>
                      <td className="px-4 py-3">{s.label}</td>
                      <td className="px-4 py-3 font-mono text-emerald-700 dark:text-emerald-400">
                        {fracLabel(s.fraction)}
                        {s.perPerson ? (
                          <span className={`ml-1 ${mutedCls}`}>({fracLabel(s.perPerson)} each)</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {(estateNum * toNum(s.fraction)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={`${cardCls} p-5 text-sm ${mutedCls}`}>
              Select the surviving heirs to see the distribution.
            </p>
          )}
          {result?.notes.map((note) => (
            <p key={note} className={`text-xs leading-relaxed ${mutedCls}`}>• {note}</p>
          ))}
          <p className={`rounded-xl border border-amber-400/60 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-200`}>
            This covers the common heirs and standard Sunni rules (&rsquo;awl, radd, hijb). Rarer cases —
            paternal/maternal half-siblings, grandchildren of a deceased son, multiple grandmothers —
            need a qualified scholar. Always verify before dividing an actual estate.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
