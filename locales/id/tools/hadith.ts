import type { hadith as en } from "../../en/tools/hadith";

export const hadith: typeof en = {
  meta: {
    title: "Kumpulan Hadis — Sahih al-Bukhari, Muslim, dan Sunan",
    description:
      "Baca lebih dari 36.000 hadis dari enam kitab utama, Muwatta Imam Malik, dan Arba'in — teks Arab lengkap beserta terjemahan bahasa Inggris dan derajat hadis. Gratis, tanpa iklan atau akun.",
  },
  title: "Hadis",
  side: "الحديث الشريف",
  intro:
    "Sabda dan tuntunan Nabi Muhammad ﷺ sebagaimana diriwayatkan para penghimpun hadis. Setiap kitab tersedia lengkap — teks Arab disertai terjemahan bahasa Inggris dan derajat hadis bila dicantumkan oleh para ulama.",
  display: "Tampilan",
  showBoth: "Arab dan terjemahan",
  showArabic: "Bahasa Arab saja",
  showTranslation: "Terjemahan saja",
  textSize: "Ukuran teks",
  reading: "Membaca",
  controls: "Pengaturan bacaan",
  openControls: "Buka pengaturan bacaan",
  close: "Tutup",
  filterPh: "Saring hadis di halaman ini…",
  filterAria: "Saring hadis di halaman ini",
  noMatch: (q: string) => `Tidak ada hadis di halaman ini yang memuat “${q}”.`,
  clearFilter: "Hapus filter",
  matchCount: (n: number) => `${n} hasil cocok`,
  copy: "Salin",
  copied: "Tersalin",
  copyAria: "Salin hadis ini",
  linkAria: "Tautan ke hadis ini",
  untranslated: "Terjemahan bahasa Inggris untuk hadis ini tidak tersedia.",
  searchPh: "Cari kumpulan atau kitab hadis…",
  searchAria: "Cari kumpulan dan kitab hadis",
  searchEmpty: (q: string) => `Tidak ditemukan hasil untuk “${q}”. Coba nama kitab seperti “salat” atau “puasa”.`,
  searchHint: "Ketik nama kumpulan, kitab hadis, atau topik.",
  resultsIn: "dalam",
};
