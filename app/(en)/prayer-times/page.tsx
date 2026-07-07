import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/prayer-times/client";

export const metadata = toolMetadata("en", "prayer");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="prayer" />
      <Client />
    </>
  );
}
