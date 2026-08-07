"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useDict, useLocale } from "@/components/locale";
import {
  Button,
  ToolShell,
  cardCls,
  goldCls,
  inputCls,
  mutedCls,
  useMounted,
} from "@/components/ui";
import { cleanAyah, stripLeadingBasmala } from "@/lib/arabic";
import { localePath } from "@/lib/i18n";
import { searchAyahs, type SearchHit } from "@/lib/quran-search";

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEvent = { error: string; message?: string };

/** Chrome streams mic audio to Google's speech backend, which is flaky — a
 * "network" error is often transient, so retry a few times before giving up. */
const MAX_NETWORK_RETRIES = 3;

/** Minimal shape of webkitSpeechRecognition instances — TS 5.9 only ships
 * SpeechRecognitionAlternative, so the handful of members we use are declared
 * locally instead of pulling in a DOM extension package. */
type SpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  abort: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export default function AyahFinderClient() {
  const mounted = useMounted();
  const d = useDict();
  const locale = useLocale();
  const t = d.tools.ayahFinder;
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [unsupported] = useState(
    () => typeof window !== "undefined" && !window.webkitSpeechRecognition,
  );
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{
    key: string;
    hits: SearchHit[];
  } | null>(null);
  const [searchError, setSearchError] = useState<{ key: string } | null>(null);
  const recognition = useRef<SpeechRecognition | null>(null);
  /** Whether the user still wants the mic on — the ref, not `listening`, is the
   * source of truth for auto-restart, because Chrome ends recognition sessions
   * on its own (silence, inactivity) and `listening` state lags a render. */
  const keepListening = useRef(false);
  /** Consecutive "network" errors. Reset on any transcript and on restart. */
  const networkRetries = useRef(0);

  const stop = () => {
    keepListening.current = false;
    recognition.current?.abort();
    recognition.current = null;
    setListening(false);
  };

  /** Wire up a fresh session and start it. Called on the initial click and
   * again from `onend` whenever Chrome dropped the session on its own. */
  const begin = () => {
    if (!keepListening.current) return;
    const SpeechRecognition = window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = "ar";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++)
        text += e.results[i][0].transcript;
      if (text.trim()) networkRetries.current = 0;
      setQuery(text);
    };
    rec.onerror = (e) => {
      // "network" means Chrome couldn't reach the speech backend — usually
      // transient, so retry a few times before giving up. The onend handler
      // restarts the session; the timer below is a backstop for versions where
      // onend doesn't fire after a network error (guarded so it can't
      // double-start).
      if (!keepListening.current) return;

      if (
        e.error === "network" &&
        networkRetries.current < MAX_NETWORK_RETRIES
      ) {
        console.warn(
          "quran-search: speech network error (retrying)",
          e.error,
          e.message,
        );
        networkRetries.current += 1;
        setTimeout(() => {
          if (recognition.current === rec && keepListening.current) {
            recognition.current = null;
            begin();
          }
        }, 600);
        return;
      }
      // Fatal errors: nothing to gain from restarting, stop and tell the user.
      console.warn("quran-search: speech error", e.error, e.message);
      keepListening.current = false;
      if (recognition.current === rec) recognition.current = null;
      setListening(false);
      setMicError(
        e.error === "not-allowed" || e.error === "service-not-allowed"
          ? t.micPermission
          : e.error === "audio-capture"
            ? t.micNoDevice
            : e.error === "network"
              ? t.micNetwork
              : t.micError,
      );
    };
    rec.onend = () => {
      if (recognition.current === rec) recognition.current = null;
      if (keepListening.current) {
        // Chrome ends sessions on its own; quietly restart to keep recording.
        setTimeout(begin, 250);
        return;
      }
      setListening(false);
    };
    recognition.current = rec;
    rec.start();
  };

  const start = () => {
    if (
      !mounted ||
      !window.webkitSpeechRecognition ||
      listening ||
      keepListening.current
    )
      return;
    if (!window.isSecureContext) {
      setMicError(t.micInsecure);
      return;
    }
    setMicError(null);
    keepListening.current = true;
    setListening(true);
    try {
      begin();
    } catch (err) {
      console.warn("quran-search: could not start speech recognition", err);
      keepListening.current = false;
      recognition.current = null;
      setListening(false);
      setMicError(t.micError);
    }
  };

  useEffect(() => stop, []);

  // Debounced auto-search. State is keyed to the exact query it answers (the
  // tafseer pattern), so nothing needs resetting synchronously when the query
  // changes — stale results simply no longer match their key.
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    let cancelled = false;
    const id = setTimeout(async () => {
      try {
        const hits = await searchAyahs(trimmed);
        if (!cancelled) setResult({ key: trimmed, hits });
      } catch {
        if (!cancelled) setSearchError({ key: trimmed });
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  const trimmed = query.trim();
  const current = result?.key === trimmed ? result : null;
  const error = searchError?.key === trimmed;
  const searching = trimmed !== "" && !current && !error;

  return (
    <ToolShell
      icon="ph:microphone"
      title={t.title}
      side={t.side}
      intro={t.intro}
    >
      <div className="space-y-3">
        {mounted ? (
          <Button
            variant="ghost"
            onClick={listening ? stop : start}
            disabled={unsupported}
            aria-pressed={listening}
            aria-label={t.mic}
          >
            <Icon
              icon={listening ? "ph:waveform" : "ph:microphone"}
              className="size-5"
            />
            {listening ? t.listening : unsupported ? t.unsupported : t.mic}
          </Button>
        ) : null}
        <textarea
          lang="ar"
          dir="rtl"
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
          className={`${inputCls} min-h-28 resize-y font-arabic`}
        />
        <p className={`text-xs leading-relaxed ${mutedCls}`}>{t.privacy}</p>
      </div>

      {!trimmed && !searching ? (
        <p className={`mt-6 text-sm ${mutedCls}`}>{t.emptyTip}</p>
      ) : null}
      {searching ? (
        <p className={`mt-6 text-sm ${mutedCls}`}>{t.loading}</p>
      ) : null}
      {error ? (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">{t.error}</p>
      ) : null}
      {micError ? (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">
          {micError}
        </p>
      ) : null}
      {current && !searching && !error && !current.hits.length ? (
        <p className={`mt-6 text-sm ${mutedCls}`}>{t.noResults}</p>
      ) : null}

      {current && current.hits.length ? (
        <section className="mt-6">
          <h2
            className={`text-xs font-semibold uppercase tracking-wide ${goldCls}`}
          >
            {t.results(current.hits.length)}
          </h2>
          <ol className="mt-3 space-y-4">
            {current.hits.map((hit) => (
              <li key={hit.row.n} className={`${cardCls} p-5`}>
                <p className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold">
                    {hit.surah.translit}{" "}
                    <span lang="ar" dir="rtl" className="font-arabic">
                      {hit.surah.arabic}
                    </span>
                  </span>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${goldCls}`}
                  >
                    {t.ayah} {hit.row.a}
                  </span>
                </p>
                <p
                  lang="ar"
                  dir="rtl"
                  className="mt-2 font-arabic text-2xl leading-loose"
                >
                  {cleanAyah(stripLeadingBasmala(hit.row.t))}
                </p>
                <p
                  className={`mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t pt-2 text-xs ${mutedCls}`}
                >
                  <span>
                    {t.confidence}: {Math.round(hit.confidence * 100)}%
                  </span>
                  <Link
                    href={`${localePath(locale, `/quran/surah/${hit.surah.slug}`)}#ayah-${hit.row.a - 1}`}
                    className={`font-semibold ${goldCls} hover:underline`}
                  >
                    {t.read} →
                  </Link>
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </ToolShell>
  );
}
