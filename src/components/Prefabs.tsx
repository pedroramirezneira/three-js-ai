import * as THREE from "three";
import {
  instantiatePrefab,
  preloadPrefabs,
  type PrefabDef,
} from "../services/assetLoader";

// Importa automáticamente todos los modelos GLB de src/models (recursivo)
const modules = import.meta.glob("../models/**/*.glb", {
  eager: true,
  as: "url",
});

// Utilidad: obtiene el nombre legible desde el path
function toNameFromPath(path: string) {
  const file = path.split("/").pop()!.replace(".glb", "");
  return file.replace(/[_-]/g, " ").trim();
}

// 🔸 Función para asignar escala condicional
function getScaleForPath(path: string): number {
  if (path.includes("/characters/")) return 0.5; // 👈 si está dentro de la carpeta "characters"
  return 1; // valor por defecto
}

// Genera automáticamente los defs
export const prefabDefs: PrefabDef[] = Object.entries(modules).map(
  ([path, url]) => ({
    name: toNameFromPath(path),
    url: String(url).replace(/^\.\./, ""), // Limpia prefijo relativo
    scale: getScaleForPath(path), // Usa la escala condicional
  })
);

// Tipo y mapeo de prefabs a función de instanciación
export type FilePrefab = { name: string; create: () => THREE.Group };

export const prefabs: FilePrefab[] = prefabDefs.map((d) => ({
  name: d.name,
  create: () => instantiatePrefab(d.name),
}));

// Precarga todos los modelos una sola vez
export async function preloadAllPrefabs() {
  await preloadPrefabs(prefabDefs);
}
