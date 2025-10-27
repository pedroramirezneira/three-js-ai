import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type Props = {
  targetRef: React.RefObject<THREE.Object3D | null>;
};

export default function CameraFollow({ targetRef }: Props) {
  const { camera } = useThree();
  const offset = useRef(new THREE.Vector3(0, 8, -10)); // altura y distancia
  const smoothPosition = useRef(new THREE.Vector3());

  useFrame(() => {
    const target = targetRef?.current;
    if (!target) return;

    const targetPos = target.position.clone();
    const desiredPos = targetPos.clone().add(offset.current);

    smoothPosition.current.lerp(desiredPos, 0.1);
    camera.position.copy(smoothPosition.current);
    camera.lookAt(targetPos.x, targetPos.y + 1, targetPos.z);
  });

  return null;
}
