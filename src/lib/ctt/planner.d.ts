import type { Standard } from "./catalog";
export interface Garment { id: string; name: string; standard: Standard; fabric: string; selected: string[] }
export function computePlan(items: Garment[], choices: Record<string, string>): {
  pending: { item: Garment; reason: string }[];
  batches: { key: string; colour: string; kind: string; maxTemp: number; cycle: number; items: string[] }[];
  total: number; ready: number;
};
