import type { hisnul as en } from "../../en/tools/hisnul";

export const hisnul: typeof en = {
  meta: {
    title: "Hisnul Muslim — doa dan zikir harian sahih beserta audio",
    description:
      "Kumpulan lengkap Hisnul Muslim: doa dan zikir harian sahih dengan teks Arab, terjemahan, jumlah pengulangan, serta lantunan audio. Gratis, tanpa akun dan iklan.",
  },
  title: "Hisnul Muslim",
  side: "حصن المسلم",
  intro:
    "Kumpulan lengkap Hisnul Muslim — bab doa harian sahih dengan terjemahan, jumlah pengulangan, dan lantunan audio untuk setiap doa.",
  chapters: "Bab",
  searchPh: "Cari bab…",
  loading: "Memuat…",
  error: "Zikir tidak dapat dimuat. Periksa koneksi Anda lalu coba lagi.",
  playChapter: "Putar bab",
  pause: "Jeda",
  selectPrompt: "Pilih bab untuk membaca zikirnya.",
  count: (n: number) => `${n} zikir`,
  repeat: (n: number) => `Ulangi ×${n}`,
  copy: "Salin",
  copied: "Tersalin",
  faqEyebrow: "Tanya Jawab Hisnul Muslim",
  faqH2: "Tentang kumpulan zikir ini",
  faq: [
    {
      q: "Apa itu Hisnul Muslim?",
      a: "Hisnul Muslim (“Benteng Seorang Muslim”) adalah kumpulan doa harian sahih yang banyak digunakan, dihimpun oleh Syekh Sa'id bin Ali al-Qahtani dari Al-Qur'an dan Sunnah.",
    },
    {
      q: "Bisakah saya mendengarkan doa?",
      a: "Bisa. Setiap bab memiliki lantunan audio lengkap dan setiap doa memiliki audio tersendiri — cukup ketuk tombol putar.",
    },
    {
      q: "Apa arti jumlah pengulangan?",
      a: "Sebagian zikir dibaca beberapa kali, misalnya tiga atau seratus kali. Penanda “Ulangi ×N” menunjukkan jumlah bacaan yang mengikuti Sunnah.",
    },
    {
      q: "Kapan zikir pagi dan petang dibaca?",
      a: "Zikir pagi dibaca setelah Subuh hingga matahari terbit, dan zikir petang setelah Asar hingga matahari terbenam (atau setelah Magrib). Konsistensi lebih utama daripada waktu yang persis.",
    },
    {
      q: "Apakah alat ini bisa digunakan tanpa akun?",
      a: "Bisa — tanpa pendaftaran, iklan, atau pelacakan. Teks dan audio dimuat dari API terbuka HisnMuslim.com.",
    },
  ],
};
