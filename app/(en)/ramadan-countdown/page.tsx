import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/ramadan-countdown/client";

export const metadata = toolMetadata("en", "ramadan");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="ramadan" />
      <Client />
    </>
  );
}
