import type { Garment } from "@/lib/ctt/planner";
import { FABRICS, STANDARDS } from "@/lib/ctt/catalog";
import { normalizeSelection } from "@/lib/ctt/engine";

const KEY = "ctt-wardrobe-v6";
export const MAX_GARMENTS = 24;
const fabricIds = new Set(FABRICS.map((f) => f.id));

function normalizeGarment(value: unknown, index: number): Garment | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<Garment>;
  const name = typeof item.name === "string" ? item.name.trim().slice(0, 60) : "";
  if (!name) return null;
  const standard = item.standard === "us" ? "us" : "iso";
  return {
    id: typeof item.id === "string" && item.id ? item.id.slice(0, 100) : `recovered-${index}-${name.slice(0, 20)}`,
    name,
    standard,
    fabric: typeof item.fabric === "string" && fabricIds.has(item.fabric) ? item.fabric : "unknown",
    selected: normalizeSelection(item.selected, standard),
  };
}

export function loadWardrobe(): Garment[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(value)) return [];
    return value.slice(0, MAX_GARMENTS).map(normalizeGarment).filter((item): item is Garment => item !== null);
  } catch {
    return [];
  }
}

export function saveWardrobe(items: Garment[]): boolean {
  try {
    const normalized = items.slice(0, MAX_GARMENTS).map(normalizeGarment).filter((item): item is Garment => item !== null);
    localStorage.setItem(KEY, JSON.stringify(normalized));
    return true;
  } catch {
    return false;
  }
}

export function addToWardrobe(garment: Omit<Garment, "id">): Garment[] | null {
  const items = loadWardrobe();
  let id: string;
  try { id = crypto.randomUUID(); } catch { id = `garment-${Date.now()}`; }
  const next = [{ ...garment, id }, ...items].slice(0, MAX_GARMENTS);
  return saveWardrobe(next) ? next : null;
}
