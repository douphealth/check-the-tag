import type { Pick } from "@/components/AmazonPicks";
import type { CareSymbol } from "@/lib/ctt/catalog";

/** Product categories that follow directly from what a care symbol or fabric guide allows. */
const P = {
  detergent: { label: "Everyday laundry detergent", query: "laundry detergent", why: "For regular cycles at the temperature this label allows." },
  catcher: { label: "Colour catcher sheets", query: "color catcher sheets", why: "Help reduce dye transfer in mixed-colour loads." },
  delicate: { label: "Delicate laundry detergent", query: "delicate laundry detergent", why: "Gentler formula for mild and very mild cycles or hand washing." },
  wool: { label: "Wool and cashmere wash", query: "wool cashmere wash detergent", why: "pH-neutral wash made for protein fibres like wool and cashmere." },
  silk: { label: "Silk and delicates wash", query: "silk delicate wash detergent", why: "Mild wash for silk. Check the product says it is silk-safe." },
  sport: { label: "Sports laundry detergent", query: "sports laundry detergent", why: "Made for synthetic activewear at lower temperatures." },
  mesh: { label: "Mesh laundry bags", query: "mesh laundry bags", why: "Protect delicates and reduce snagging on gentle cycles." },
  oxygen: { label: "Oxygen (colour-safe) bleach", query: "oxygen bleach powder", why: "Non-chlorine bleach, the type this label permits." },
  enzyme: { label: "Bleach-free stain remover", query: "enzyme stain remover", why: "Treat stains without any bleach. Test on a hidden seam first." },
  balls: { label: "Wool dryer balls", query: "wool dryer balls", why: "Reusable alternative to dryer sheets for tumble drying." },
  rack: { label: "Clothes drying rack", query: "clothes drying rack", why: "For items that must not go in the tumble dryer." },
  flatRack: { label: "Flat sweater drying rack", query: "sweater drying rack flat", why: "Mesh rack for drying knitwear flat so it keeps its shape." },
  iron: { label: "Steam iron with temperature dial", query: "steam iron", why: "Pick a model whose settings match the dots on your labels." },
  cloth: { label: "Pressing cloth", query: "pressing cloth ironing", why: "Protects dark and delicate fabrics from shine." },
  spray: { label: "Wrinkle release spray", query: "wrinkle release spray", why: "Smooths creases without an iron. Test on a hidden area first." },
  bag: { label: "Breathable garment bag", query: "breathable garment bag", why: "Stores professionally cleaned items without trapping moisture." },
  steamer: { label: "Handheld garment steamer", query: "handheld garment steamer", why: "Refreshes items between professional cleans. Check the label first." },
  softBrush: { label: "Soft-bristle cleaning brush", query: "soft bristle cleaning brush", why: "Lifts dirt from fabric without roughing up the surface." },
  capShaper: { label: "Cap shaper or drying form", query: "baseball cap shaper drying form", why: "Holds a cap's shape while it air-dries." },
  pillowProtector: { label: "Zippered pillow protectors", query: "zippered pillow protectors", why: "Keeps the pillow itself cleaner so it needs washing less often." },
  wbCover: { label: "Removable weighted-blanket cover", query: "weighted blanket duvet cover", why: "A washable cover means the heavy insert rarely needs washing." },
  downWash: { label: "Down wash detergent", query: "down wash detergent", why: "Cleans down without stripping the natural oils that give it loft." },
  shoeKit: { label: "Sneaker cleaning kit", query: "sneaker cleaning kit", why: "Brush and cleaner for scrubbing uppers and soles by hand." },
  leatherCare: { label: "Leather cleaner and conditioner", query: "leather jacket cleaner and conditioner", why: "Made for clothing leather. Test on a hidden spot first." },
  storageSack: { label: "Sleeping bag storage sack", query: "sleeping bag storage sack", why: "Stores the bag loosely so the fill keeps its loft." },
  matCleaner: { label: "Yoga mat cleaner", query: "yoga mat cleaner spray", why: "Check it is suitable for your mat's material first." },
  dogBedCover: { label: "Waterproof dog bed cover", query: "waterproof dog bed cover washable", why: "A washable cover protects the insert from accidents." },
  mfWash: { label: "Microfiber detergent", query: "microfiber detergent", why: "Residue-free wash that keeps microfiber fibres open. No softener." },
  showerLiner: { label: "Washable fabric shower liner", query: "washable fabric shower curtain liner", why: "A machine-washable liner that won't crack like vinyl." },
  bathMat: { label: "Quick-dry bath mat", query: "quick dry bath mat machine washable", why: "A spare to swap in while the other one is in the wash." },
  rugCleaner: { label: "Rug and carpet spot cleaner", query: "rug spot cleaner", why: "Pick one suited to your rug's fibre, and test a hidden corner." },
  spareProtector: { label: "Spare waterproof mattress protector", query: "waterproof mattress protector", why: "Keeps the bed covered while the other one is in the wash." },
} satisfies Record<string, Pick>;

export function symbolPicks(s: CareSymbol): Pick[] {
  const g = s.glyph as { type?: string; mode?: string; heat?: string; bars?: number };
  switch (g.type) {
    case "wash":
      if (g.mode === "none") return [P.steamer, P.bag];
      if (g.mode === "hand") return [P.wool, P.delicate, P.flatRack];
      return (g.bars ?? 0) > 0 ? [P.delicate, P.mesh] : [P.detergent, P.catcher, P.mesh];
    case "bleach": return g.mode === "none" ? [P.enzyme] : [P.oxygen, P.enzyme];
    case "tumble": return g.heat === "none" ? [P.rack, P.flatRack] : [P.balls];
    case "natural": return /flat/.test(g.mode ?? "") ? [P.flatRack] : [P.rack];
    case "iron": return g.mode === "none" ? [P.spray] : g.mode === "no-steam" ? [P.cloth] : [P.iron, P.cloth];
    case "dryclean": case "wetclean": return g.mode === "none" ? [] : [P.bag];
    default: return [];
  }
}

const FABRIC: Record<string, Pick[]> = {
  wool: [P.wool, P.flatRack], cashmere: [P.wool, P.flatRack], silk: [P.silk, P.mesh], linen: [P.iron, P.detergent],
  cotton: [P.detergent, P.catcher], denim: [P.catcher, P.detergent], activewear: [P.sport, P.mesh], polyester: [P.mesh, P.detergent],
  viscose: [P.delicate, P.flatRack], blends: [P.delicate, P.mesh],
};
export const fabricPicks = (slug: string): Pick[] => FABRIC[slug] ?? [];

const GUIDE: Record<string, Pick[]> = {
  "how-to-wash-a-weighted-blanket": [P.delicate, P.balls, P.wbCover], "how-to-wash-a-hat": [P.delicate, P.softBrush, P.capShaper],
  "how-to-wash-pillows": [P.balls, P.detergent, P.pillowProtector], "how-to-wash-a-backpack": [P.delicate, P.softBrush, P.mesh],
  "how-to-wash-a-comforter": [P.downWash, P.balls, P.delicate], "how-to-wash-shoes": [P.shoeKit, P.mesh, P.softBrush],
  "how-to-wash-a-down-jacket": [P.downWash, P.balls, P.mesh], "how-to-wash-towels": [P.detergent, P.balls, P.oxygen],
  "how-to-clean-a-leather-jacket": [P.leatherCare, P.softBrush, P.bag], "how-to-wash-a-stuffed-animal": [P.mesh, P.delicate, P.softBrush],
  "how-to-wash-a-sleeping-bag": [P.downWash, P.balls, P.storageSack], "how-to-clean-a-yoga-mat": [P.matCleaner, P.softBrush, P.delicate],
  "how-to-clean-a-tie": [P.steamer, P.silk, P.cloth], "how-to-wash-a-dog-bed": [P.enzyme, P.detergent, P.dogBedCover],
  "how-to-wash-a-bra": [P.mesh, P.delicate, P.rack], "how-to-wash-a-mattress-protector": [P.detergent, P.balls, P.spareProtector],
  "how-to-wash-an-electric-blanket": [P.delicate, P.rack], "how-to-wash-microfiber-cloths": [P.mfWash, P.rack],
  "how-to-wash-a-shower-curtain": [P.showerLiner, P.detergent], "how-to-wash-a-bath-mat": [P.detergent, P.rack, P.bathMat],
  "how-to-wash-a-memory-foam-pillow": [P.pillowProtector, P.delicate], "how-to-wash-a-rug": [P.rugCleaner, P.softBrush, P.detergent],
  "how-to-wash-curtains": [P.steamer, P.delicate, P.mesh], "how-to-wash-a-fleece-blanket": [P.delicate, P.softBrush, P.rack],
};
export const guidePicks = (slug: string): Pick[] => GUIDE[slug] ?? [];
