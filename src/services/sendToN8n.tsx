import { prefabs } from "../components/Prefabs";
import { partsAvailable } from "../components/Parts";
import type { BuildInstruction } from "../types/types";

export async function sendToN8n(
  prompt: string,
  carPos: { x: number; y: number; z: number }
) {
  const requestBody = {
    prompt,
    carPosition: carPos,
    prefabsAvailable: prefabs.map((p) => p.name), // retrocompat
    partsAvailable, // NUEVO
    bounds: { xMin: -50, xMax: 50, zMin: -50, zMax: 50 },
    maxObjects: 50, // NUEVO
    version: "v2", // NUEVO
  };

  const res = await fetch(
    "https://paws-n8n.a97qaz.easypanel.host/webhook/2311fc57-4e9f-430f-b147-5013da4d42ea",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    }
  );

  const data: BuildInstruction[] = await res.json();
  return data;
}
