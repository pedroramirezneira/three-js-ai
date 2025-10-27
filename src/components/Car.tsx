import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, forwardRef } from "react";
import * as THREE from "three";

const Car = forwardRef<THREE.Group, object>((_, ref) => {
  const carRef = useRef<THREE.Group>(null);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const velocity = 0.15;
  const rotationSpeed = 0.05;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) =>
      setKeys((k) => ({ ...k, [e.key]: true }));
    const handleKeyUp = (e: KeyboardEvent) =>
      setKeys((k) => ({ ...k, [e.key]: false }));

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const car = carRef.current;
    if (!car) return;

    if (keys["ArrowLeft"]) car.rotation.y += rotationSpeed;
    if (keys["ArrowRight"]) car.rotation.y -= rotationSpeed;

    const direction = new THREE.Vector3();
    car.getWorldDirection(direction);

    if (keys["ArrowUp"]) car.position.addScaledVector(direction, velocity);
    if (keys["ArrowDown"]) car.position.addScaledVector(direction, -velocity);
  });

  // Asignamos ref externo si existe
  if (typeof ref === "function") ref(carRef.current);
  else if (ref)
    (ref as React.MutableRefObject<THREE.Group | null>).current =
      carRef.current;

  return (
    <group ref={carRef} position={[0, 0.25, 0]}>
      {/* Car body */}
      <mesh castShadow>
        <boxGeometry args={[1, 0.4, 2]} />
        <meshStandardMaterial color="#ff4040" />
      </mesh>

      {/* Windows */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.9, 0.2, 1.4]} />
        <meshStandardMaterial color="#3fa9f5" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Wheels */}
      {[-0.45, 0.45].map((x) =>
        [-0.9, 0.9].map((z) => (
          <mesh
            key={`${x}-${z}`}
            position={[x, -0.2, z]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        ))
      )}
    </group>
  );
});

export default Car;
