import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/quran-cards/client";

export const metadata = toolMetadata("en", "cards");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="cards" />
      <Client />
    </>
  );
}
