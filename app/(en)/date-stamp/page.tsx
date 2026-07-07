import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/date-stamp/client";

export const metadata = toolMetadata("en", "stamp");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="stamp" />
      <Client />
    </>
  );
}
