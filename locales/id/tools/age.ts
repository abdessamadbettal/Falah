import type { age as en } from "../../en/tools/age";

export const age: typeof en = {
  meta: {
    title: "Kalkulator Usia Hijriah — usia Anda menurut kalender Islam",
    description:
      "Ubah tanggal lahir ke kalender Hijriah, ketahui usia Hijriah dengan tepat, ulang tahun Hijriah berikutnya, dan tonggak usia. Perhitungan dilakukan di perangkat Anda.",
  },
  title: "Kalkulator Usia Hijriah",
  side: "العمر الهجري",
  intro:
    "Ketahui usia Anda menurut kalender Islam, ulang tahun Hijriah berikutnya, dan tonggak usia — dihitung langsung di perangkat Anda.",
  dob: "Tanggal lahir (Masehi)",
  hijriAge: "Usia Hijriah",
  gregAge: "Usia Masehi",
  born: "Lahir",
  shorterYear: "Tahun Hijriah sekitar 11 hari lebih pendek, sehingga usia Hijriah bertambah lebih cepat.",
  nextBirthday: "Ulang tahun Hijriah berikutnya",
  todayBirthday: "Hari ini — selamat ulang tahun Hijriah!",
  inDays: (date: string, days: number) => `${date} · dalam ${days} hari`,
  hijriYears: (n: number) => `${n} tahun Hijriah`,
  milestones: [
    "Sekitar usia balig menurut banyak mazhab",
    "Usia ketika Nabi ﷺ menerima wahyu",
    "Usia Nabi ﷺ saat wafat — pengingat untuk memperbanyak amal saleh",
  ],
  prompt: "Masukkan tanggal lahir untuk melihat usia Hijriah Anda.",
};
