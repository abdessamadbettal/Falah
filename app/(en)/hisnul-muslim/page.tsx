import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/hisnul-muslim/client";

export const metadata = toolMetadata("en", "hisnul");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="hisnul" />
      <Client />
    </>
  );
}
