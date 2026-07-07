import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Falah.io — The Islamic Toolkit",
    short_name: "Falah",
    description:
      "15 free Islamic tools that run entirely in your browser: prayer times, Qibla, Hijri calendar, Zakat, Quran, inheritance and more.",
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#047857",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
