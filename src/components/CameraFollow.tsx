import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

interface Props {
  targetRef: React.RefObject<THREE.Object3D | null>;
  height?: number; // altura sobre el personaje
  offsetZ?: number; // opcional: pequeño desplazamiento hacia atrás (mundo)
  smooth?: number; // factor de lerp por frame
  yawDeg?: number; // yaw fijo en grados (0 = alineado al mundo X/Z)
  pitchDeg?: number; // pitch fijo (por defecto -90 = cenital puro)
}

export default function CameraFollow({
  targetRef,
  height = 14,
  offsetZ = 0,
  smooth = 0.15,
  yawDeg = 0,
  pitchDeg = -90,
}: Props) {
  const { camera } = useThree();
  const desired = useRef(new THREE.Vector3());
  const fixedQuat = useRef(new THREE.Quaternion());

  useEffect(() => {
    // rotación fija precomputada
    const yaw = THREE.MathUtils.degToRad(yawDeg);
    const pitch = THREE.MathUtils.degToRad(pitchDeg); // -90° = mira hacia abajo
    const euler = new THREE.Euler(pitch, yaw, 0, "YXZ");
    fixedQuat.current.setFromEuler(euler);
  }, [yawDeg, pitchDeg]);

  useFrame(() => {
    const t = targetRef.current;
    if (!t) return;

    desired.current.set(
      t.position.x,
      t.position.y + height,
      t.position.z + offsetZ
    );
    camera.position.lerp(desired.current, smooth);

    // NO lookAt: mantener orientación fija
    camera.quaternion.slerp(fixedQuat.current, 0.3);
  });

  return null;
}
