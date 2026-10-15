import type { prayerPlaces as en } from "../../en/tools/prayer-places";

export const prayerPlaces: typeof en = {
  hubEyebrow: "Jelajahi berdasarkan tempat",
  hubTitle: "Waktu salat menurut negara",
  hubIntro:
    "Jadwal salat untuk setiap negara, metode perhitungan yang digunakan masjid setempat, dan halaman khusus untuk tiap kota.",
  hubCities: (n: number) => `${n} kota`,
  cityTitle: (city: string, country: string) => `Waktu Salat Hari Ini di ${city}, ${country}`,
  cityH1: (city: string) => `Waktu Salat di ${city}`,
  cityIntro: (city: string, country: string) =>
    `Lima waktu salat hari ini untuk ${city}, ${country}, dihitung dari posisi matahari pada koordinat kota dan ditampilkan menurut waktu setempat. Hitung mundur ke waktu salat berikutnya berjalan langsung di perangkat Anda.`,
  cityDescription: (label: string, coords: string, qibla: string) =>
    `Waktu salat untuk ${label} (${coords}): Subuh, Zuhur, Asar, Magrib, dan Isya hari ini, jadwal sebulan penuh, dan arah kiblat — ${qibla}. Gratis, tanpa iklan atau pelacakan.`,
  cityKeywords: (city: string, country: string) => [
    `waktu salat ${city}`,
    `jadwal salat ${city}`,
    `waktu Subuh ${city}`,
    `waktu Magrib ${city}`,
    `waktu berbuka ${city}`,
    `waktu salat ${country}`,
    `arah kiblat ${city}`,
  ],
  countryTitle: (country: string) => `Waktu Salat di ${country} — Semua Kota`,
  countryH1: (country: string) => `Waktu Salat di ${country}`,
  countryIntro: (country: string, n: number) =>
    `Waktu salat untuk ${n} kota di ${country}. Pilih kota untuk melihat waktu Subuh, Zuhur, Asar, Magrib, dan Isya hari ini, jadwal lengkap bulan ini, serta arah kiblat.`,
  countryDescription: (country: string, n: number, largest: string) =>
    `Waktu salat untuk seluruh ${n} kota di ${country}, termasuk ${largest}. Waktu Subuh, Zuhur, Asar, Magrib, dan Isya hari ini, jadwal bulanan, serta arah kiblat. Gratis dan sumber terbuka.`,
  breadcrumb: "Navigasi halaman",
  citiesIn: (country: string) => `Kota di ${country}`,
  citiesInBody: (country: string) => `Semua kota di ${country} dengan jadwal salat sendiri, diurutkan dari kota terbesar.`,
  nearby: (city: string) => `Waktu salat di dekat ${city}`,
  nearbyBody: "Kota terdekat yang memiliki jadwalnya sendiri.",
  population: (n: number) => `${n.toLocaleString("id-ID")} jiwa`,
  todayIn: (city: string) => `Hari ini di ${city}`,
  countryToday: (country: string) => `Hari ini di seluruh ${country}`,
  countryTodayBody: (n: number) =>
    `Lima waktu salat saat ini di ${n} kota terbesar, masing-masing menurut waktu setempat. Waktu salat bergeser sekitar empat menit untuk setiap derajat bujur, sehingga negara seluas ini tidak memiliki satu jadwal yang sama.`,
  liveNote: (tz: string) =>
    `Waktu ditampilkan dalam zona waktu ${tz}, zona waktu kota, dengan format 24 jam — bukan zona waktu perangkat Anda.`,
  timetable: (city: string, month: string) => `Jadwal salat ${month} untuk ${city}`,
  timetableBody: (city: string) =>
    `Setiap hari pada bulan ini, dihitung berdasarkan koordinat ${city}. Terbit matahari menandai akhir waktu Subuh; terbit bukan waktu salat.`,
  dateColumn: "Tanggal",
  factsTitle: (city: string) => `Tentang ${city}`,
  coordinates: "Koordinat",
  timezone: "Zona waktu",
  qiblaDirection: "Arah kiblat",
  toMakkah: "Jarak ke Makkah",
  method: "Metode perhitungan",
  region: "Wilayah",
  km: (n: number) => `${n.toLocaleString("id-ID")} km`,
  fromNorth: (degrees: number, point: string) => `${degrees}° ${point} dari utara`,
  compass: { n: "U", ne: "TL", e: "T", se: "TG", s: "S", sw: "BD", w: "B", nw: "BL" },
  listComma: ", ",
  faqEyebrow: "Tanya Jawab Waktu Salat",
  faqH2: (place: string) => `Waktu salat di ${place}`,
  cityFaq: (city: string, country: string, tz: string, method: string, qibla: string) => [
    {
      q: "Pukul berapa waktu Subuh hari ini?",
      a: `Waktu Subuh hari ini di ${city} tercantum di bagian atas halaman, beserta hitung mundur langsung. Waktu dihitung dari posisi matahari pada koordinat ${city} menggunakan metode ${method} dan ditampilkan dalam zona waktu ${tz}.`,
    },
    {
      q: `Pukul berapa Magrib — waktu berbuka — di ${city}?`,
      a: `Waktu Magrib dimulai saat matahari terbenam di ${city}; pada Ramadan, inilah waktu berbuka puasa. Waktu Magrib hari ini tercantum di atas dan jadwal bulanan di bawah menampilkan setiap hari agar Anda dapat merencanakan sebelumnya.`,
    },
    {
      q: `Metode perhitungan apa yang digunakan di ${country}?`,
      a: `${country} umumnya menggunakan ${method}, yang menjadi metode bawaan halaman ini. Metode berbeda terutama pada sudut matahari untuk Subuh dan Isya. Jika masjid Anda menggunakan metode lain, alat waktu salat memungkinkan Anda menggantinya.`,
    },
    {
      q: `Ke arah mana kiblat dari ${city}?`,
      a: `Arah kiblat dari ${city} adalah ${qibla}, dihitung sebagai arah lingkaran besar menuju Ka'bah di Makkah — jalur terpendek di permukaan bumi, yang dapat berbeda dari arah pada peta datar.`,
    },
    {
      q: `Apakah waktu salat di ${city} akurat?`,
      a: `Waktu dihitung untuk koordinat ${city}, bukan rata-rata seluruh negara. Hal ini penting karena waktu salat bergeser sekitar empat menit untuk setiap derajat bujur. Untuk hasil terdekat, gunakan halaman kota yang paling dekat dengan Anda.`,
    },
  ],
  countryFaq: (country: string, method: string, n: number, largest: string) => [
    {
      q: `Berapa waktu salat hari ini di ${country}?`,
      a: `Waktu salat berbeda-beda di ${country} — bergeser sekitar empat menit untuk setiap derajat bujur, dan lebih jauh jika negara mencakup beberapa zona waktu. Pilih kota dari daftar untuk waktu yang tepat, atau gunakan alat waktu salat untuk mendeteksi lokasi Anda.`,
    },
    {
      q: `Metode perhitungan waktu salat apa yang digunakan di ${country}?`,
      a: `Halaman kota di ${country} menggunakan ${method} sebagai metode bawaan, yang paling umum digunakan di sana. Perbedaan metode terutama terlihat pada waktu fajar dan malam karena sudut matahari yang berbeda.`,
    },
    {
      q: `Kota mana saja di ${country} yang tersedia?`,
      a: `${n} kota memiliki halaman jadwal masing-masing, dimulai dari ${largest}. Setiap halaman menampilkan waktu hari ini, jadwal bulanan, dan arah kiblat. Jika kota Anda belum tercantum, kota terdekat dapat menjadi acuan.`,
    },
    {
      q: `Kapan Ramadan dimulai di ${country}?`,
      a: `Ramadan mengikuti kalender Hijriah sehingga tanggal Masehinya maju sekitar sebelas hari setiap tahun; awal tepatnya bergantung pada rukyatulhilal yang diikuti negara Anda. Hitung mundur Ramadan melacak tanggal perkiraan, dan halaman tiap kota menampilkan waktu Subuh serta Magrib untuk sahur dan berbuka.`,
    },
  ],
};
