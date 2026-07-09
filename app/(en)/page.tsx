import { HomeJsonLd, homeMetadata } from "@/lib/tool-page";
import HomeClient from "@/app/[locale]/home-client";

export const metadata = homeMetadata("en");

export default function Home() {
  return (
    <>
      <HomeJsonLd locale="en" />
      <HomeClient />
    </>
  );
}
