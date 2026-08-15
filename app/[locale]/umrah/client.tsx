"use client";

import { useDict } from "@/components/locale";
import { ToolShell } from "@/components/ui";

export default function UmrahSimulatorClient() {
  const d = useDict();
  const t = d.tools.umrah;

  return (
    <ToolShell icon="ph:cube" title={t.title} side={t.side} intro={t.intro}>
      <div className="flex h-[60vh] w-full items-center justify-center rounded-xl bg-zinc-950 overflow-hidden shadow-inner relative">
        <div className="text-zinc-500">3D Canvas Loading...</div>
      </div>
    </ToolShell>
  );
}
