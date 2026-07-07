"use client";

import { useEffect, useState } from "react";
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

export default function QuranPage() {
  const { surahs, error: listError } = useSurahs();
  const [surahNumber, setSurahNumber] = useState(1);
  const [showTranslation, setShowTranslation] = useState(true);
  const [result, setResult] = useState<{ key: number; arabic: Ayah[]; english: Ayah[] } | null>(null);
  const [fetchError, setFetchError] = useState<{ key: number; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSurahEditions(surahNumber, ["quran-uthmani", "en.sahih"])
      .then(([arabic, english]) => {
        if (!cancelled) setResult({ key: surahNumber, arabic, english });
      })
      .catch(() => {
        if (!cancelled)
          setFetchError({
            key: surahNumber,
            message: "Could not load this surah. Check your connection and try again.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [surahNumber]);

  const ayahs = result?.key === surahNumber ? result : null;
  const error = fetchError?.key === surahNumber ? fetchError.message : null;
  const loading = !ayahs && !error;
  const surah = surahs?.find((s) => s.number === surahNumber);

  return (
    <ToolShell
      icon="ph:book-open-text"
      title="Al-Qur'an Explorer"
      arabic="القرآن الكريم"
      intro="Read the Quran in the Uthmani script with the Saheeh International translation. Text is fetched from the open AlQuran.cloud API — no account, no tracking."
      wide
    >
      <div className={`${cardCls} flex flex-wrap items-end gap-4 p-5`}>
        <div className="min-w-56 flex-1">
          <Field label="Surah">
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
          Show translation
        </label>
      </div>

      {listError ? <p className="mt-6 text-sm text-red-600 dark:text-red-400">{listError}</p> : null}
      {error ? <p className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {loading ? <p className={`mt-6 text-sm ${mutedCls}`}>Loading surah…</p> : null}

      {!loading && ayahs && surah ? (
        <article className="mt-6">
          <header className={`rounded-2xl border ${lineCls} bg-emerald-50 p-6 text-center dark:bg-emerald-500/10`}>
            <p lang="ar" dir="rtl" className={`font-arabic text-4xl ${goldCls}`}>{surah.name}</p>
            <h2 className="mt-2 font-display text-2xl">
              {surah.englishName}
              <span className={`ml-2 text-base ${mutedCls}`}>— {surah.englishNameTranslation}</span>
            </h2>
            <p className={`mt-1 text-sm ${mutedCls}`}>
              {surah.revelationType} · {surah.numberOfAyahs} ayahs
            </p>
          </header>
          <ol className="mt-4 space-y-4">
            {ayahs.arabic.map((ayah, i) => (
              <li key={ayah.numberInSurah} className={`${cardCls} p-5`}>
                <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-loose sm:text-3xl">
                  {ayah.text}
                  <span className={`mx-2 text-lg ${goldCls}`}>﴿{ayah.numberInSurah}﴾</span>
                </p>
                {showTranslation && ayahs.english[i] ? (
                  <p className={`mt-3 border-t ${lineCls} pt-3 leading-relaxed ${mutedCls}`}>
                    {ayahs.english[i].text}
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
