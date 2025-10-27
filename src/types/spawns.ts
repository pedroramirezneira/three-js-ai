// Lo que le enviamos a n8n
export interface SpawnRequest {
  prompt: string; // Texto del usuario
  carPosition: { x: number; y: number; z: number }; // Posición actual del auto
  prefabsAvailable: string[]; // Lista de tipos que el agente puede spawnear
  bounds: {
    // Limites de la escena para spawneo
    xMin: number;
    xMax: number;
    zMin: number;
    zMax: number;
  };
}

// Lo que recibimos de n8n
export interface SpawnInstruction {
  type: string; // Nombre del prefab
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
}
