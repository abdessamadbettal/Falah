import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/mosque-finder/client";

export const metadata = toolMetadata("en", "mosque");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="mosque" />
      <Client />
    </>
  );
}
