import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/tafseer/client";

export const metadata = toolMetadata("en", "tafseer");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="tafseer" />
      <Client />
    </>
  );
}
