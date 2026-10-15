import type { namePage as en } from "../../en/tools/name-page";

export const namePage: typeof en = {
  number: (n: number) => `Nama ke-${n} dari 99`,
  h1: (word: string) => word,
  metaTitle: (word: string, meaning: string) => `${word} — ${meaning} | Makna dan Penjelasan`,
  metaDescription: (word: string, arabic: string, meaning: string) =>
    `${word}${arabic === word ? "" : ` (${arabic})`} bermakna “${meaning}”. Pelajari arti nama Allah ini, kemunculannya dalam Al-Qur'an, dan cara berdoa dengan menyebut-Nya. Gratis, tanpa iklan atau pelacakan.`,
  keywords: (word: string, arabic: string) => [
    `arti ${word}`,
    `makna ${word}`,
    `nama Allah ${word}`,
    `${arabic} معنى`,
    `${word} dalam Al-Qur'an`,
    "99 nama Allah",
    "asmaul husna",
  ],
  meaningLabel: "Makna",
  arabicLabel: "Dalam bahasa Arab",
  transliterationLabel: "Transliterasi",
  numberLabel: "Urutan dalam daftar",
  inQuran: (word: string) => `${word} dalam Al-Qur'an`,
  inQuranBody: (word: string, n: number) =>
    n === 1
      ? `Ayat di bawah memuat nama ini. Setiap rujukan diperiksa dengan teks Arab Al-Qur'an sebelum diterbitkan, sehingga ${word} memang terdapat dalam ayat yang dirujuk.`
      : `${n} ayat di bawah memuat nama ini. Setiap rujukan diperiksa dengan teks Arab Al-Qur'an sebelum diterbitkan, sehingga ${word} memang terdapat dalam setiap ayat yang dirujuk.`,
  notInQuran: (word: string) => `Asal nama ${word}`,
  notInQuranBody: (word: string) =>
    `${word} tidak muncul dalam Al-Qur'an sebagai nama yang berdiri sendiri. Nama ini masuk ke dalam daftar 99 nama yang masyhur melalui riwayat at-Tirmidzi. Maknanya ditegaskan Al-Qur'an dengan kata lain — melalui kata kerja dan bentuk terkait, bukan nama itu sendiri. Para ulama menerima nama-nama seperti ini berdasarkan landasan tersebut; halaman ini menjelaskan perbedaannya secara terbuka.`,
  readVerse: "Baca surah lengkap",
  verseRef: (surah: string, s: number, a: number) => `Surah ${surah} ${s}:${a}`,
  related: "Nama di sekitarnya",
  browseAll: "Semua 99 nama",
  browseAllBody: "Seluruh Asmaul Husna, masing-masing dengan halamannya sendiri.",
  indexEyebrow: "Jelajahi nama-nama",
  indexTitle: "99 Nama Allah",
  indexIntro:
    "Setiap nama dilengkapi tulisan Arab, transliterasi, dan makna — serta halaman tersendiri yang menjelaskan artinya, kemunculannya dalam Al-Qur'an, dan cara berdoa dengan menyebut-Nya.",
  narrationEyebrow: "Tentang daftar nama",
  narrationTitle: "Seberapa kuat dasar daftar 99 nama?",
  narrationBody:
    "Keterangan bahwa Allah memiliki 99 nama terdapat dalam Sahih al-Bukhari dan Sahih Muslim, dan keduanya disepakati. Perincian khusus — daftar 99 nama ini — berasal dari riwayat Jami' at-Tirmidzi yang disebut gharib oleh at-Tirmidzi sendiri dan dinilai lemah oleh banyak ahli hadis; sebagian ulama berpendapat nama-nama tersebut disusun seorang perawi dengan menelusuri Al-Qur'an dan Sunnah. Ulama klasik seperti al-Khattabi, Ibn Hazm, al-Qurtubi, dan al-Ghazali menyusun daftar berbeda. Hal ini tidak mengubah kebenaran nama-nama Allah yang masing-masing memiliki dasar; artinya, susunan tepat 99 nama merupakan pengelompokan ulama, bukan daftar yang ditetapkan wahyu, dan nama Allah tidak terbatas pada jumlah itu.",
  faqEyebrow: "Tentang nama ini",
  faqH2: (word: string) => `Pertanyaan tentang ${word}`,
  faq: (word: string, arabic: string, meaning: string, n: number, verses: number) => [
    {
      q: `Apa arti ${word}?`,
      a: `${word}${arabic === word ? "" : ` (${arabic})`} bermakna “${meaning}”. Seperti nama-nama Allah lainnya, nama ini menggambarkan sifat Allah, bukan sekadar sebutan — melalui nama-nama-Nya, Al-Qur'an mengajarkan siapa Allah.`,
    },
    {
      q: `Apakah ${word} ada dalam Al-Qur'an?`,
      a:
        verses > 0
          ? `Ya. Halaman ini mencantumkan ${verses} ayat yang memuat ${word}; masing-masing telah diperiksa terhadap teks Arab sebelum diterbitkan.`
          : `Tidak sebagai nama yang berdiri sendiri. ${word} masuk dalam daftar 99 nama melalui riwayat at-Tirmidzi, sementara maknanya ditegaskan dalam Al-Qur'an melalui kata kerja dan bentuk terkait. Halaman ini menyatakannya dengan jelas tanpa mengaitkan ayat yang tidak memuat nama tersebut.`,
    },
    {
      q: `Bagaimana berdoa kepada Allah dengan nama ini?`,
      a: `Sebut “Ya” sebelum nama ini — “Ya ${word.replace(/^(Al|Ar|As|Ad|Az|An)-/, "")}” — lalu mintalah sesuai makna sifat tersebut. Al-Qur'an memerintahkannya: “Hanya milik Allah nama-nama yang terbaik, maka bermohonlah kepada-Nya dengan menyebut nama-nama itu” (7:180).`,
    },
    {
      q: `Urutan ke berapa nama ini dalam daftar 99 nama?`,
      a: `Nama ini berada di urutan ke-${n} dalam daftar yang masyhur. Urutannya berasal dari riwayat at-Tirmidzi dan merupakan susunan ulama, sehingga nomor dapat sedikit berbeda antara satu daftar cetak dan lainnya — nama-namanya tetap sama.`,
    },
  ],
};
