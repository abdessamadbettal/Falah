import type { ramadan as en } from "../../en/tools/ramadan";

export const ramadan: typeof en = {
  meta: {
    title: "Hitung Mundur Ramadan — berapa hari lagi menuju Ramadan?",
    description:
      "Hitung mundur langsung menuju awal Ramadan — hari, jam, menit, dan detik — berdasarkan kalender Umm al-Qura dan dihitung di browser Anda. Gratis, privat, tanpa iklan.",
  },
  title: "Hitung Mundur Ramadan",
  side: "رمضان",
  intro:
    "Ketahui waktu menuju bulan penuh berkah — dihitung dari kalender Umm al-Qura di perangkat Anda. Awal sebenarnya dapat berbeda satu hari mengikuti rukyatulhilal setempat.",
  loading: "Memuat hitung mundur…",
  beginsIn: (year: number) => `Ramadan ${year} H dimulai dalam`,
  units: { days: "hari", hours: "jam", minutes: "menit", seconds: "detik" },
  expected: "Diperkirakan dimulai",
  mubarak: "Ramadan Mubarak",
  dayX: (d: number) => `Hari ke-${d}`,
  remain: (year: number, d: number) => `Ramadan ${year} H · tersisa ${d} hari`,
  companion: "Panduan harian",
  tips: [
    "Waktu sahur berakhir saat Subuh dan berbuka saat Magrib — periksa waktu tepat hari ini di kota Anda.",
    "Sepuluh malam terakhir mencakup Lailatulqadar; perbanyak ibadah mulai malam ke-21.",
    "Puasa Ayyamul Bidh (tanggal 13–15) membantu menjaga kebiasaan berpuasa sepanjang tahun.",
  ],
  linkPrayer: "Waktu salat",
  linkCalendar: "Kalender Hijriah",
  faqEyebrow: "Tanya Jawab Ramadan",
  faqH2: "Tentang hitung mundur",
  faq: [
    {
      q: "Kapan Ramadan dimulai tahun ini?",
      a: "Hitung mundur ini mengacu pada perkiraan hari pertama Ramadan menurut kalender Umm al-Qura. Awal sebenarnya dapat bergeser satu hari mengikuti rukyatulhilal di negara Anda.",
    },
    {
      q: "Bagaimana hitung mundur ini dihitung?",
      a: "Hitung mundur menuju tengah malam waktu setempat saat 1 Ramadan dimulai, berdasarkan kalender Umm al-Qura dan dihitung sepenuhnya di perangkat Anda.",
    },
    {
      q: "Apa itu sepuluh malam terakhir Ramadan?",
      a: "Sepuluh malam terakhir mencakup Lailatulqadar (Malam Kemuliaan), malam paling utama dalam setahun ketika umat Islam dianjurkan untuk lebih bersungguh-sungguh beribadah.",
    },
    {
      q: "Apakah hitung mundur berfungsi offline?",
      a: "Ya. Setelah halaman dimuat, hitung mundur berjalan sepenuhnya di browser tanpa memerlukan koneksi.",
    },
  ],
};
