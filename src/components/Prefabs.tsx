import * as THREE from "three";
import {
  instantiatePrefab,
  preloadPrefabs,
  type PrefabDef,
} from "../services/assetLoader";

export type FilePrefab = { name: string; create: () => THREE.Group };

export const prefabDefs: PrefabDef[] = [
  { name: "árbol", url: "/models/arbol.glb", scale: 0.035 },
  { name: "roca", url: "/models/roca.glb", scale: 0.5 },
  { name: "arbusto", url: "/models/arbusto.glb", scale: 0.005 },
  { name: "cactus", url: "/models/cactus.glb", scale: 10 },
  { name: "caja", url: "/models/caja.glb" },
  { name: "barril", url: "/models/barril.glb", scale: 0.25, yOffset: 1 },
  { name: "farol", url: "/models/farol.glb" },
  { name: "piedra plana", url: "/models/piedra_plana.glb", scale: 0.5 },
  { name: "señal", url: "/models/senal.glb", scale: 2 },
  { name: "cochecito", url: "/models/cochecito.glb", scale: 0.5 },
  { name: "person_1", url: "/models/person_1.glb", scale: 50 },
  { name: "person_2", url: "/models/person_2.glb", scale: 0.02 },
  { name: "person_3", url: "/models/person_3.glb" },
] as const;

export const prefabs: FilePrefab[] = prefabDefs.map((d) => ({
  name: d.name,
  create: () => instantiatePrefab(d.name),
}));

// Llama esto una sola vez al inicio de la app:
export async function preloadAllPrefabs() {
  await preloadPrefabs(
    prefabDefs as unknown as { name: string; url: string }[]
  );
}
