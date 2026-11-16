import type { Garment } from "@/lib/ctt/planner";

const KEY = "ctt-wardrobe-v6";
export const MAX_GARMENTS = 24;

export function loadWardrobe(): Garment[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? (v as Garment[]).slice(0, MAX_GARMENTS) : [];
  } catch {
    return [];
  }
}
export function saveWardrobe(items: Garment[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_GARMENTS)));
}
export function addToWardrobe(g: Omit<Garment, "id">): Garment[] {
  const items = loadWardrobe();
  const next = [{ ...g, id: crypto.randomUUID() }, ...items].slice(0, MAX_GARMENTS);
  saveWardrobe(next);
  return next;
}
