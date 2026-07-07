import type { Metadata } from "next";
import { SITE_URL } from "@/lib/i18n";

export function legacyMetadata(target: string): Metadata {
  return {
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE_URL}${target}` },
  };
}

/** Static meta-refresh to `target` (e.g. "/zakat" or "/") — `redirect()`
 * doesn't produce usable markup for a no-JS visitor or crawler under
 * `output: "export"`, only a client-side RSC signal. */
export function LegacyRedirect({ target }: { target: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <noscript>
        <p>
          Moved to <a href={target}>{target}</a>
        </p>
      </noscript>
    </>
  );
}
