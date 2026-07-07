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

const TAFSIRS = [
  { id: "ar.muyassar", label: "Al-Muyassar (Arabic)" },
  { id: "ar.jalalayn", label: "Al-Jalalayn (Arabic)" },
  { id: "en.sahih", label: "Saheeh International (English translation)" },
] as const;

export default function TafseerPage() {
  const { surahs, error: listError } = useSurahs();
  const [surahNumber, setSurahNumber] = useState(1);
  const [tafsir, setTafsir] = useState<string>("ar.muyassar");
  const [result, setResult] = useState<{ key: string; arabic: Ayah[]; tafsir: Ayah[] } | null>(null);
  const [fetchError, setFetchError] = useState<{ key: string; message: string } | null>(null);

  const key = `${surahNumber}:${tafsir}`;
  useEffect(() => {
    let cancelled = false;
    const requestKey = `${surahNumber}:${tafsir}`;
    fetchSurahEditions(surahNumber, ["quran-uthmani", tafsir])
      .then(([arabic, commentary]) => {
        if (!cancelled) setResult({ key: requestKey, arabic, tafsir: commentary });
      })
      .catch(() => {
        if (!cancelled)
          setFetchError({
            key: requestKey,
            message: "Could not load this surah. Check your connection and try again.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [surahNumber, tafsir]);

  const data = result?.key === key ? result : null;
  const error = fetchError?.key === key ? fetchError.message : null;
  const loading = !data && !error;
  const surah = surahs?.find((s) => s.number === surahNumber);
  const tafsirIsArabic = tafsir.startsWith("ar.");

  return (
    <ToolShell
      icon="ph:scroll"
      title="Tafseer Explorer"
      arabic="التفسير"
      intro="Read each verse alongside classical commentary — Al-Muyassar and Al-Jalalayn in Arabic, or the Saheeh International rendering in English."
      wide
    >
      <div className={`${cardCls} grid gap-4 p-5 sm:grid-cols-2`}>
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
        <Field label="Commentary">
          <select className={inputCls} value={tafsir} onChange={(e) => setTafsir(e.target.value)}>
            {TAFSIRS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </Field>
      </div>

      {listError ? <p className="mt-6 text-sm text-red-600 dark:text-red-400">{listError}</p> : null}
      {error ? <p className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {loading ? <p className={`mt-6 text-sm ${mutedCls}`}>Loading commentary…</p> : null}

      {!loading && data && surah ? (
        <ol className="mt-6 space-y-4">
          {data.arabic.map((ayah, i) => (
            <li key={ayah.numberInSurah} className={`${cardCls} p-5`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${goldCls}`}>
                {surah.englishName} {surah.number}:{ayah.numberInSurah}
              </p>
              <p lang="ar" dir="rtl" className="mt-2 font-arabic text-2xl leading-loose">
                {ayah.text}
              </p>
              {data.tafsir[i] ? (
                <p
                  lang={tafsirIsArabic ? "ar" : "en"}
                  dir={tafsirIsArabic ? "rtl" : "ltr"}
                  className={`mt-3 border-t ${lineCls} pt-3 leading-relaxed ${
                    tafsirIsArabic ? "font-arabic text-lg" : ""
                  } ${mutedCls}`}
                >
                  {data.tafsir[i].text}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </ToolShell>
  );
}
