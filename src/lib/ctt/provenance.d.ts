import type { CareSymbol, Standard } from "./catalog";
export interface SourceReference { name: string; edition: string; authority: string; url: string; note: string }
export const LAST_REVIEWED: string;
export const SOURCES: Record<string, SourceReference>;
export function referencesFor(standard: Standard, fabric?: string): (SourceReference & { id: string })[];
export function referenceForSymbol(symbol: CareSymbol): SourceReference;
export function reviewAgeDays(now?: Date): number;
