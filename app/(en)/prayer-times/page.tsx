import { ToolJsonLd, toolMetadata } from "@/lib/tool-page";
import Client from "@/app/[locale]/prayer-times/client";

export const metadata = toolMetadata("en", "stamp");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="stamp" />
      <Client />
    </>
  );
}
