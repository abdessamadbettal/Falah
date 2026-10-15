import type { calendar as en } from "../../en/tools/calendar";

export const calendar: typeof en = {
  meta: {
    title: "Kalender Hijriah — tanggal Islam hari ini dan Ayyamul Bidh",
    description:
      "Lihat tanggal Hijriah hari ini dan kalender Islam (Umm al-Qura) per bulan, lengkap dengan tanggal Masehi, pengingat puasa Ayyamul Bidh, dan ekspor .ics. Gratis, privat, tanpa iklan.",
  },
  title: "Kalender Hijriah",
  side: "التقويم الهجري",
  intro:
    "Kalender Umm al-Qura per bulan. Ayyamul Bidh — tanggal 13, 14, dan 15 yang dianjurkan untuk berpuasa — ditandai, dan dapat diekspor ke kalender Anda.",
  todayIs: "Hari ini",
  weekdays: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  today: "Hari ini",
  prevMonth: "Bulan sebelumnya",
  nextMonth: "Bulan berikutnya",
  loading: "Memuat kalender…",
  outOfRange: "Bulan ini berada di luar rentang yang didukung.",
  legend: "Ayyamul Bidh — puasa sunah tanggal 13, 14, dan 15",
  exportBtn: (year: number) => `Ekspor Ayyamul Bidh ${year} H (.ics)`,
  icsSummary: (month: string, year: number) => `Ayyamul Bidh — ${month} ${year} H`,
  icsDescription: "Puasa sunah pada tanggal 13, 14, dan 15 bulan Hijriah.",
  faqEyebrow: "Tanya Jawab Kalender Hijriah",
  faqH2: "Tentang kalender Islam",
  faq: [
    {
      q: "Apa itu kalender Hijriah?",
      a: "Kalender Hijriah adalah kalender lunar Islam yang terdiri dari 12 bulan dengan 354–355 hari dalam setahun. Falah menggunakan perhitungan Umm al-Qura yang menjadi standar di Arab Saudi.",
    },
    {
      q: "Apa itu Ayyamul Bidh?",
      a: "Ayyamul Bidh adalah tanggal 13, 14, dan 15 setiap bulan Hijriah — malam-malam bulan purnama yang dianjurkan Nabi ﷺ untuk berpuasa. Falah menandainya dan dapat mengekspornya ke kalender Anda.",
    },
    {
      q: "Mengapa tanggal Hijriah bisa berbeda satu hari dari aplikasi lain?",
      a: "Awal bulan Hijriah dapat berbeda satu hari bergantung pada rukyatulhilal setempat. Falah menggunakan kalender astronomis Umm al-Qura yang mungkin berbeda satu hari dari pengumuman lokal.",
    },
    {
      q: "Tanggal Hijriah berapa hari ini?",
      a: "Tanggal Hijriah hari ini ditampilkan di bagian atas halaman dan tanggal hari ini ditandai pada kalender — diperbarui otomatis di perangkat Anda.",
    },
    {
      q: "Bisakah Ayyamul Bidh ditambahkan ke Google Calendar atau Apple Calendar?",
      a: "Bisa. Pilih “Ekspor Ayyamul Bidh” untuk mengunduh berkas .ics yang dapat diimpor ke Google Calendar, Apple Calendar, atau Outlook.",
    },
  ],
};
