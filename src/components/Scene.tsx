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
        setInstructions((prev) => [
          ...prev,
          ...[
            {
              type: "floor square",
              position: { x: -2.0, y: 0.0, z: -2.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor square",
              position: { x: 0.0, y: 0.0, z: -2.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor square",
              position: { x: 2.0, y: 0.0, z: -2.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor square",
              position: { x: -2.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor square",
              position: { x: 0.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor square",
              position: { x: 2.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor square",
              position: { x: -2.0, y: 0.0, z: 2.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor square",
              position: { x: 0.0, y: 0.0, z: 2.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor square",
              position: { x: 2.0, y: 0.0, z: 2.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },

            {
              type: "wall wood curved",
              position: { x: 0.0, y: 0.1, z: 5.5 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "wall wood curved",
              position: { x: 2.75, y: 0.1, z: 4.76 },
              rotation: { x: 0.0, y: 30.0, z: 0.0 },
            },
            {
              type: "wall wood window round",
              position: { x: 4.76, y: 0.1, z: 2.75 },
              rotation: { x: 0.0, y: 60.0, z: 0.0 },
            },
            {
              type: "wall wood curved",
              position: { x: 5.5, y: 0.1, z: 0.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "wall wood curved",
              position: { x: 4.76, y: 0.1, z: -2.75 },
              rotation: { x: 0.0, y: 120.0, z: 0.0 },
            },
            {
              type: "wall wood window round",
              position: { x: 2.75, y: 0.1, z: -4.76 },
              rotation: { x: 0.0, y: 150.0, z: 0.0 },
            },
            {
              type: "wall wood curved",
              position: { x: 0.0, y: 0.1, z: -5.5 },
              rotation: { x: 0.0, y: 180.0, z: 0.0 },
            },
            {
              type: "wall wood curved",
              position: { x: -2.75, y: 0.1, z: -4.76 },
              rotation: { x: 0.0, y: 210.0, z: 0.0 },
            },
            {
              type: "wall wood window round",
              position: { x: -4.76, y: 0.1, z: -2.75 },
              rotation: { x: 0.0, y: 240.0, z: 0.0 },
            },
            {
              type: "wall wood curved",
              position: { x: -5.5, y: 0.1, z: 0.0 },
              rotation: { x: 0.0, y: 270.0, z: 0.0 },
            },
            {
              type: "wall wood curved",
              position: { x: -4.76, y: 0.1, z: 2.75 },
              rotation: { x: 0.0, y: 300.0, z: 0.0 },
            },
            {
              type: "wall wood window round",
              position: { x: -2.75, y: 0.1, z: 4.76 },
              rotation: { x: 0.0, y: 330.0, z: 0.0 },
            },

            {
              type: "roof flat",
              position: { x: -2.0, y: 3.1, z: -2.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "roof flat",
              position: { x: 0.0, y: 3.1, z: -2.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "roof flat",
              position: { x: 2.0, y: 3.1, z: -2.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "roof flat",
              position: { x: -2.0, y: 3.1, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "roof flat",
              position: { x: 0.0, y: 3.1, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "roof flat",
              position: { x: 2.0, y: 3.1, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "roof flat",
              position: { x: -2.0, y: 3.1, z: 2.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "roof flat",
              position: { x: 0.0, y: 3.1, z: 2.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "roof flat",
              position: { x: 2.0, y: 3.1, z: 2.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },

            {
              type: "floor panel straight",
              position: { x: -1.5, y: 3.2, z: -1.5 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor panel straight",
              position: { x: 1.5, y: 3.2, z: -1.5 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor panel straight",
              position: { x: -1.5, y: 3.2, z: 1.5 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor panel straight",
              position: { x: 1.5, y: 3.2, z: 1.5 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },

            {
              type: "chair cushion",
              position: { x: -1.0, y: 0.1, z: 1.0 },
              rotation: { x: 0.0, y: 45.0, z: 0.0 },
            },
            {
              type: "chair cushion",
              position: { x: 1.0, y: 0.1, z: 1.0 },
              rotation: { x: 0.0, y: -45.0, z: 0.0 },
            },
            {
              type: "table",
              position: { x: 0.0, y: 0.1, z: 1.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "bench",
              position: { x: 0.0, y: 0.1, z: -2.0 },
              rotation: { x: 0.0, y: 180.0, z: 0.0 },
            },
            {
              type: "character a",
              position: { x: -0.5, y: 0.1, z: 1.2 },
              rotation: { x: 0.0, y: 60.0, z: 0.0 },
            },
            {
              type: "character b",
              position: { x: 0.5, y: 0.1, z: 0.8 },
              rotation: { x: 0.0, y: -60.0, z: 0.0 },
            },
            {
              type: "character c",
              position: { x: 0.0, y: 0.1, z: -1.8 },
              rotation: { x: 0.0, y: 180.0, z: 0.0 },
            },
            {
              type: "table",
              position: { x: -3.0, y: 0.1, z: -0.5 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "stall drinks",
              position: { x: -3.0, y: 0.1, z: -1.5 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "character d",
              position: { x: -2.8, y: 0.1, z: -0.7 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "character e",
              position: { x: -2.0, y: 0.1, z: -0.5 },
              rotation: { x: 0.0, y: -90.0, z: 0.0 },
            },

            {
              type: "tree",
              position: { x: -6.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "tree",
              position: { x: 6.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "tree",
              position: { x: 0.0, y: 0.0, z: -6.0 },
              rotation: { x: 0.0, y: 180.0, z: 0.0 },
            },
            {
              type: "tree",
              position: { x: 0.0, y: 0.0, z: 6.0 },
              rotation: { x: 0.0, y: 270.0, z: 0.0 },
            },
            {
              type: "flowers",
              position: { x: -4.0, y: 0.0, z: -4.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "flowers",
              position: { x: 4.0, y: 0.0, z: -4.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "flowers",
              position: { x: -4.0, y: 0.0, z: 4.0 },
              rotation: { x: 0.0, y: 180.0, z: 0.0 },
            },
            {
              type: "flowers",
              position: { x: 4.0, y: 0.0, z: 4.0 },
              rotation: { x: 0.0, y: 270.0, z: 0.0 },
            },

            {
              type: "vehicle convertible",
              position: { x: -12.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "column low",
              position: { x: -13.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor panel straight",
              position: { x: -13.0, y: 2.5, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "pipe",
              position: { x: -12.5, y: 1.0, z: -0.5 },
              rotation: { x: 0.0, y: 45.0, z: 90.0 },
            },
            {
              type: "vehicle convertible",
              position: { x: 12.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: -90.0, z: 0.0 },
            },
            {
              type: "column low",
              position: { x: 13.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor panel straight",
              position: { x: 13.0, y: 2.5, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "pipe",
              position: { x: 12.5, y: 1.0, z: 0.5 },
              rotation: { x: 0.0, y: -45.0, z: 90.0 },
            },
            {
              type: "vehicle convertible",
              position: { x: 0.0, y: 0.0, z: 12.0 },
              rotation: { x: 0.0, y: 180.0, z: 0.0 },
            },
            {
              type: "column low",
              position: { x: 0.0, y: 0.0, z: 13.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor panel straight",
              position: { x: 0.0, y: 2.5, z: 13.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "pipe",
              position: { x: 0.5, y: 1.0, z: 12.5 },
              rotation: { x: 90.0, y: 0.0, z: 0.0 },
            },
            {
              type: "vehicle convertible",
              position: { x: 0.0, y: 0.0, z: -12.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "column low",
              position: { x: 0.0, y: 0.0, z: -13.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "floor panel straight",
              position: { x: 0.0, y: 2.5, z: -13.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "pipe",
              position: { x: -0.5, y: 1.0, z: -12.5 },
              rotation: { x: 90.0, y: 0.0, z: 0.0 },
            },

            {
              type: "building a",
              position: { x: 30.0, y: 0.0, z: 35.0 },
              rotation: { x: 0.0, y: 45.0, z: 0.0 },
            },
            {
              type: "building b",
              position: { x: -35.0, y: 0.0, z: 30.0 },
              rotation: { x: 0.0, y: 135.0, z: 0.0 },
            },
            {
              type: "building c",
              position: { x: 25.0, y: 0.0, z: -40.0 },
              rotation: { x: 0.0, y: 225.0, z: 0.0 },
            },
            {
              type: "building d",
              position: { x: -40.0, y: 0.0, z: -25.0 },
              rotation: { x: 0.0, y: 315.0, z: 0.0 },
            },
            {
              type: "building skyscraper a",
              position: { x: 40.0, y: 0.0, z: 10.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "building skyscraper b",
              position: { x: -45.0, y: 0.0, z: 20.0 },
              rotation: { x: 0.0, y: 180.0, z: 0.0 },
            },
            {
              type: "building skyscraper c",
              position: { x: 10.0, y: 0.0, z: 40.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "building skyscraper d",
              position: { x: -20.0, y: 0.0, z: -45.0 },
              rotation: { x: 0.0, y: 270.0, z: 0.0 },
            },
            {
              type: "low detail building a",
              position: { x: 30.0, y: 0.0, z: -15.0 },
              rotation: { x: 0.0, y: 10.0, z: 0.0 },
            },
            {
              type: "low detail building b",
              position: { x: -30.0, y: 0.0, z: 15.0 },
              rotation: { x: 0.0, y: 100.0, z: 0.0 },
            },
            {
              type: "low detail building c",
              position: { x: 15.0, y: 0.0, z: -30.0 },
              rotation: { x: 0.0, y: 190.0, z: 0.0 },
            },
            {
              type: "low detail building d",
              position: { x: -15.0, y: 0.0, z: 30.0 },
              rotation: { x: 0.0, y: 280.0, z: 0.0 },
            },

            {
              type: "tree large",
              position: { x: 20.0, y: 0.0, z: 20.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "tree",
              position: { x: -25.0, y: 0.0, z: 20.0 },
              rotation: { x: 0.0, y: 60.0, z: 0.0 },
            },
            {
              type: "tree high round",
              position: { x: 20.0, y: 0.0, z: -25.0 },
              rotation: { x: 0.0, y: 120.0, z: 0.0 },
            },
            {
              type: "tree",
              position: { x: -20.0, y: 0.0, z: -20.0 },
              rotation: { x: 0.0, y: 180.0, z: 0.0 },
            },
            {
              type: "tree large",
              position: { x: 30.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 240.0, z: 0.0 },
            },
            {
              type: "tree",
              position: { x: -30.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 300.0, z: 0.0 },
            },
            {
              type: "tree high",
              position: { x: 0.0, y: 0.0, z: 30.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "tree",
              position: { x: 0.0, y: 0.0, z: -30.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "tree large",
              position: { x: 10.0, y: 0.0, z: 25.0 },
              rotation: { x: 0.0, y: 15.0, z: 0.0 },
            },
            {
              type: "tree",
              position: { x: -10.0, y: 0.0, z: -25.0 },
              rotation: { x: 0.0, y: 195.0, z: 0.0 },
            },

            {
              type: "road straight",
              position: { x: 0.0, y: 0.0, z: 20.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "road straight",
              position: { x: 0.0, y: 0.0, z: 24.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "road straight",
              position: { x: 0.0, y: 0.0, z: 28.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "road straight",
              position: { x: 20.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "road straight",
              position: { x: 24.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "road straight",
              position: { x: 28.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "road straight",
              position: { x: 0.0, y: 0.0, z: -20.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "road straight",
              position: { x: 0.0, y: 0.0, z: -24.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "road straight",
              position: { x: 0.0, y: 0.0, z: -28.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "road straight",
              position: { x: -20.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "road straight",
              position: { x: -24.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "road straight",
              position: { x: -28.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "road crossing",
              position: { x: 0.0, y: 0.0, z: 30.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "road crossing",
              position: { x: 30.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
            {
              type: "road crossing",
              position: { x: 0.0, y: 0.0, z: -30.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              type: "road crossing",
              position: { x: -30.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 90.0, z: 0.0 },
            },
          ],
        ]);
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
