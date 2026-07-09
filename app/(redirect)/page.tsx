import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

/** Send the visitor to their language before the meta-refresh fires:
 * the switcher's saved preference wins, then the browser language. */
const DETECT = `(function(){try{var l=localStorage.getItem("locale")||(navigator.language||"").slice(0,2);location.replace(l==="ar"?"/ar/":"/en/")}catch(e){location.replace("/en/")}})();`;

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/en/` },
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
