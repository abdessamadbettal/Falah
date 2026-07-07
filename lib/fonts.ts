import { Albert_Sans, Amiri, Geist_Mono, Marcellus } from "next/font/google";

export const albertSans = Albert_Sans({
  variable: "--font-albert",
  subsets: ["latin"],
});

export const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

export const amiri = Amiri({
  variable: "--font-amiri",
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const fontVariables = `${albertSans.variable} ${marcellus.variable} ${amiri.variable} ${geistMono.variable}`;
