import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Car from "./Car";
import CameraFollow from "./CameraFollow";
import { sendToN8n } from "../services/sendToN8n";
import { prefabs } from "./Prefabs";
import Chat from "./Chat";
import { buildAssembly } from "./Parts";
import type { BuildInstruction } from "../types/types";

// Componente que agrega objetos a la escena
function Spawner({ instructions }: { instructions: BuildInstruction[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    // Limpia y vuelve a montar (simple y seguro)
    groupRef.current.clear();

    instructions.forEach((instr) => {
      // v2: ensamblajes con partes
      if ("kind" in instr && instr.kind === "assembly") {
        const group = buildAssembly(instr.parts);
        group.position.set(
          instr.position.x,
          instr.position.y,
          instr.position.z
        );
        groupRef.current!.add(group);
        return;
      }
      // v1: prefabs clásicos
      if ("type" in instr) {
        const prefab = prefabs.find((p) => p.name === instr.type);
        if (prefab) {
          const obj = prefab.create();
          obj.position.set(
            instr.position.x,
            instr.position.y,
            instr.position.z
          );
          if ("rotation" in instr && instr.rotation)
            obj.rotation.set(
              instr.rotation.x,
              instr.rotation.y,
              instr.rotation.z
            );
          groupRef.current!.add(obj);
        }
      }
    });
  }, [instructions]);

  return <group ref={groupRef} />;
}

export default function Scene() {
  const carRef = useRef<THREE.Group>(null);
  const [instructions, setInstructions] = useState<BuildInstruction[]>([]);

  const handleSend = async (message: string) => {
    if (!carRef.current) return;

    const carPos = carRef.current.position;
    const newInstructions = await sendToN8n(message, {
      x: carPos.x,
      y: carPos.y,
      z: carPos.z,
    });

    setInstructions((prev) => [...prev, ...newInstructions]);
  };

  return (
    <>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />

        <Suspense fallback={null}>
          <Car ref={carRef} />
          <CameraFollow targetRef={carRef} />
          <Spawner instructions={instructions} />
        </Suspense>

        {/* Piso */}
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color={"#7ac36a"} />
        </mesh>
      </Canvas>

      <Chat onSend={handleSend} />
    </>
  );
}
