import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Person from "./Person";
import CameraFollow from "./CameraFollow";
import { sendToN8n } from "../services/sendToN8n";
import { prefabs, preloadAllPrefabs } from "./Prefabs";
import Chat from "./Chat";
import { buildAssembly } from "./Parts";
import type { BuildInstruction } from "../types/types";

function Spawner({ instructions }: { instructions: BuildInstruction[] }) {
  const groupRef = useRef<THREE.Group>(null);
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.clear();

    instructions.forEach((instr) => {
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
      if ("type" in instr) {
        const prefab = prefabs.find((p) => p.name === instr.type);
        if (prefab) {
          const obj = prefab.create();
          obj.position.set(instr.position.x, 0, instr.position.z);
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
  useEffect(() => {
    preloadAllPrefabs()
      .then(() => {
        setInitialized(true);
      })
      .catch(console.error);
  }, []);

  const playerRef = useRef<THREE.Group>(null);
  const [instructions, setInstructions] = useState<BuildInstruction[]>([]);
  const [initialized, setInitialized] = useState(false);

  const handleSend = async (message: string) => {
    if (!playerRef.current) return;
    const p = playerRef.current.position;
    const newInstructions = await sendToN8n(message, {
      x: p.x,
      y: p.y,
      z: p.z,
    });
    setInstructions((prev) => [...prev, ...newInstructions]);
  };

  return (
    <>
      <Canvas shadows camera={{ position: [0, 14, 15], rotateZ: 45, fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />

        <Suspense fallback={null}>
          {initialized && (
            <>
              <Person ref={playerRef} />
              <CameraFollow
                targetRef={playerRef}
                height={14}
                offsetZ={15}
                smooth={0.15}
                pitchDeg={-45}
                yawDeg={0}
              />
            </>
          )}
          {/* Cámara fija en rotación (top-down), solo sigue la posición */}

          <Spawner instructions={instructions} />
        </Suspense>

        {/* Piso circular */}
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[50, 128]} />
          <meshStandardMaterial color={"#7ac36a"} />
        </mesh>
      </Canvas>

      <Chat onSend={handleSend} />
    </>
  );
}
