// v1 (prefabs) sigue funcionando
export interface SpawnInstructionV1 {
  type: string;
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
}

// v2 (partes/ensamblajes)
export type PartName =
  | "box"
  | "sphere"
  | "cylinder"
  | "cone"
  | "torus"
  | "plane";

export interface PartSpec {
  name: PartName;
  transform?: {
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
  };
  material?: {
    color?: string;
    metalness?: number;
    roughness?: number;
    emissive?: string;
    transparent?: boolean;
    opacity?: number;
  };
  geometryArgs?: number[]; // args específicos por tipo (ej: [radiusTop, radiusBottom, height, radialSegments] para cylinder)
}

export interface AssemblyInstructionV2 {
  kind: "assembly";
  position: { x: number; y: number; z: number }; // posición base del grupo
  parts: PartSpec[]; // cada parte con transform relativas al grupo
}

// Unión que acepta ambas versiones
export type BuildInstruction = SpawnInstructionV1 | AssemblyInstructionV2;

export type PrefabDef = {
  name: string;
  url: string;
  yOffset?: number;
  scale?: number;
};
