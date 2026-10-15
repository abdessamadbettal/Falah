import type { converter as en } from "../../en/tools/converter";

export const converter: typeof en = {
  meta: {
    title: "Konverter Tanggal Hijriah ↔ Masehi — cepat dan akurat",
    description:
      "Konversikan tanggal antara kalender Hijriah (Umm al-Qura) dan Masehi secara instan, dua arah, dengan hasil dalam aksara Arab dan Latin. Gratis, privat, tanpa iklan.",
  },
  title: "Konverter Hijriah ↔ Masehi",
  side: "محول التاريخ",
  intro: "Konversi instan dua arah menggunakan kalender Umm al-Qura, sepenuhnya di perangkat Anda.",
  loading: "Memuat konverter…",
  g2h: "Masehi → Hijriah",
  h2g: "Hijriah → Masehi",
  gregDate: "Tanggal Masehi",
  day: "Hari",
  month: "Bulan",
  yearAH: "Tahun Hijriah",
  pick: "Pilih tanggal yang ingin dikonversi.",
  invalid: "Tanggal Umm al-Qura tidak valid — bulan ini mungkin hanya memiliki 29 hari.",
  faqEyebrow: "Tanya Jawab Konverter Tanggal",
  faqH2: "Tentang konverter",
  faq: [
    {
      q: "Bagaimana cara mengubah tanggal Masehi menjadi Hijriah?",
      a: "Pilih tanggal Masehi di sebelah kiri. Falah langsung menampilkan tanggal Hijriah (Umm al-Qura) yang sesuai dalam aksara Latin dan Arab.",
    },
    {
      q: "Bagaimana cara mengubah tanggal Hijriah menjadi Masehi?",
      a: "Pilih hari, bulan, dan tahun Hijriah di sebelah kanan. Tanggal Masehi yang sesuai langsung ditampilkan.",
    },
    {
      q: "Kalender Hijriah apa yang digunakan konverter ini?",
      a: "Kalender Umm al-Qura yang digunakan di Arab Saudi. Hasil konversi dapat berbeda satu hari dari pengumuman rukyatulhilal setempat.",
    },
    {
      q: "Apakah hasilnya akurat untuk ulang tahun dan dokumen resmi?",
      a: "Hasilnya akurat dalam rentang kalender Umm al-Qura yang didukung. Untuk dokumen resmi, pastikan kembali dengan kalender yang diakui di negara Anda.",
    },
  ],
};
