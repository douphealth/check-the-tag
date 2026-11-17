import { useMemo } from "react";
import { iconSvg } from "@/lib/ctt/icons";
import type { CareSymbol } from "@/lib/ctt/catalog";
import { cn } from "@/lib/utils";

export function SymbolIcon({ symbol, className }: { symbol: CareSymbol; className?: string }) {
  const html = useMemo(() => iconSvg(symbol), [symbol]);
  return <span aria-hidden="true" className={cn("symbol-svg block pointer-events-none", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
