"use client";

import { useDict } from "@/components/locale";
import { ToolShell } from "@/components/ui/tool-shell";
import { cardCls } from "@/components/ui/styles";

export default function Client() {
  const d = useDict();
  const k = d.tools.tasbeeh;

  return (
    <ToolShell icon="ph:fingerprint" title={k.title} side={k.side} intro={k.intro}>
      <div className={`${cardCls} mx-auto max-w-sm overflow-hidden p-8 text-center`}>
        <p>Tasbeeh UI will go here</p>
      </div>
    </ToolShell>
  );
}
