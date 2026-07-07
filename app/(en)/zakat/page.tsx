import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/zakat/client";

export const metadata = toolMetadata("en", "zakat");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="zakat" />
      <Client />
    </>
  );
}
