import type { CareSymbol, Standard } from "./catalog";
export type CategoryId = "wash" | "bleach" | "dry" | "iron" | "professional";
export type CategoryState = "absent" | "unreadable";
export type CategoryStates = Partial<Record<CategoryId, CategoryState>>;
export interface Decoded {
  standard: Standard; selected: CareSymbol[]; count: number; sentence: string; fragments: string[];
  details: { group: string; label: string; text: string; symbolId: string | null }[];
  missing: CategoryId[]; provided: CategoryId[]; absent: CategoryId[]; unreadable: CategoryId[];
  states: Record<CategoryId, CategoryState | "provided" | "unknown">;
  risks: { title: string; message: string; level: string }[]; notices: string[];
  fibreNote: { title: string; message: string; source: string } | null; coverage: number; groups: Record<string, CareSymbol | undefined>;
}
export const MAX_SELECTIONS: number;
export const CARE_CATEGORIES: readonly { id: CategoryId; label: string; groups: string[] }[];
export function normalizeCategoryStates(value: unknown): CategoryStates;
export function normalizeSelection(value: unknown, standard?: Standard): string[];
export function toggleSymbol(selection: string[], id: string, standard: Standard): string[];
export function decodeCare(ids: string[], standard: Standard, fabric: string, categoryStates?: CategoryStates): Decoded;
export function serializeShare(ids: string[], standard: Standard, fabric: string, categoryStates?: CategoryStates): URLSearchParams;
export function parseShare(search: string): { standard: Standard; fabric: string; selected: string[]; states: CategoryStates; demo: boolean } | null;
