"use client";

import { useDict } from "@/components/locale";
import { ToolShell } from "@/components/ui";
import { Icon } from "@iconify/react";
import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";

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

function SafaMarwa() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Safa Hill */}
      <mesh position={[-4, 1, 0]}>
        <sphereGeometry args={[2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
      {/* Marwa Hill */}
      <mesh position={[4, 1, 0]}>
        <sphereGeometry args={[2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
      
      {/* Connecting Path */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 2]} />
        <meshStandardMaterial color="#E8E2D9" roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function UmrahSimulatorClient() {
  const d = useDict();
  const t = d.tools.umrah;
  
  // 1: Ihram, 2: Tawaf, 3: Sa'i, 4: Halq
  const [stage, setStage] = useState(1);
  const [tawafCircuit, setTawafCircuit] = useState(1);
  const [saiLap, setSaiLap] = useState(1);

  return (
    <ToolShell icon="ph:cube" title={t.title} side={t.side} intro={t.intro}>
      <div className="relative flex h-[60vh] w-full flex-col overflow-hidden rounded-xl bg-zinc-950 shadow-inner">
        {/* Step-by-Step UI Overlay */}
        <div className="absolute top-4 left-4 z-10 w-72 rounded-xl bg-white/95 p-4 shadow-xl backdrop-blur-md dark:bg-zinc-900/95 max-h-[50vh] overflow-y-auto">
          {stage === 1 && (
            <>
              <div className="mb-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {t.stageIhram}
              </div>
              <div className="mb-3">
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{t.ihramNiyyah}</div>
                <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">{t.ihramNiyyahDesc}</p>
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{t.ihramTalbiyah}</div>
                <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic">{t.ihramTalbiyahDesc}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => setStage(2)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-white transition hover:bg-emerald-600"
                >
                  {t.enterIhram} <Icon icon="ph:arrow-right" />
                </button>
              </div>
            </>
          )}

          {stage === 2 && (
            <>
              <div className="mb-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {t.stageTawaf} — {t.tawafCircuit} {tawafCircuit}/7
              </div>
              {tawafCircuit <= 7 ? (
                <>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {t.dragToRotate}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => setTawafCircuit(c => c + 1)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-white transition hover:bg-emerald-600"
                    >
                      {t.completeCircuit} <Icon icon="ph:check" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-relaxed">
                    {t.tawafComplete}
                  </p>
                  <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {t.maqamIbrahimDesc}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => setStage(3)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-white transition hover:bg-emerald-600"
                    >
                      {t.proceedToSai} <Icon icon="ph:arrow-right" />
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {stage === 3 && (
            <>
              <div className="mb-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {t.stageSai} — {t.saiLap} {saiLap}/7
              </div>
              {saiLap <= 7 ? (
                <>
                  <div className="mb-2">
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{t.saiSafa}</div>
                    <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">{t.saiSafaDesc}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => setSaiLap(l => l + 1)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-white transition hover:bg-emerald-600"
                    >
                      {t.completeLap} <Icon icon="ph:check" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-relaxed">
                    {t.saiComplete}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => setStage(4)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-white transition hover:bg-emerald-600"
                    >
                      {t.proceedToHalq} <Icon icon="ph:arrow-right" />
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {stage === 4 && (
            <>
              <div className="mb-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {t.stageHalq}
              </div>
              <div className="mb-3">
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{t.halqTitle}</div>
                <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">{t.halqDesc}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => {
                    setStage(1);
                    setTawafCircuit(1);
                    setSaiLap(1);
                  }}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-white transition hover:bg-emerald-600"
                >
                  {t.completeUmrah} <Icon icon="ph:check-circle" />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="absolute bottom-4 right-4 z-10 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white/80 backdrop-blur">
          {t.dragToRotate}
        </div>

        <Canvas camera={{ position: [10, 5, 10], fov: 50 }} className="flex-1">
          <OrbitControls 
            enablePan={false} 
            minDistance={5} 
            maxDistance={20}
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below floor
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          
          {stage === 2 && (
            <>
              <Marker 
                position={[1.6, 1.5, 1.6]} 
                title={t.hajrAlAswad} 
                description={t.hajrAlAswadDesc} 
              />
              <Marker 
                position={[1.6, 1.5, -1.6]} 
                title={t.ruknYamani} 
                description={t.ruknYamaniDesc} 
              />
              <Marker 
                position={[2.0, 0.5, 3.5]} 
                title={t.maqamIbrahim} 
                description={t.maqamIbrahimDesc} 
              />
              <Kaaba />
            </>
          )}

          {stage === 3 && <SafaMarwa />}

          <Floor />
        </Canvas>
      </div>
    </ToolShell>
  );
}
