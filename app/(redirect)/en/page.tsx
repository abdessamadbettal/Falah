import { LegacyRedirect, legacyMetadata } from "../legacy-redirect";

export const metadata = legacyMetadata("/");

/** English moved from /en to the unprefixed root. */
export default function LegacyEnRedirect() {
  return <LegacyRedirect target="/" />;
}
