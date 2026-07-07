import type { Metadata } from "next";
import { Albert_Sans, Amiri, Geist_Mono, Marcellus } from "next/font/google";
import "./globals.css";

const albertSans = Albert_Sans({
  variable: "--font-albert",
  subsets: ["latin"],
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Falah.io — The Islamic Toolkit",
  description:
    "An open-source, zero-tracking, ad-free suite of essential Islamic tools. Prayer times, Qibla, Zakat, Quran, and more — everything runs client-side in your browser. Built as Sadaqah Jariyah.",
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${albertSans.variable} ${marcellus.variable} ${amiri.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-zinc-900 antialiased selection:bg-emerald-700 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
