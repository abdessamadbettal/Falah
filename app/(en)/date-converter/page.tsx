import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/date-converter/client";

export const metadata = toolMetadata("en", "converter");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="converter" />
      <Client />
    </>
  );
}
