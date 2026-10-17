import type { namePage as en } from "../../en/tools/name-page";

export const namePage: typeof en = {
  number: (n: number) => `Asma ke-${n} dari 99`,
  h1: (word: string) => word,
  metaTitle: (word: string, meaning: string) => `${word} — ${meaning} | Makna dan Penjelasan`,
  metaDescription: (word: string, arabic: string, meaning: string) =>
    `${word}${arabic === word ? "" : ` (${arabic})`} bermakna “${meaning}”. Pelajari arti asma Allah ini, kemunculannya dalam Al-Qur'an, dan cara berdoa dengan menyebut-Nya. Gratis, tanpa iklan atau pelacakan.`,
  keywords: (word: string, arabic: string) => [
    `arti ${word}`,
    `makna ${word}`,
    `asma Allah ${word}`,
    `${arabic} معنى`,
    `${word} dalam Al-Qur'an`,
    "99 asma Allah",
    "asmaul husna",
  ],
  meaningLabel: "Makna",
  arabicLabel: "Dalam bahasa Arab",
  transliterationLabel: "Transliterasi",
  numberLabel: "Urutan dalam daftar",
  inQuran: (word: string) => `${word} dalam Al-Qur'an`,
  inQuranBody: (word: string, n: number) =>
    n === 1
      ? `Ayat di bawah memuat asma ini. Setiap rujukan diperiksa dengan teks Arab Al-Qur'an sebelum diterbitkan, sehingga ${word} memang terdapat dalam ayat yang dirujuk.`
      : `${n} ayat di bawah memuat asma ini. Setiap rujukan diperiksa dengan teks Arab Al-Qur'an sebelum diterbitkan, sehingga ${word} memang terdapat dalam setiap ayat yang dirujuk.`,
  notInQuran: (word: string) => `Asal asma ${word}`,
  notInQuranBody: (word: string) =>
    `${word} tidak muncul dalam Al-Qur'an sebagai asma yang berdiri sendiri. Asma ini masuk ke dalam daftar 99 asma yang masyhur melalui riwayat at-Tirmidzi. Maknanya ditegaskan Al-Qur'an dengan kata lain — melalui kata kerja dan bentuk terkait, bukan asma itu sendiri. Para ulama menerima asma-asma seperti ini berdasarkan landasan tersebut; halaman ini menjelaskan perbedaannya secara terbuka.`,
  readVerse: "Baca surah lengkap",
  verseRef: (surah: string, s: number, a: number) => `Surah ${surah} ${s}:${a}`,
  related: "Asma di sekitarnya",
  browseAll: "Semua 99 Asmaul Husna",
  browseAllBody: "Seluruh Asmaul Husna, masing-masing dengan halamannya sendiri.",
  indexEyebrow: "Jelajahi Asmaul Husna",
  indexTitle: "99 Asma Allah",
  indexIntro:
    "Setiap Asmaul Husna dilengkapi tulisan Arab, transliterasi, dan makna — serta halaman tersendiri yang menjelaskan artinya, kemunculannya dalam Al-Qur'an, dan cara berdoa dengan menyebut-Nya.",
  narrationEyebrow: "Tentang daftar Asma Allah",
  narrationTitle: "Seberapa kuat dasar daftar 99 asma Allah?",
  narrationBody:
    "Keterangan bahwa Allah memiliki 99 asma terdapat dalam Sahih al-Bukhari dan Sahih Muslim, dan keduanya disepakati. Perincian khusus — daftar 99 asma ini — berasal dari riwayat Jami' at-Tirmidzi yang disebut gharib oleh at-Tirmidzi sendiri dan dinilai lemah oleh banyak ahli hadis; sebagian ulama berpendapat asma-asma tersebut disusun seorang perawi dengan menelusuri Al-Qur'an dan Sunnah. Ulama klasik seperti al-Khattabi, Ibn Hazm, al-Qurtubi, dan al-Ghazali menyusun daftar berbeda. Hal ini tidak mengubah kebenaran asma-asma Allah yang masing-masing memiliki dasar; artinya, susunan tepat 99 asma merupakan pengelompokan ulama, bukan daftar yang ditetapkan wahyu, dan asma Allah tidak terbatas pada jumlah itu.",
  faqEyebrow: "Tentang asma ini",
  faqH2: (word: string) => `Pertanyaan tentang ${word}`,
  faq: (word: string, arabic: string, meaning: string, n: number, verses: number) => [
    {
      q: `Apa arti ${word}?`,
      a: `${word}${arabic === word ? "" : ` (${arabic})`} bermakna “${meaning}”. Seperti asma-asma Allah lainnya, asma ini menggambarkan sifat Allah, bukan sekadar sebutan — melalui asma-asma-Nya, Al-Qur'an mengajarkan siapa Allah.`,
    },
    {
      q: `Apakah ${word} ada dalam Al-Qur'an?`,
      a:
        verses > 0
          ? `Ya. Halaman ini mencantumkan ${verses} ayat yang memuat ${word}; masing-masing telah diperiksa terhadap teks Arab sebelum diterbitkan.`
          : `Tidak sebagai asma yang berdiri sendiri. ${word} masuk dalam daftar 99 asma melalui riwayat at-Tirmidzi, sementara maknanya ditegaskan dalam Al-Qur'an melalui kata kerja dan bentuk terkait. Halaman ini menyatakannya dengan jelas tanpa mengaitkan ayat yang tidak memuat asma tersebut.`,
    },
    {
      q: `Bagaimana berdoa kepada Allah dengan asma ini?`,
      a: `Sebut “Ya” sebelum asma ini — “Ya ${word.replace(/^(Al|Ar|As|Ad|Az|An)-/, "")}” — lalu mintalah sesuai makna sifat tersebut. Al-Qur'an memerintahkannya: “Hanya milik Allah nama-nama yang terbaik, maka bermohonlah kepada-Nya dengan menyebut nama-nama itu” (7:180).`,
    },
    {
      q: `Urutan ke berapa asma ini dalam daftar 99 Asmaul Husna?`,
      a: `Asma ini berada di urutan ke-${n} dalam daftar yang masyhur. Urutannya berasal dari riwayat at-Tirmidzi dan merupakan susunan ulama, sehingga nomor dapat sedikit berbeda antara satu daftar cetak dan lainnya — asma-asmanya tetap sama.`,
    },
  ],
};
