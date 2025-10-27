import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import Car from "./Car";
import CameraFollow from "./CameraFollow";

export default function Scene() {
  const carRef = useRef<THREE.Group>(null);

  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />

      <Suspense fallback={null}>
        <Car ref={carRef} />
        <CameraFollow targetRef={carRef} />
      </Suspense>

      {/* Piso */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={"#7ac36a"} />
      </mesh>
    </Canvas>
  );
}
