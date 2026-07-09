export const cards = {
  meta: {
    title: "Quran Card Maker — verse images for social media",
    description:
      "Generate 1080×1080 Quran verse cards with Arabic calligraphy and translation, rendered in your browser with canvas. Free download as PNG.",
  },
  title: "Quran Card Maker",
  side: "بطاقات قرآنية",
  intro: "Pick any verse and generate a share-ready card, rendered entirely in your browser with the canvas API.",
  surah: "Surah",
  ayah: (max: number) => `Ayah (1–${max})`,
  style: "Style",
  styles: { emerald: "Emerald", night: "Night", parchment: "Parchment" },
  generate: "Generate card",
  rendering: "Rendering…",
  download: "Download PNG",
  error: "Could not fetch that verse. Check the ayah number and your connection.",
  sizeNote: "1080×1080 px — sized for social media.",
  reference: (name: string, s: number, a: number) => `Surah ${name} · ${s}:${a}`,
};
