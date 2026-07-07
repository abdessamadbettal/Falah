import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/hijri-age/client";

export const metadata = toolMetadata("en", "age");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="age" />
      <Client />
    </>
  );
}
