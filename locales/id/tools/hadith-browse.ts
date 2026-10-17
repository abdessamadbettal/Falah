import type { hadithBrowse as en } from "../../en/tools/hadith-browse";

export const hadithBrowse: typeof en = {
  hadith: "Hadis",
  collections: "Kumpulan",
  collection: "Kumpulan",
  book: "Kitab",
  books: "Kitab",
  compiler: "Penyusun",
  died: (ah: number, ce: number) => `w. ${ah} H / ${ce} M`,
  grade: "Derajat hadis",
  gradedBy: (grader: string) => grader,
  reference: "Referensi",
  hadithCount: (n: number) => `${fmt(n)} hadis`,
  bookCount: (n: number) => `${n} kitab`,
  numbered: (n: number) => `Hadis ${fmt(n)}`,
  inBook: (n: number) => `Kitab ${n}`,
  arabicNumbering: (n: number) => `Nomor Arab ${fmt(n)}`,
  range: (first: number, last: number) => `Hadis ${fmt(first)}–${fmt(last)}`,
  partOf: (part: number, total: number) => `Bagian ${part} dari ${total}`,
  genre: "Hadis",
  alsoKnownAs: "Juga dikenal sebagai",
  kind: {
    sahih: "Sahih",
    sunan: "Sunan",
    muwatta: "Muwatta",
    forty: "Arba'in",
  } as Record<string, string>,
  kindNote: {
    sahih: "Setiap hadis dalam kumpulan ini memenuhi kriteria kesahihan yang ditetapkan penyusunnya.",
    sunan: "Disusun menurut bab fikih dan diberi penilaian — setiap hadis memuat derajat dari ulama hadis.",
    muwatta: "Kumpulan hadis tertua yang masih lestari, memadukan hadis dengan praktik penduduk Madinah.",
    forty: "Kumpulan ringkas yang mudah dihafal, berisi hadis-hadis yang merangkum ajaran agama.",
  } as Record<string, string>,
  sixBooks: "Kutub as-Sittah",
  sixBooksNote: "Salah satu dari enam kitab hadis utama",
  hubSixTitle: "Enam kitab hadis utama",
  hubSixP:
    "Kutub as-Sittah — enam kitab yang dianggap sebagai inti Sunnah yang dihimpun dalam tradisi keilmuan Sunni. Sahih al-Bukhari dan Sahih Muslim merupakan dua kitab dengan seleksi kesahihan paling ketat; empat kitab Sunan menyusun hadis menurut bab hukum dan mencantumkan penilaian setiap hadis.",
  hubOtherTitle: "Kumpulan terdahulu dan ringkas",
  hubOtherP:
    "Muwatta Imam Malik disusun sebelum keenam kitab tersebut dan memadukan hadis dengan praktik penduduk Madinah. Kumpulan Arba'in memang dirancang ringkas agar mudah dihafal dan secara tradisional menjadi hadis-hadis pertama yang dipelajari penuntut ilmu.",
  hubStatsTitle: (hadiths: number, collections: number) =>
    `${fmt(hadiths)} hadis dalam ${collections} kumpulan`,
  browseBooks: (n: number) => `Jelajahi semua ${n} kitab`,
  openCollection: "Baca kumpulan ini",
  collectionTitle: (name: string, hadiths: number) => `${name} — seluruh ${fmt(hadiths)} hadis`,
  collectionDesc: (name: string, author: string, hadiths: number, books: number) =>
    `Baca ${name} secara lengkap — seluruh ${fmt(hadiths)} hadis yang dihimpun ${author}, disusun dalam ${books} kitab, dengan teks Arab dan terjemahan bahasa Inggris. Gratis, tanpa iklan atau akun.`,
  collectionH1: (name: string) => name,
  collectionIntro: (
    name: string,
    author: string,
    hadiths: number,
    books: number,
    era: string,
    note: string,
  ) =>
    `${name} dihimpun oleh ${author} (${era}). Kumpulan ini berisi ${fmt(hadiths)} hadis dalam ${books} kitab Sunnah. ${note} Setiap hadis di bawah ditampilkan dalam bahasa Arab asli dengan terjemahan bahasa Inggris, dan setiap kitab memiliki halaman tersendiri.`,
  collectionBooksTitle: (name: string) => `Kitab-kitab ${name}`,
  collectionBooksP: (books: number) =>
    `Seluruh ${books} kitab, sesuai urutan edisi cetak. Setiap kitab memiliki halaman lengkap berisi teks Arab, terjemahan, dan referensi setiap hadis.`,
  chapterTitle: (collection: string, title: string) => `${collection}: ${title}`,
  chapterTitlePart: (collection: string, title: string, part: number) =>
    `${collection}: ${title} — bagian ${part}`,
  chapterDesc: (collection: string, title: string, n: number, hadiths: number, range: string) =>
    `Kitab ${n} dari ${collection}, “${title}” — ${fmt(hadiths)} hadis (${range}) dalam bahasa Arab dengan terjemahan bahasa Inggris dan derajat kesahihan setiap hadis.`,
  chapterDescPart: (
    collection: string,
    title: string,
    n: number,
    part: number,
    total: number,
    range: string,
  ) =>
    `Bagian ${part} dari ${total} kitab ${n} dalam ${collection}, “${title}” — ${range} dalam bahasa Arab beserta terjemahan bahasa Inggris dan derajat hadis.`,
  chapterH1: (title: string) => title,
  chapterIntro: (
    collection: string,
    title: string,
    n: number,
    hadiths: number,
    range: string,
    author: string,
  ) =>
    `“${title}” adalah kitab ${n} dari ${collection}, kumpulan karya ${author}. Isinya ${fmt(hadiths)} hadis — ${range} menurut penomoran standar. Setiap hadis ditampilkan dalam bahasa Arab asli dengan terjemahan bahasa Inggris, referensi lengkap, dan derajat yang diberikan ulama hadis jika tersedia.`,
  splitNote: (parts: number) =>
    `Kitab ini cukup panjang sehingga dibagi menjadi ${parts} halaman agar tiap halaman cepat dimuat; bagian-bagiannya berurutan dan tertaut di bagian bawah halaman.`,
  chapterIntroPart: (
    collection: string,
    title: string,
    n: number,
    part: number,
    total: number,
    range: string,
  ) =>
    `Ini bagian ${part} dari ${total} “${title}”, kitab ${n} dalam ${collection} — ${range}. Karena kitab ini panjang, isinya dibagi menjadi ${total} halaman agar setiap halaman cepat dimuat; semua bagian berurutan dan tertaut di bagian bawah halaman.`,
  hadithTitle: (collection: string, n: number) => `Hadis ${n} dalam ${collection}`,
  hadithDesc: (collection: string, n: number, excerpt: string) =>
    `Hadis ${n} dalam ${collection}: “${excerpt}” — teks Arab lengkap, terjemahan bahasa Inggris, dan referensi.`,
  hadithH1: (n: number) => `Hadis ${n}`,
  hadithIntro: (collection: string, n: number, total: number, author: string) =>
    `Hadis ke-${n} dari ${total} hadis yang dihimpun ${author} dalam ${collection}, ditampilkan di bawah dalam bahasa Arab asli dengan terjemahan bahasa Inggris dan referensinya.`,
  allBooks: (name: string) => `Semua kitab ${name}`,
  allCollections: "Semua kumpulan hadis",
  prevBook: "Kitab sebelumnya",
  nextBook: "Kitab berikutnya",
  prevHadith: "Hadis sebelumnya",
  nextHadith: "Hadis berikutnya",
  prevPart: "Bagian sebelumnya",
  nextPart: "Bagian berikutnya",
  moreCollections: "Kumpulan lainnya",
  moreCollectionsP:
    "Hadis yang sama kerap diriwayatkan oleh lebih dari satu penyusun. Kumpulan lain berikut tersedia secara lengkap di sini.",
  onThisPage: "Di halaman ini",
  faqH2: "Tentang kumpulan hadis",
  hubFaq: [
    {
      q: "Apa itu hadis?",
      a: "Hadis adalah riwayat tentang perkataan, perbuatan, atau persetujuan Nabi Muhammad ﷺ. Secara keseluruhan, hadis membentuk Sunnah, sumber tuntunan Islam kedua setelah Al-Qur'an.",
    },
    {
      q: "Kumpulan hadis mana yang paling sahih?",
      a: "Sahih al-Bukhari dan Sahih Muslim dianggap memiliki seleksi kesahihan paling ketat dan bersama-sama disebut Sahihain. Keduanya merupakan dua kitab pertama dari enam kumpulan utama, Kutub as-Sittah.",
    },
    {
      q: "Apa arti derajat Sahih, Hasan, dan Da'if?",
      a: "Derajat tersebut merupakan penilaian terhadap sanad periwayatan. Sahih berarti autentik, Hasan berarti baik dengan sanad yang sedikit lebih rendah, dan Da'if berarti lemah. Bukhari dan Muslim hanya menerima hadis yang memenuhi kriteria masing-masing sehingga kumpulan mereka tidak memberi penilaian untuk setiap hadis; empat kitab Sunan mencantumkannya.",
    },
    {
      q: "Dari mana teks ini berasal?",
      a: "Teks Arab, terjemahan bahasa Inggris, dan penilaian hadis berasal dari dataset terbuka hadith-api. Judul kitab diperiksa silang dengan dataset independen sebelum diterbitkan. Tidak ada teks yang disunting atau diringkas.",
    },
    {
      q: "Apakah kumpulan ini gratis dibaca?",
      a: "Ya — seluruh kumpulan dapat dibaca gratis, tanpa iklan, akun, atau paywall. Falah dibangun sebagai sedekah jariyah.",
    },
  ],
  collectionFaq: (name: string, author: string, hadiths: number, books: number) => [
    {
      q: `Berapa jumlah hadis dalam ${name}?`,
      a: `Edisi ${name} ini memuat ${fmt(hadiths)} hadis dalam ${books} kitab. Penomoran berbeda antar edisi cetak, sehingga nomor hadis di sini mungkin berbeda satu atau dua angka dari edisi lain.`,
    },
    {
      q: `Siapa yang menyusun ${name}?`,
      a: `${name} disusun oleh ${author} dan ditampilkan lengkap dalam bahasa Arab asli dengan terjemahan bahasa Inggris.`,
    },
    {
      q: `Apakah ${name} dapat dibaca gratis?`,
      a: `Ya. Setiap kitab ${name} tersedia gratis di Falah.io — tanpa akun, iklan, atau bab yang dikunci.`,
    },
  ],
  sourceNote:
    "Teks bersumber dari dataset terbuka hadith-api. Penomoran mengikuti edisi tersebut dan mungkin sedikit berbeda dari edisi cetak — periksa teks Arab pada kitab hadis tepercaya sebelum menggunakan referensi.",
};

function fmt(n: number): string {
  return n.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}
