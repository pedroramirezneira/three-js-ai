import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, forwardRef } from "react";
import * as THREE from "three";
import { instantiatePrefab } from "../services/assetLoader";
import { prefabDefs } from "./Prefabs"; // ajusta la ruta si difiere

const RADIUS = 50;
const SPEED = 6; // m/s aprox
const Y = 0; // asumimos origen del GLB en los pies; ajustá si hace falta

type KeysState = Record<string, boolean>;

const Person = forwardRef<THREE.Group, object>((_, ref) => {
  const rootRef = useRef<THREE.Group>(null);
  const [keys, setKeys] = useState<KeysState>({});

  // Instanciar el modelo character-a.glb desde tus prefabDefs
  useEffect(() => {
    if (!rootRef.current) return;

    // OJO: si tu generador convierte "character-a" -> "character a", resolvemos por URL
    const def =
      prefabDefs.find((d) =>
        d.url.endsWith("/models/characters/character-a.glb")
      ) ??
      prefabDefs.find(
        (d) => d.name === "character-a" || d.name === "character a"
      );

    const model = def ? instantiatePrefab(def.name) : null;

    if (model) {
      // reseteá transform locales por si vienen con offset
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, 0);
      rootRef.current.add(model);
    } else {
      // Fallback súper liviano si no se encontró el GLB
      const fallback = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.25, 0.7, 8, 16),
        new THREE.MeshStandardMaterial({ color: "#f15a24", roughness: 0.8 })
      );
      rootRef.current.add(fallback);
    }
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) =>
      setKeys((k) => ({ ...k, [e.key]: true }));
    const up = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.key]: false }));
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    const g = rootRef.current;
    if (!g) return;

    // ↑↓←→ mueven en el plano del mundo (sin rotación previa)
    const dir = new THREE.Vector3(
      (keys["ArrowRight"] ? 1 : 0) + (keys["ArrowLeft"] ? -1 : 0),
      0,
      (keys["ArrowDown"] ? 1 : 0) + (keys["ArrowUp"] ? -1 : 0)
    );

    if (dir.lengthSq() > 0) {
      dir.normalize();
      const step = SPEED * delta;
      const next = g.position.clone().addScaledVector(dir, step);

      // clamp dentro del círculo jugable
      const maxR = RADIUS - 0.5;
      const r = Math.hypot(next.x, next.z);
      if (r > maxR) {
        const s = maxR / r;
        next.x *= s;
        next.z *= s;
      }
      next.y = Y;
      g.position.copy(next);

      // rotar el modelo hacia la dirección de marcha
      g.rotation.y = Math.atan2(dir.x, dir.z);
    }
  });

  // Exponer ref externo
  if (typeof ref === "function") ref(rootRef.current);
  else if (ref)
    (ref as React.MutableRefObject<THREE.Group | null>).current =
      rootRef.current;

  return <group ref={rootRef} position={[0, Y, 0]} />;
});

export default Person;
