export type Standard = "iso" | "us";
export interface Glyph { type: string; mode?: string; temp?: number; bars?: number; dots?: number; heat?: string; shade?: boolean; modifier?: boolean; [k: string]: unknown }
export interface CareSymbol { id: string; standard: Standard; group: string; title: string; meaning: string; risk: string; glyph: Glyph }
export interface Step { id: string; label: string; short: string; number: string; caption: string }
export interface Fabric { id: string; title: string; hint: string }
export const STANDARDS: Record<Standard, { short: string; name: string; region: string; ironing: number[] }>;
export const STEPS: readonly Step[];
export const FABRICS: readonly Fabric[];
export const SYMBOLS: readonly CareSymbol[];
export const SYMBOL_BY_ID: Map<string, CareSymbol>;
export const sourceUrls: Record<string, string>;
export function getSymbols(standard: Standard, stepId: string): CareSymbol[];
export function getSteps(standard: Standard): Step[];
