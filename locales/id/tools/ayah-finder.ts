import type { ayahFinder as en } from "../../en/tools/ayah-finder";

export const ayahFinder: typeof en = {
  meta: {
    title: "Pencari Ayat — temukan ayat Al-Qur'an lewat teks atau suara",
    description:
      "Cari di seluruh 6.236 ayat Al-Qur'an dengan mengetik atau mengucapkan teks Arab, lalu buka ayatnya langsung di pembaca.",
  },
  title: "Pencari Ayat",
  side: "باحث الآيات",
  intro: "Cari ayat Al-Qur'an dengan mengetik atau mengucapkan bahasa Arab, lalu baca ayat tersebut di pembaca lengkap.",
  mic: "Mulai mendengarkan",
  listening: "Sedang mendengarkan…",
  unsupported: "Input suara tidak didukung",
  micError: "Input suara gagal. Periksa mikrofon dan izinnya, lalu coba lagi.",
  micPermission: "Akses mikrofon ditolak. Izinkan mikrofon untuk situs ini melalui pengaturan browser.",
  micNoDevice: "Mikrofon tidak ditemukan. Periksa pengaturan audio perangkat Anda.",
  micNetwork: "Layanan pengenal suara tidak dapat dijangkau. Periksa koneksi internet dan coba lagi.",
  micInsecure: "Input suara memerlukan koneksi aman. Buka aplikasi melalui localhost atau HTTPS.",
  placeholder: "Ketik teks Arab, mis. «الرحمن»",
  results: (n: number) => `${n} hasil`,
  noResults: "Ayat yang cocok tidak ditemukan. Coba frasa lain.",
  confidence: "Tingkat kecocokan",
  ayah: "Ayat",
  loading: "Mencari…",
  error: "Pencarian gagal. Periksa koneksi Anda lalu coba lagi.",
  read: "Baca",
  privacy:
    "Pencarian berjalan sepenuhnya di browser Anda — kueri, suara, dan indeks tidak pernah meninggalkan perangkat.",
  emptyTip: "Ketik atau ucapkan beberapa kata dalam bahasa Arab untuk menemukan ayat.",
};
