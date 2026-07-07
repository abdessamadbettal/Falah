import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/names-of-allah/client";

export const metadata = toolMetadata("en", "names");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="names" />
      <Client />
    </>
  );
}
