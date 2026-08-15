"use client";

import { useDict } from "@/components/locale";
import { ToolShell } from "@/components/ui";
import { Icon } from "@iconify/react";
import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function Marker({ position, title, description }: { position: [number, number, number], title: string, description: string }) {
  return (
    <Html position={position} center className="pointer-events-none">
      <div className="flex w-48 flex-col items-center text-center">
        <div className="mb-2 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
          <Icon icon="ph:map-pin-fill" className="size-4" />
        </div>
        <div className="rounded-lg bg-white/90 p-2 shadow-xl backdrop-blur-sm dark:bg-zinc-900/90 pointer-events-auto">
          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{title}</div>
          <div className="mt-1 text-[10px] text-zinc-600 dark:text-zinc-400 leading-tight">{description}</div>
        </div>
      </div>
    </Html>
  );
}

function Kaaba() {
  return (
    <group position={[0, 1.5, 0]}>
      {/* Main Kaaba Cube (Black) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      
      {/* Golden Band (Kiswa embroidery) */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[3.01, 0.3, 3.01]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Golden Door (Bab al-Kaaba) */}
      <mesh position={[0.8, 0, 1.51]}>
        <planeGeometry args={[0.7, 1.4]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#eeeeee" roughness={0.1} metalness={0.1} />
    </mesh>
  );
}

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
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          
          <Marker 
            position={[1.6, 1.5, 1.6]} 
            title={t.hajrAlAswad} 
            description={t.hajrAlAswadDesc} 
          />
          
          <Kaaba />
          <Floor />
        </Canvas>
      </div>
    </ToolShell>
  );
}
