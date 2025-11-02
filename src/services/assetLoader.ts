/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { PrefabDef } from "../types/types";

const manager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(manager);

// (Opcional) Draco si exportas con compresión
const draco = new DRACOLoader();
draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
gltfLoader.setDRACOLoader(draco);

// (Opcional) Meshopt si exportas con esa compresión
gltfLoader.setMeshoptDecoder(MeshoptDecoder);

const cache = new Map<string, THREE.Group>(); // instancia base
const defs = new Map<string, PrefabDef>(); // metadata

export async function preloadPrefabs(list: PrefabDef[]) {
  for (const def of list) {
    defs.set(def.name, def);
    const gltf = await gltfLoader.loadAsync(def.url);
    const base = gltf.scene as THREE.Group;
    if (def.scale) base.scale.setScalar(def.scale);
    cache.set(def.name, base);
  }
}

export function instantiatePrefab(name: string): THREE.Group {
  const base = cache.get(name);
  if (!base) throw new Error(`Prefab no precargado: ${name}`);

  const inst = skeletonClone(base) as THREE.Object3D;

  const meta = defs.get(name);
  if (meta?.yOffset) inst.position.y += meta.yOffset;

  inst.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      m.castShadow = true;
      m.receiveShadow = true;
    }
  });

  // Si ya es Group, devolvelo; si no, lo envolvemos en uno
  if ((inst as any).isGroup) {
    return inst as THREE.Group;
  } else {
    const g = new THREE.Group();
    g.add(inst);
    return g;
  }
}
