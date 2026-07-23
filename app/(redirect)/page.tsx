import type { Metadata } from "next";
import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/** Send the visitor to their language before the meta-refresh fires:
 * the switcher's saved preference wins, then the browser language. */
const DETECT = `(function(){try{var l=localStorage.getItem("locale")||(navigator.language||"").slice(0,2);location.replace(l==="ar"?"/ar/":"/en/")}catch(e){location.replace("/en/")}})();`;

// The bare "/" is where people paste "falah.io", so it needs full social
// cards even though it only redirects. English is the crawler default.
const d = getDict("en");
const OG_IMAGE = `${SITE_URL}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: d.meta.siteTitle,
  description: d.meta.siteDescription,
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/en/` },
  openGraph: {
    title: d.meta.siteTitle,
    description: d.meta.siteDescription,
    url: `${SITE_URL}/en/`,
    siteName: "Falah.io",
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_MA"],
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: "Falah.io — The Islamic Toolkit" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: d.meta.siteTitle,
    description: d.meta.siteDescription,
    images: [OG_IMAGE],
  },
};

/** The bare root: every locale lives under its prefix, so "/" only picks
 * a language. English is the crawler/no-JS default. */
export default function RootRedirect() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: DETECT }} />
      <meta httpEquiv="refresh" content="0;url=/en/" />
      <noscript>
        <p>
          Falah.io — <Link href="/en/">English</Link> ·{" "}
          <Link href="/ar/" lang="ar">
            العربية
          </Link>
        </p>
      </noscript>
    </>
  );
}
