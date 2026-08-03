"use client";

import Link from "next/link";
import { useEffect, useMemo, useReducer } from "react";
import { useDict, useLocale } from "@/components/locale";
import { brandCls, lineCls, mutedCls, useMounted } from "@/components/ui";
import { localePath, type Locale } from "@/lib/i18n";
import { type CountryCity, countryRows, type CountryRow } from "@/lib/prayer-board";
import { type MethodKey, SALAH_ORDER } from "@/lib/prayer-calc";
import { cityPath } from "@/lib/prayer-paths";

/** Today's five prayers across a country's largest cities, side by side.
 *
 * This is the country page's reason to exist. "Prayer times in Morocco" has
 * no single answer — Oujda and Agadir are eleven minutes apart — and showing
 * that spread answers the query honestly while linking to the pages that
 * answer it exactly.
 *
 * Server-rendered from the build day so it is in the HTML, then recomputed
 * for the reader's today on mount, exactly like the city board. */
export function CountryToday({
  countrySlug,
  countryName,
  cities,
  method,
  initial,
}: {
  countrySlug: string;
  countryName: string;
  cities: CountryCity[];
  method: MethodKey;
  initial: CountryRow[];
}) {
  const d = useDict();
  const locale = useLocale() as Locale;
  const p = d.prayerPlaces;
  const t = d.tools.prayer;

  const mounted = useMounted();
  // A minute is plenty: nothing in this table changes faster than a day, and
  // the interval only exists to catch midnight passing under a tab that was
  // left open overnight.
  const [, tick] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // A dozen cities is a dozen sun positions — cheap enough to redo on every
  // tick rather than reason about when a memo should expire.
  const rows = mounted ? countryRows(cities, method) : initial;
  const byName = useMemo(() => new Map(cities.map((c) => [c.slug, c.name])), [cities]);

  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl">{p.countryToday(countryName)}</h2>
      <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${mutedCls}`}>
        {p.countryTodayBody(rows.length)}
      </p>

      <div className={`mt-5 overflow-x-auto rounded-2xl border ${lineCls}`}>
        <table className="w-full min-w-136 border-collapse bg-white text-sm dark:bg-zinc-900/60">
          <caption className="sr-only">{p.countryToday(countryName)}</caption>
          <thead>
            <tr className={`border-b ${lineCls}`}>
              <th scope="col" className="px-4 py-3 text-start font-semibold">
                {t.city}
              </th>
              {SALAH_ORDER.map((key) => (
                <th key={key} scope="col" className="px-3 py-3 text-start font-semibold">
                  {t.prayerNames[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug} className={`border-b last:border-0 ${lineCls}`}>
                <th scope="row" className="px-4 py-2.5 text-start font-normal">
                  <Link
                    href={localePath(locale, cityPath(countrySlug, row.slug))}
                    className={`font-medium transition-colors hover:underline ${brandCls}`}
                  >
                    {byName.get(row.slug)}
                  </Link>
                </th>
                {SALAH_ORDER.map((key) => (
                  <td
                    key={key}
                    dir="ltr"
                    className="px-3 py-2.5 font-mono text-xs tabular-nums rtl:text-end"
                  >
                    {row.times[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
