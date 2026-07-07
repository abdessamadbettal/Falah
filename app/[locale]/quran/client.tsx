"use client";

import { useEffect, useState } from "react";
import { useDict } from "@/components/locale";
import {
  Field,
  ToolShell,
  cardCls,
  goldCls,
  inputCls,
  lineCls,
  mutedCls,
} from "@/components/ui";
import { fetchSurahEditions, useSurahs, type Ayah } from "@/lib/quran";

export default function QuranClient() {
  const d = useDict();
  const t = d.tools.quran;
  const { surahs, error: listError } = useSurahs();
  const [surahNumber, setSurahNumber] = useState(1);
  const [showTranslation, setShowTranslation] = useState(true);
  const [result, setResult] = useState<{ key: string; arabic: Ayah[]; translation: Ayah[] } | null>(null);
  const [fetchError, setFetchError] = useState<{ key: string; message: string } | null>(null);

  const edition = t.translationEdition;
  const key = `${surahNumber}:${edition}`;

  useEffect(() => {
    let cancelled = false;
    const requestKey = `${surahNumber}:${edition}`;
    fetchSurahEditions(surahNumber, ["quran-uthmani", edition])
      .then(([arabic, translation]) => {
        if (!cancelled) setResult({ key: requestKey, arabic, translation });
      })
      .catch(() => {
        if (!cancelled) setFetchError({ key: requestKey, message: t.errSurah });
      });
    return () => {
      cancelled = true;
    };
  }, [surahNumber, edition, t.errSurah]);

  const ayahs = result?.key === key ? result : null;
  const error = fetchError?.key === key ? fetchError.message : null;
  const loading = !ayahs && !error;
  const surah = surahs?.find((s) => s.number === surahNumber);

  return (
    <ToolShell icon="ph:book-open-text" title={t.title} side={t.side} intro={t.intro} wide>
      <div className={`${cardCls} flex flex-wrap items-end gap-4 p-5`}>
        <div className="min-w-56 flex-1">
          <Field label={t.surah}>
            <select
              className={inputCls}
              value={surahNumber}
              onChange={(e) => setSurahNumber(Number(e.target.value))}
              disabled={!surahs}
            >
              {(surahs ?? []).map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.englishName} — {s.englishNameTranslation}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={showTranslation}
            onChange={(e) => setShowTranslation(e.target.checked)}
            className="size-4 accent-emerald-700 dark:accent-emerald-400"
          />
          {t.showTranslation}
        </label>
      </div>

      {listError ? <p className="mt-6 text-sm text-red-600 dark:text-red-400">{t.errList}</p> : null}
      {error ? <p className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {loading && !listError ? <p className={`mt-6 text-sm ${mutedCls}`}>{t.loadingSurah}</p> : null}

      {!loading && ayahs && surah ? (
        <article className="mt-6">
          <header className={`rounded-2xl border ${lineCls} bg-emerald-50 p-6 text-center dark:bg-emerald-500/10`}>
            <p lang="ar" dir="rtl" className={`font-arabic text-4xl ${goldCls}`}>{surah.name}</p>
            <h2 className="mt-2 font-display text-2xl">
              {surah.englishName}
              <span className={`ms-2 text-base ${mutedCls}`}>— {surah.englishNameTranslation}</span>
            </h2>
            <p className={`mt-1 text-sm ${mutedCls}`}>
              {t.revelation[surah.revelationType] ?? surah.revelationType} · {surah.numberOfAyahs} {t.ayahs}
            </p>
          </header>
          <ol className="mt-4 space-y-4">
            {ayahs.arabic.map((ayah, i) => (
              <li key={ayah.numberInSurah} className={`${cardCls} p-5`}>
                <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-loose sm:text-3xl">
                  {ayah.text}
                  <span className={`mx-2 text-lg ${goldCls}`}>﴿{ayah.numberInSurah}﴾</span>
                </p>
                {showTranslation && ayahs.translation[i] ? (
                  <p
                    lang={edition.split(".")[0]}
                    dir={edition.startsWith("ar.") ? "rtl" : "ltr"}
                    className={`mt-3 border-t ${lineCls} pt-3 leading-relaxed ${edition.startsWith("ar.") ? "font-arabic text-lg" : ""} ${mutedCls}`}
                  >
                    {ayahs.translation[i].text}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </article>
      ) : null}
    </ToolShell>
  );
}
