import type { quranBrowse as en } from "../../en/tools/quran-browse";

export const quranBrowse: typeof en = {
  quran: "Al-Qur'an",
  surah: "Surah",
  juz: "Juz",
  hizb: "Hizb",
  page: "Halaman",
  verses: "ayat",
  verse: "Ayat",
  meccan: "Makkiyah",
  medinan: "Madaniyah",
  readInReader: "Buka di pembaca interaktif",
  listen: "Dengarkan tilawah ini",
  prev: "Sebelumnya",
  next: "Berikutnya",
  backToQuran: "Seluruh Al-Qur'an",
  navigate: "Navigasi",
  browseBy: "Jelajahi berdasarkan",
  bySurah: "Surah",
  byJuz: "Juz",
  byHizb: "Hizb",
  byPage: "Halaman",
  translationList: "Terjemahan ayat demi ayat",
  hubSurahsTitle: "Seluruh 114 surah",
  hubSurahsP:
    "Seluruh surah Al-Qur'an menurut urutan mushaf. Buka setiap surah untuk membaca teks Arab Utsmani, terjemahan bahasa Indonesia, dan mendengarkan audio per ayat.",
  hubJuzTitle: "30 juz",
  hubJuzP:
    "Al-Qur'an dibagi menjadi 30 juz — bagian bacaan untuk mengkhatamkan Al-Qur'an dalam sebulan, khususnya pada Ramadan.",
  hubHizbTitle: "60 hizb",
  hubHizbP: "Setiap juz terbagi menjadi dua hizb, untuk pembaca yang membagi bacaan harian berdasarkan hizb.",
  hubPagesTitle: "Seluruh 604 halaman mushaf",
  hubPagesP:
    "Setiap halaman mushaf Madinah standar, dengan nomor yang sama seperti cetakan — berguna untuk menghafal dan mengikuti mushaf cetak.",
  showAllPages: "Jelajahi seluruh 604 halaman",
  surahTitle: (name: string, meaning: string, n: number) => `Surah ${name} (${meaning}) — surah ke-${n}`,
  surahDesc: (
    translit: string,
    n: number,
    meaning: string,
    ayahs: number,
    revelation: string,
    juz: number,
  ) =>
    `Baca Surah ${translit} — surah ke-${n} dalam Al-Qur'an, bermakna “${meaning}” — dalam aksara Arab Utsmani dengan terjemahan bahasa Indonesia. ${ayahs} ayat, ${revelation}, dimulai pada juz ${juz}. Gratis, tanpa iklan atau akun.`,
  surahH1: (translit: string) => `Surah ${translit}`,
  surahIntro: (
    translit: string,
    n: number,
    meaning: string,
    ayahs: number,
    revelation: string,
    juz: number,
    page: number,
  ) =>
    `Surah ${translit} adalah surah ke-${n} dalam Al-Qur'an. Namanya bermakna “${meaning}”. Surah ${revelation.toLowerCase()} ini terdiri dari ${ayahs} ayat dan dimulai pada juz ${juz}, halaman ${page} mushaf. Di bawah ini terdapat teks lengkap Arab Utsmani beserta terjemahan bahasa Indonesia setiap ayat.`,
  juzTitle: (n: number, name: string) => `Juz ${n} (${name}) — teks lengkap dan terjemahan`,
  juzDesc: (n: number, translit: string, from: string, to: string, ayahs: number) =>
    `Baca juz ${n} Al-Qur'an (${translit}), dari ${from} hingga ${to} — ${ayahs} ayat dalam aksara Arab Utsmani dengan terjemahan bahasa Indonesia dan audio. Gratis, tanpa iklan atau akun.`,
  juzH1: (n: number) => `Juz ${n}`,
  juzIntro: (n: number, translit: string, from: string, to: string, ayahs: number, surahs: number) =>
    `Juz ${n} — dikenal sebagai ${translit} dari kata-kata pembukanya — adalah bagian ke-${n} dari 30 bagian bacaan Al-Qur'an. Juz ini dimulai dari ${from} hingga ${to}, mencakup ${ayahs} ayat dalam ${surahs === 1 ? "satu surah" : `${surahs} surah`}. Membaca satu juz setiap hari dapat mengkhatamkan Al-Qur'an dalam sebulan.`,
  hizbTitle: (n: number, juz: number) => `Hizb ${n} (Juz ${juz}) — teks lengkap dan terjemahan`,
  hizbDesc: (n: number, juz: number, from: string, to: string, ayahs: number) =>
    `Baca hizb ${n} Al-Qur'an, ${n % 2 === 1 ? "paruh pertama" : "paruh kedua"} juz ${juz}, dari ${from} hingga ${to} — ${ayahs} ayat dalam aksara Arab Utsmani dengan terjemahan bahasa Indonesia.`,
  hizbH1: (n: number) => `Hizb ${n}`,
  hizbIntro: (n: number, juz: number, from: string, to: string, ayahs: number) =>
    `Hizb ${n} adalah ${n % 2 === 1 ? "paruh pertama" : "paruh kedua"} juz ${juz}, salah satu dari 60 hizb pembagian Al-Qur'an. Dimulai dari ${from} hingga ${to} dan terdiri dari ${ayahs} ayat.`,
  pageTitle: (n: number, surahs: string, juz: number) => `Halaman ${n} Al-Qur'an — ${surahs}, juz ${juz}`,
  pageDesc: (n: number, juz: number, surahs: string, ayahs: number) =>
    `Baca halaman ${n} Al-Qur'an (${surahs}, juz ${juz}) sesuai urutan mushaf Madinah — ${ayahs} ayat dalam aksara Arab Utsmani dengan terjemahan bahasa Indonesia dan audio.`,
  pageH1: (n: number) => `Halaman ${n} Al-Qur'an`,
  pageIntro: (n: number, juz: number, surahs: string, ayahs: number) =>
    `Halaman ${n} mushaf Madinah standar berada di juz ${juz} dan berisi ${ayahs} ayat dari ${surahs}. Pembagian halaman mengikuti mushaf cetak sehingga Anda dapat mengikutinya dengan mushaf fisik atau merencanakan hafalan halaman demi halaman.`,
  alsoIn: "Juga di bagian Al-Qur'an ini",
  juzOfSurah: (n: number) => `Juz ${n}`,
  pageOfSurah: (n: number) => `Halaman ${n}`,
  surahsOnThisPage: "Surah di halaman ini",
  startsAt: "Dimulai dari",
  ayahCount: (n: number) => `${n} ayat`,
};
