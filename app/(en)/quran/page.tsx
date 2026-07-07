import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/quran/client";

export const metadata = toolMetadata("en", "quran");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="quran" />
      <Client />
    </>
  );
}
