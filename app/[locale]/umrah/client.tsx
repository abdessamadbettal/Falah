"use client";

import { useDict } from "@/components/locale";
import { ToolShell } from "@/components/ui";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function UmrahSimulatorClient() {
  const d = useDict();
  const t = d.tools.umrah;

  return (
    <ToolShell icon="ph:cube" title={t.title} side={t.side} intro={t.intro}>
      <div className="relative flex h-[60vh] w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-950 shadow-inner">
        <Canvas camera={{ position: [10, 5, 10], fov: 50 }}>
          <OrbitControls 
            enablePan={false} 
            minDistance={5} 
            maxDistance={20} 
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under the floor
          />
        </Canvas>
      </div>
    </ToolShell>
  );
}
