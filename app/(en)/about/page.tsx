import { AboutJsonLd, aboutMetadata } from "@/lib/tool-page";
import Client from "@/app/[locale]/about/client";

export const metadata = aboutMetadata("en");

export default function Page() {
  return (
    <>
      <AboutJsonLd locale="en" />
      <Client />
    </>
  );
}
