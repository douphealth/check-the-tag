import type { CareSymbol, Standard } from "./catalog";
export interface Decoded {
  standard: Standard; selected: CareSymbol[]; count: number; sentence: string; fragments: string[];
  details: { group: string; label: string; text: string; symbolId: string | null }[];
  missing: string[]; risks: { title: string; message: string; level: string }[]; notices: string[];
  fibreNote: { title: string; message: string; source: string } | null; coverage: number; groups: Record<string, CareSymbol | undefined>;
}
export const MAX_SELECTIONS: number;
export function toggleSymbol(selection: string[], id: string, standard: Standard): string[];
export function decodeCare(ids: string[], standard: Standard, fabric: string): Decoded;
