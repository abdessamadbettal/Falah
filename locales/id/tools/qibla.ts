import type { qibla as en } from "../../en/tools/qibla";

export const qibla: typeof en = {
  meta: {
    title: "Pencari Kiblat — arah Ka'bah dengan kompas langsung",
    description:
      "Temukan arah kiblat dari kota mana pun: azimut tepat dari utara sejati, jarak ke Ka'bah di Makkah, dan kompas langsung di ponsel yang mendukung. Privat — dihitung di perangkat Anda.",
  },
  title: "Pencari Kiblat",
  side: "اتجاه القبلة",
  intro:
    "Arah lingkaran besar dari lokasi Anda menuju Ka'bah di Makkah, dihitung secara lokal. Di ponsel dengan kompas, jarum bergerak langsung saat Anda berputar.",
  yourLocation: "Lokasi Anda",
  enableCompass: "Aktifkan kompas langsung",
  compassActive: "Kompas aktif",
  noCompass: "Sensor kompas tidak tersedia — gunakan arah dari utara sejati.",
  fromNorth: "dari utara sejati",
  toQibla: "menuju kiblat",
  needleLive: "Jarum kompas aktif — jarum menunjuk kiblat saat Anda berputar.",
  faceNorth: "Hadap ke utara sejati, lalu berputar sesuai sudut yang ditampilkan.",
  distance: (km: string) => `Jarak ke Ka'bah: ${km} km.`,
  prompt: "Cari kota atau gunakan lokasi Anda untuk menemukan arah kiblat.",
  guideEyebrow: "Langkah demi langkah",
  guideH2: "Cara menemukan arah kiblat",
  guide: [
    {
      icon: "ph:map-pin",
      title: "Tentukan lokasi",
      body: "Cari kota Anda atau pilih “Gunakan lokasi saya”. Arah kiblat adalah arah lingkaran besar dari lokasi tersebut menuju Ka'bah di Makkah.",
    },
    {
      icon: "ph:compass-rose",
      title: "Aktifkan kompas langsung",
      body: "Di ponsel, pilih “Aktifkan kompas langsung” dan izinkan akses gerakan. Jarum akan berputar mengikuti gerakan Anda dan menunjuk kiblat.",
    },
    {
      icon: "ph:arrows-clockwise",
      title: "Kalibrasikan agar akurat",
      body: "Jika jarum bergeser, gerakkan ponsel membentuk angka delapan beberapa kali dan jauhi magnet, pengeras suara, laptop, serta permukaan logam.",
    },
    {
      icon: "ph:navigation-arrow",
      title: "Tidak ada kompas? Gunakan sudut",
      body: "Di laptop atau ponsel tanpa kompas, hadap ke utara sejati lalu berputar sesuai derajat yang ditampilkan untuk menghadap kiblat.",
    },
  ],
  faqEyebrow: "Tanya Jawab Kiblat",
  faqH2: "Tentang arah kiblat",
  faq: [
    {
      q: "Apa itu kiblat?",
      a: "Kiblat adalah arah yang dihadapi umat Islam ketika salat, yaitu menuju Ka'bah di Masjidil Haram, Makkah.",
    },
    {
      q: "Seberapa akurat kompas kiblat ini?",
      a: "Arah dihitung secara presisi dari koordinat Anda menuju Ka'bah. Akurasi kompas langsung bergantung pada magnetometer ponsel, jadi kalibrasikan untuk hasil terbaik.",
    },
    {
      q: "Mengapa jarum kompas menunjuk ke arah yang salah?",
      a: "Kompas ponsel membaca utara magnetis dan mudah terganggu oleh logam, magnet, atau perangkat elektronik di dekatnya. Kalibrasikan kembali dengan gerakan angka delapan dan jauhi sumber gangguan.",
    },
    {
      q: "Apakah pencari kiblat ini bekerja di laptop?",
      a: "Ya, meski kebanyakan laptop tidak memiliki kompas. Alat ini menampilkan arah tepat dari utara sejati agar Anda dapat menyesuaikan arah dengan kompas fisik atau peta.",
    },
    {
      q: "Apakah lokasi saya tetap privat?",
      a: "Arah kiblat dihitung di perangkat Anda. Jika mencari nama kota, hanya nama kota yang dikirim untuk mencari koordinatnya — lokasi GPS tepat Anda tidak diunggah.",
    },
  ],
};
