import { toolMetadata, ToolJsonLd } from "@/lib/tool-page";
import Client from "@/app/[locale]/hijri-calendar/client";

export const metadata = toolMetadata("en", "calendar");

export default function Page() {
  return (
    <>
      <ToolJsonLd locale="en" toolKey="calendar" />
      <Client />
    </>
  );
}
