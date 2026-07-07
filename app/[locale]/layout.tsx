import type { Metadata, Viewport } from "next";
import { Albert_Sans, Amiri, Geist_Mono, Marcellus } from "next/font/google";
import { notFound } from "next/navigation";
import { LocaleProvider } from "@/components/locale";
import {
  SITE_URL,
  dirFor,
  getDict,
  isLocale,
  locales,
  type Locale,
} from "@/lib/i18n";
import "../globals.css";

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const d = getDict(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: d.meta.siteTitle,
      template: d.meta.titleTemplate,
    },
    description: d.meta.siteDescription,
    applicationName: "Falah.io",
    keywords: [
      "Islamic tools",
      "prayer times",
      "qibla",
      "hijri calendar",
      "zakat calculator",
      "quran",
      "open source",
    ],
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      suppressHydrationWarning
      className={`${albertSans.variable} ${marcellus.variable} ${amiri.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-zinc-900 antialiased selection:bg-emerald-700 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <LocaleProvider locale={locale as Locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
