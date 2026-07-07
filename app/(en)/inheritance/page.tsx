import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/inheritance/client";

export const metadata = toolMetadata("en", "inheritance");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="inheritance" />
      <Client />
    </>
  );
}
