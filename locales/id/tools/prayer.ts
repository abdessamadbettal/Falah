import type { prayer as en } from "../../en/tools/prayer";

export const prayer: typeof en = {
  meta: {
    title: "Jadwal Salat Hari Ini — waktu salat akurat untuk kota Anda",
    description:
      "Jadwal salat gratis untuk kota mana pun: Subuh, Zuhur, Asar, Magrib, dan Isya hari ini, hitung mundur waktu salat berikutnya, serta 11 metode perhitungan. Privat dan dihitung di browser Anda.",
  },
  title: "Waktu Salat",
  side: "مواقيت الصلاة",
  intro:
    "Lihat jadwal waktu salat hari ini di kota Anda dengan hitung mundur langsung ke waktu berikutnya. Cari kota mana pun — lokasi dapat dideteksi otomatis — dan waktu salat dihitung di perangkat Anda.",
  city: "Kota",
  detecting: "Mendeteksi lokasi Anda…",
  autoNote: "Kota Anda dideteksi otomatis untuk menampilkan waktu setempat; perhitungan salat dilakukan di perangkat Anda.",
  remaining: "lagi",
  calcMethod: "Metode perhitungan",
  methods: {
    MuslimWorldLeague: "Liga Muslim Dunia",
    UmmAlQura: "Umm al-Qura (Makkah)",
    Egyptian: "Otoritas Umum Mesir",
    Karachi: "Universitas Karachi",
    NorthAmerica: "ISNA (Amerika Utara)",
    MoonsightingCommittee: "Komite Rukyatulhilal",
    Dubai: "Dubai",
    Kuwait: "Kuwait",
    Qatar: "Qatar",
    Singapore: "Singapura",
    Turkey: "Turki (Diyanet)",
  },
  nextPrayer: "Salat berikutnya",
  inLabel: "dalam",
  note: "Waktu ditampilkan untuk hari ini menurut zona waktu perangkat Anda. Terbit matahari menandai akhir waktu Subuh, bukan waktu salat.",
  prompt: "Bagikan lokasi atau masukkan koordinat untuk melihat waktu salat hari ini.",
  prayerNames: { fajr: "Subuh", sunrise: "Terbit", dhuhr: "Zuhur", asr: "Asar", maghrib: "Magrib", isha: "Isya" },
  faqEyebrow: "Tanya Jawab Waktu Salat",
  faqH2: "Tentang waktu salat",
  faq: [
    {
      q: "Bagaimana waktu salat dihitung?",
      a: "Falah menghitung lima waktu salat dari posisi matahari pada koordinat kota Anda menggunakan pustaka astronomi adhan, lalu menerapkan metode pilihan Anda (Liga Muslim Dunia, Umm al-Qura, ISNA, dan lainnya).",
    },
    {
      q: "Apa saja lima salat wajib?",
      a: "Subuh (fajar), Zuhur (tengah hari), Asar (sore), Magrib (sesaat setelah matahari terbenam), dan Isya (malam). Waktu terbit matahari juga ditampilkan karena menandai akhir waktu Subuh.",
    },
    {
      q: "Metode perhitungan mana yang sebaiknya saya pilih?",
      a: "Pilih metode yang digunakan masjid atau negara Anda — misalnya Umm al-Qura di Arab Saudi, ISNA di Amerika Utara, atau otoritas Mesir di Mesir. Falah memilih metode awal yang sesuai berdasarkan negara Anda.",
    },
    {
      q: "Apakah waktu salat akurat untuk kota saya?",
      a: "Ya. Waktu dihitung berdasarkan koordinat kota yang Anda pilih dan ditampilkan menurut zona waktu perangkat. Untuk hasil terdekat, pilih kota yang paling dekat dengan Anda.",
    },
    {
      q: "Apakah alat ini bekerja offline?",
      a: "Setelah halaman dimuat, waktu salat dihitung sepenuhnya offline di browser. Hanya deteksi negara opsional yang menggunakan jaringan.",
    },
  ],
};
