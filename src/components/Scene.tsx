import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Car from "./Car";
import CameraFollow from "./CameraFollow";
import { sendToN8n } from "../services/sendToN8n";
import { prefabs } from "./Prefabs";
import Chat from "./Chat";

interface SpawnInstruction {
  type: string;
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
}

// Componente que agrega objetos a la escena
function Spawner({ instructions }: { instructions: SpawnInstruction[] }) {
  const { scene } = useThree();

  useEffect(() => {
    instructions.forEach((instr) => {
      const prefab = prefabs.find((p) => p.name === instr.type);
      if (prefab) {
        const obj = prefab.create();
        obj.position.set(instr.position.x, instr.position.y, instr.position.z);
        if (instr.rotation)
          obj.rotation.set(
            instr.rotation.x,
            instr.rotation.y,
            instr.rotation.z
          );
        scene.add(obj);
      }
    });
  }, [instructions, scene]);

  return null;
}

export default function Scene() {
  const carRef = useRef<THREE.Group>(null);
  const [instructions, setInstructions] = useState<SpawnInstruction[]>([]);

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
