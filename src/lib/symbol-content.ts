import { SYMBOLS, STANDARDS, type CareSymbol } from "@/lib/ctt/catalog";
import { GROUP_LABEL } from "@/lib/groups";

/** Long-form symbol copy derived from catalog glyph fields only. */
export type QA = { q: string; a: string };

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
const barsTxt = (b?: number) => (b === 1 ? " One bar underneath means a mild process (reduced agitation and spin)." : b === 2 ? " Two bars underneath mean a very mild process (minimal agitation)." : "");

export function howToRead(s: CareSymbol): string {
  const g = s.glyph as CareSymbol["glyph"] & { letter?: string; ambient?: boolean; fill?: boolean; steamOnly?: boolean };
  const iso = s.standard === "iso";
  switch (g.type) {
    case "wash":
      if (g.mode === "none") return "A washtub crossed out.";
      if (g.mode === "hand") return `A washtub with a hand in the water${g.temp ? `, marked ${g.temp}°C` : ""}.`;
      return `A washtub${g.dots ? ` with ${plural(g.dots, "dot")} (US labels use dots for temperature; here up to about ${g.temp}°C)` : g.temp ? ` with ${g.temp}°C written inside` : ""}.${barsTxt(g.bars)}`;
    case "bleach":
      return g.mode === "none" ? "A triangle crossed out." : g.mode === "oxygen" ? "A triangle with two diagonal lines inside." : "An empty triangle.";
    case "tumble":
      if (g.heat === "none") return "A square with a circle inside, crossed out.";
      if (g.fill) return "A square with a filled (black) circle inside, meaning tumble dry without heat.";
      return `A square with a circle inside${g.dots ? ` containing ${plural(g.dots, "dot")} for the heat level` : g.heat === "any" ? " and no dots, meaning any heat" : ""}.${barsTxt(g.bars)}`;
    case "natural": {
      const iso_ = { line: "one vertical line", "drip-line": "two vertical lines", flat: "one horizontal line", "drip-flat": "two horizontal lines" } as Record<string, string>;
      const us_ = { line: "a curved line along the top", "drip-line": "three vertical lines", flat: "one horizontal line" } as Record<string, string>;
      const inner = (iso ? iso_ : us_)[g.mode ?? ""];
      return `A square (natural drying)${inner ? ` with ${inner} inside` : ""}${g.shade ? (iso ? ", plus a diagonal line in the top-left corner for drying in shade" : ", plus a shade marker in the corner") : ""}.`;
    }
    case "iron":
      if (g.mode === "none") return "An iron crossed out.";
      if (g.mode === "no-steam") return `An iron with crossed-out steam lines underneath${g.dots ? ` and ${plural(g.dots, "dot")}` : ""}.`;
      return `An iron with ${plural(g.dots ?? 0, "dot")}, meaning a maximum soleplate temperature of about ${g.temp}°C.`;
    case "dryclean":
      if (g.mode === "none") return "A circle crossed out.";
      return `A circle with the letter ${g.letter} inside.${barsTxt(g.bars)}`;
    case "wetclean":
      if (g.mode === "none") return "A circle with the letter W, crossed out.";
      return `A circle with the letter W inside, for professional wet cleaning.${barsTxt(g.bars)}`;
    default:
      return `A ${GROUP_LABEL[s.group]?.toLowerCase() ?? "care"} mark: ${s.title}.`;
  }
}

const LETTER: Record<string, string> = {
  P: "P means the cleaner may use perchloroethylene or hydrocarbon solvents.",
  F: "F means hydrocarbon solvents only.",
  A: "A means any dry-cleaning solvent may be used.",
};

export const GROUP_TIPS: Record<string, string[]> = {
  wash: ["The temperature is a maximum: washing cooler is always within the label.", "Bars under the tub ask for a gentler cycle, so pick a synthetics or delicates programme.", "Wash with similar colours and close zips to reduce abrasion."],
  bleach: ["Bleach is never required by the label; it only says what is tolerated.", "Oxygen bleach is usually sold as colour-safe or non-chlorine.", "Test any bleach on a hidden seam first."],
  tumble: ["Dots show the maximum dryer heat; a lower setting is always acceptable.", "Remove items promptly to reduce creasing and heat exposure.", "If tumbling is banned, follow the natural-drying mark instead."],
  natural: ["Drying in shade protects bright and dark colours from sun fading.", "Flat drying is common for knitwear so it keeps its shape.", "Drip drying means skipping the spin cycle and hanging the item wet."],
  iron: ["Dots show the maximum soleplate temperature; start lower on a hidden area.", "A pressing cloth or ironing inside out reduces shine on dark fabrics.", "Mixed-fibre garments should be ironed at the setting for the most delicate fibre."],
  dryclean: ["These marks are instructions for professional cleaners, not for home washing.", "Show the label to your cleaner so they choose the right solvent and process.", "A crossed-out circle rules out dry cleaning entirely."],
  wetclean: ["Professional wet cleaning uses water with specialist equipment and detergents.", "It is not the same as home washing; follow the washtub symbol for that.", "Show the label to your cleaner before treatment."],
  extras: ["Extra warnings sit alongside the main symbols and override general habits.", "Read them together with the wash and drying marks on the same label."],
};

export function counterpart(s: CareSymbol): CareSymbol | undefined {
  const other = SYMBOLS.filter((x) => x.standard !== s.standard && x.group === s.group);
  type G = { mode?: unknown; temp?: unknown; heat?: unknown; letter?: unknown; bars?: unknown };
  const g = s.glyph as G;
  return other.find((x) => x.title === s.title)
    ?? other.find((x) => { const o = x.glyph as G; return o.mode === g.mode && o.temp === g.temp && o.heat === g.heat && o.letter === g.letter && (o.bars ?? 0) === (g.bars ?? 0); });
}

export function symbolAnswer(s: CareSymbol) {
  return `${s.meaning} On a ${STANDARDS[s.standard].short === "United States" ? "US" : "international (ISO)"} care label it appears as: ${howToRead(s).replace(/^A /, "a ").replace(/^An /, "an ")}`;
}

export function symbolFaq(s: CareSymbol): QA[] {
  const g = s.glyph as CareSymbol["glyph"] & { letter?: string };
  const c = counterpart(s);
  const std = STANDARDS[s.standard];
  const out: QA[] = [
    { q: `What does the "${s.title}" laundry symbol mean?`, a: s.meaning },
    { q: `What does the ${s.title.toLowerCase()} symbol look like?`, a: howToRead(s) },
  ];
  if (s.risk) out.push({ q: `What happens if I ignore this symbol?`, a: s.risk });
  if (g.type === "wash" && g.temp && g.mode !== "none") out.push({ q: `Can I wash it colder than ${g.temp}°C?`, a: `Yes. The ${g.temp}°C figure is a maximum, so any cooler setting is within the label. Use a cycle at least as gentle as the one shown.` });
  if (g.type === "iron" && g.temp) out.push({ q: `What iron setting matches ${plural(g.dots ?? 0, "dot")}?`, a: `Under ${std.name}, ${plural(g.dots ?? 0, "dot")} means a maximum soleplate temperature of about ${g.temp}°C. The ${std.short} scale is ${std.ironing.join(" / ")}°C for one, two and three dots.` });
  if ((g.type === "dryclean") && g.letter && LETTER[g.letter]) out.push({ q: `What does the letter ${g.letter} in the circle mean?`, a: `${LETTER[g.letter]} It is an instruction for professional cleaners.` });
  out.push({ q: `Is this symbol the same on ${s.standard === "iso" ? "US" : "European and international"} labels?`, a: c ? `The closest ${STANDARDS[c.standard].short} mark is "${c.title}": ${c.meaning}` : `There is no direct equivalent in the ${s.standard === "iso" ? "US (FTC / ASTM)" : "ISO 3758"} system in our catalogue, so read the full label and any written instructions.` });
  out.push({ q: `Which standard defines this symbol?`, a: s.standard === "iso" ? `${std.name}, used on ${std.region.toLowerCase()} in Europe and most of the world. Each ISO symbol shows the most severe treatment the article tolerates.` : `${std.name}. US care labels follow the FTC Care Labeling Rule, which accepts these ASTM symbols in place of written instructions.` });
  return out;
}
