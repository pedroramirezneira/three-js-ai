import * as THREE from "three";
import type { PartName, PartSpec } from "../types/types";

type PartFactory = (spec?: PartSpec) => THREE.Mesh;

const defaultMat = (spec?: PartSpec) =>
  new THREE.MeshStandardMaterial({
    color: spec?.material?.color ?? "#cccccc",
    metalness: spec?.material?.metalness ?? 0.1,
    roughness: spec?.material?.roughness ?? 0.8,
    emissive: spec?.material?.emissive ?? "#000000",
    transparent: spec?.material?.transparent ?? false,
    opacity: spec?.material?.opacity ?? 1,
  });

const applyTransform = (mesh: THREE.Object3D, spec?: PartSpec) => {
  const t = spec?.transform;
  if (t?.position) mesh.position.set(t.position.x, t.position.y, t.position.z);
  if (t?.rotation) mesh.rotation.set(t.rotation.x, t.rotation.y, t.rotation.z);
  if (t?.scale) mesh.scale.set(t.scale.x, t.scale.y, t.scale.z);
};

const factories: Record<PartName, PartFactory> = {
  box: (spec) => {
    const [x = 1, y = 1, z = 1] = spec?.geometryArgs ?? [];
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(x, y, z),
      defaultMat(spec)
    );
    applyTransform(mesh, spec);
    return mesh;
  },
  sphere: (spec) => {
    const [r = 0.5, wSeg = 16, hSeg = 12] = spec?.geometryArgs ?? [];
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(r, wSeg, hSeg),
      defaultMat(spec)
    );
    applyTransform(mesh, spec);
    return mesh;
  },
  cylinder: (spec) => {
    const [rt = 0.2, rb = 0.2, h = 1, seg = 16] = spec?.geometryArgs ?? [];
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(rt, rb, h, seg),
      defaultMat(spec)
    );
    applyTransform(mesh, spec);
    return mesh;
  },
  cone: (spec) => {
    const [r = 0.5, h = 1, seg = 16] = spec?.geometryArgs ?? [];
    const mesh = new THREE.Mesh(
      new THREE.ConeGeometry(r, h, seg),
      defaultMat(spec)
    );
    applyTransform(mesh, spec);
    return mesh;
  },
  torus: (spec) => {
    const [r = 0.4, tube = 0.15, radial = 12, tubular = 24] =
      spec?.geometryArgs ?? [];
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(r, tube, radial, tubular),
      defaultMat(spec)
    );
    applyTransform(mesh, spec);
    return mesh;
  },
  plane: (spec) => {
    const [w = 1, h = 1] = spec?.geometryArgs ?? [];
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      defaultMat(spec)
    );
    applyTransform(mesh, spec);
    return mesh;
  },
};

export function createPart(spec: PartSpec): THREE.Mesh {
  const fn = factories[spec.name];
  if (!fn) throw new Error(`Part not supported: ${spec.name}`);
  const mesh = fn(spec);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Utilidad para construir un ensamblaje
export function buildAssembly(parts: PartSpec[]): THREE.Group {
  const group = new THREE.Group();
  parts.forEach((p) => group.add(createPart(p)));
  return group;
}

// Lista que enviaremos al agente
export const partsAvailable: PartName[] = [
  "box",
  "sphere",
  "cylinder",
  "cone",
  "torus",
  "plane",
];
