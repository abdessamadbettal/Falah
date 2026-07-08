"use client";

/**
 * Hisnul Muslim (Fortress of the Muslim) data from the open hisnmuslim.com
 * API. Its internal URLs are served over http://, which would be blocked as
 * mixed content on our https site, so every fetched URL is upgraded to https.
 */

export type HisnChapter = { id: number; title: string; audio: string };
export type HisnDua = {
  id: number;
  arabic: string;
  translation: string;
  note: string;
  repeat: number;
  audio: string;
};

const toHttps = (u: string) => (u || "").replace(/^http:\/\//i, "https://");

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const raw = await res.text();
  return JSON.parse(raw.replace(/^﻿/, ""));
}

function lang(locale: string) {
  return locale === "ar" ? "ar" : "en";
}

/** The list of chapters (with each chapter's full recitation audio). */
export async function fetchHisnChapters(locale: string): Promise<HisnChapter[]> {
  const l = lang(locale);
  const json = (await getJson(`https://www.hisnmuslim.com/api/${l}/husn_${l}.json`)) as Record<
    string,
    { ID: number; TITLE: string; AUDIO_URL?: string }[]
  >;
  const arr = Object.values(json)[0] ?? [];
  return arr.map((c) => ({ id: c.ID, title: c.TITLE, audio: toHttps(c.AUDIO_URL ?? "") }));
}

/** Every dua in one chapter, with per-dua audio and repetition count. */
export async function fetchHisnChapter(locale: string, id: number): Promise<HisnDua[]> {
  const l = lang(locale);
  const json = (await getJson(`https://www.hisnmuslim.com/api/${l}/${id}.json`)) as Record<
    string,
    {
      ID: number;
      ARABIC_TEXT: string;
      TRANSLATED_TEXT?: string;
      LANGUAGE_ARABIC_TRANSLATED_TEXT?: string;
      REPEAT?: number | string;
      AUDIO?: string;
    }[]
  >;
  const arr = Object.values(json)[0] ?? [];
  return arr.map((x) => ({
    id: x.ID,
    arabic: x.ARABIC_TEXT ?? "",
    translation: x.TRANSLATED_TEXT ?? "",
    note: x.LANGUAGE_ARABIC_TRANSLATED_TEXT ?? "",
    repeat: Number(x.REPEAT) || 1,
    audio: toHttps(x.AUDIO ?? ""),
  }));
}
