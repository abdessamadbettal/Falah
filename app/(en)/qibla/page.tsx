import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/qibla/client";

export const metadata = toolMetadata("en", "qibla");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="qibla" />
      <Client />
    </>
  );
}
