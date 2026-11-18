import type { cards as en } from "../../en/tools/cards";

export const cards: typeof en = {
  meta: {
    title: "Creador de tarjetas del Corán — aleyas para redes sociales",
    description:
      "Genera tarjetas de aleyas del Corán de 1080×1080 con caligrafía árabe y traducción, creadas en tu navegador con canvas. Descarga gratuita en PNG.",
  },
  title: "Creador de tarjetas del Corán",
  side: "بطاقات قرآنية",
  intro: "Elige cualquier aleya y genera una tarjeta lista para compartir, creada por completo en tu navegador con la API de canvas.",
  surah: "Sura",
  ayah: (max: number) => `Aleya (1–${max})`,
  style: "Estilo",
  styles: { emerald: "Esmeralda", night: "Noche", parchment: "Pergamino", royal: "Real", sunset: "Atardecer", ocean: "Océano", slate: "Pizarra" },
  includeTranslation: "Incluir traducción",
  translationSource: "Fuente de la traducción",
  autoSizeFont: "Tamaño de letra automático",
  arabicSize: "Tamaño del árabe (px)",
  translationSize: "Tamaño de la traducción (px)",
  generate: "Generar tarjeta",
  rendering: "Generando…",
  download: "Descargar PNG",
  error: "No se ha podido obtener esa aleya. Comprueba el número de aleya y tu conexión.",
  sizeNote: "1080×1080 px: tamaño pensado para redes sociales.",
  reference: (name: string, s: number, a: number) => `Sura ${name} · ${s}:${a}`,
};
