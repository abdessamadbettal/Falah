"use client";

import { useDict } from "@/components/locale";
import { ToolShell } from "@/components/ui";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

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
          <Kaaba />
        </Canvas>
      </div>
    </ToolShell>
  );
}
