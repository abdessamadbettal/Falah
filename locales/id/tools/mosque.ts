import type { mosque as en } from "../../en/tools/mosque";

export const mosque: typeof en = {
  meta: {
    title: "Pencari Masjid — masjid terdekat di peta",
    description:
      "Temukan masjid dan musala terdekat di peta interaktif menggunakan data komunitas OpenStreetMap, lengkap dengan petunjuk arah. Gratis dan privat — lokasi digunakan sekali dan tidak disimpan.",
  },
  title: "Pencari Masjid",
  side: "أقرب مسجد",
  intro:
    "Temukan masjid terdekat di peta interaktif dari data komunitas OpenStreetMap. Izinkan akses lokasi atau cari tempat — lokasi Anda hanya digunakan untuk pencarian ini dan tidak disimpan.",
  radius: "Radius pencarian",
  find: "Cari masjid",
  searchArea: "Cari area ini",
  searching: "Mencari…",
  locationNeeded: "Izinkan akses lokasi atau cari tempat untuk melihat masjid terdekat.",
  resultCount: (n: number) => `${n} masjid terdekat`,
  errorService: "Layanan peta tidak merespons. Coba lagi sebentar.",
  unnamed: "Masjid tanpa nama",
  away: (km: string) => `${km} km`,
  directions: "Petunjuk arah",
  osm: "OpenStreetMap",
  noResults: (r: number) =>
    `Tidak ada masjid yang terdaftar dalam radius ${r} km di sini. Coba radius lebih luas — cakupan peta komunitas berbeda-beda di tiap daerah.`,
  faqEyebrow: "Tanya Jawab Pencari Masjid",
  faqH2: "Menemukan masjid di sekitar Anda",
  faq: [
    {
      q: "Bagaimana cara kerja pencari masjid?",
      a: "Dengan izin Anda, alat ini menggunakan lokasi perangkat untuk mencari tempat ibadah Muslim pada data komunitas OpenStreetMap dalam radius pilihan, lalu menampilkannya di peta.",
    },
    {
      q: "Apakah lokasi saya disimpan atau dilacak?",
      a: "Tidak. Koordinat hanya digunakan untuk satu pencarian dan tidak disimpan. Permintaan hanya dikirim ke OpenStreetMap untuk mencari masjid terdekat — tidak ada akun atau pelacakan.",
    },
    {
      q: "Mengapa masjid di dekat saya tidak ditemukan?",
      a: "Data OpenStreetMap dikelola komunitas sehingga cakupannya berbeda-beda. Coba radius lebih luas, atau tambahkan masjid tersebut di openstreetmap.org agar orang lain dapat menemukannya.",
    },
    {
      q: "Bagaimana mendapatkan petunjuk arah ke masjid?",
      a: "Ketuk “Petunjuk arah” pada hasil mana pun untuk membuka navigasi ke masjid tersebut di aplikasi peta Anda.",
    },
    {
      q: "Apakah saya memerlukan aplikasi atau akun?",
      a: "Tidak. Pencari masjid berjalan di browser — tanpa pendaftaran, instalasi, ataupun iklan.",
    },
  ],
};
