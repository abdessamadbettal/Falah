import type { cards as en } from "../../en/tools/cards";

export const cards: typeof en = {
  meta: {
    title: "Pembuat Kartu Ayat Al-Qur'an — gambar ayat untuk media sosial",
    description:
      "Buat kartu ayat Al-Qur'an berukuran 1080×1080 dengan kaligrafi Arab dan terjemahan, dirender di browser menggunakan canvas. Unduh PNG gratis.",
  },
  title: "Pembuat Kartu Al-Qur'an",
  side: "بطاقات قرآنية",
  intro: "Pilih ayat dan buat kartu siap dibagikan, dirender sepenuhnya di browser menggunakan API canvas.",
  surah: "Surah",
  ayah: (max: number) => `Ayat (1–${max})`,
  style: "Gaya",
  styles: { emerald: "Zamrud", night: "Malam", parchment: "Perkamen" },
  generate: "Buat kartu",
  rendering: "Merender…",
  download: "Unduh PNG",
  error: "Ayat tidak dapat dimuat. Periksa nomor ayat dan koneksi Anda.",
  sizeNote: "1080×1080 px — ukuran sesuai untuk media sosial.",
  reference: (name: string, s: number, a: number) => `Surah ${name} · ${s}:${a}`,
};
