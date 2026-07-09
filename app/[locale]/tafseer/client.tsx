"use client";

import { useEffect, useState } from "react";
import { useDict } from "@/components/locale";
import {
  cardCls,
  Field,
  goldCls,
  lineCls,
  mutedCls,
  Select,
  ToolShell,
} from "@/components/ui";
import { fetchSurahEditions, useSurahs, type Ayah } from "@/lib/quran";

export default function TafseerClient() {
  const d = useDict();
  const t = d.tools.tafseer;
  const { surahs, error: listError } = useSurahs();
  const [surahNumber, setSurahNumber] = useState(1);
  const [tafsir, setTafsir] = useState<string>(t.tafsirs[0].id);
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
        if (!cancelled) setFetchError({ key: requestKey, message: d.tools.quran.errSurah });
      });
    return () => {
      cancelled = true;
    };
  }, [surahNumber, tafsir, d.tools.quran.errSurah]);

  const data = result?.key === key ? result : null;
  const error = fetchError?.key === key ? fetchError.message : null;
  const loading = !data && !error;
  const surah = surahs?.find((s) => s.number === surahNumber);
  const tafsirIsArabic = tafsir.startsWith("ar.");

  return (
    <ToolShell icon="ph:scroll" title={t.title} side={t.side} intro={t.intro} wide>
      <div className={`${cardCls} grid gap-4 p-5 sm:grid-cols-2`}>
        <Field label={d.tools.quran.surah}>
          <Select
            value={surahNumber}
            onChange={(e) => setSurahNumber(Number(e.target.value))}
            disabled={!surahs}
          >
            {(surahs ?? []).map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.englishName} — {s.englishNameTranslation}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={t.commentary}>
          <Select value={tafsir} onChange={(e) => setTafsir(e.target.value)}>
            {t.tafsirs.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </Select>
        </Field>
      </div>

      {listError ? <p className="mt-6 text-sm text-red-600 dark:text-red-400">{d.tools.quran.errList}</p> : null}
      {error ? <p className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {loading && !listError ? <p className={`mt-6 text-sm ${mutedCls}`}>{t.loadingTafseer}</p> : null}

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
                  lang={tafsirIsArabic ? "ar" : tafsir.split(".")[0]}
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
