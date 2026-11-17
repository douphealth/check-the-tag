import { describe, expect, it } from "vitest";
import { decodeCare, parseShare, serializeShare, toggleSymbol } from "@/lib/ctt/engine";
import { computePlan } from "@/lib/ctt/planner";
import { SYMBOLS } from "@/lib/ctt/catalog";
import { referenceForSymbol } from "@/lib/ctt/provenance";

describe("care decoder", () => {
  it("combines selected marks into one instruction", () => {
    const r = decodeCare(["iso-wash-30-mild", "iso-bleach-none", "iso-natural-flat"], "iso", "unknown");
    expect(r.sentence).toBe("Machine wash at up to 30°C on a mild cycle; Do not bleach; Dry flat.");
  });

  it("puts mixed garments in one load at the lowest label temperature", () => {
    const plan = computePlan(
      [
        { id: "a", name: "Tee", standard: "iso", fabric: "cotton", selected: ["iso-wash-60-normal"] },
        { id: "b", name: "Shirt", standard: "iso", fabric: "cotton", selected: ["iso-wash-40-normal"] },
      ],
      { a: "dark", b: "dark" },
    );
    expect(plan.batches[0]?.maxTemp).toBe(40);
  });

  it("keeps hand-wash garments out of machine loads", () => {
    const plan = computePlan([{ id: "a", name: "Silk", standard: "iso", fabric: "silk", selected: ["iso-wash-hand-40"] }], { a: "dark" });
    expect(plan.pending[0]?.reason).toBe("Hand wash — not a machine load");
  });

  it("allows dry cleaning and professional wet cleaning on the same label", () => {
    const withDryCleaning = toggleSymbol([], "iso-dryclean-p", "iso");
    const selected = toggleSymbol(withDryCleaning, "iso-wetclean-w", "iso");
    const result = decodeCare(selected, "iso", "unknown");
    expect(selected).toEqual(["iso-dryclean-p", "iso-wetclean-w"]);
    expect(result.sentence).toContain("Professional dry cleaning P permitted");
    expect(result.sentence).toContain("Professional wet cleaning W permitted");
  });

  it("counts tumble and air drying as one category without dropping either instruction", () => {
    const result = decodeCare(["iso-tumble-low", "iso-natural-flat"], "iso", "unknown");
    expect(result.coverage).toBe(1);
    expect(result.sentence).toBe("Tumble dry on low heat; Dry flat.");
  });

  it("distinguishes absent, unreadable and still-unknown categories", () => {
    const result = decodeCare([], "iso", "unknown", { bleach: "absent", dry: "unreadable" });
    expect(result.absent).toEqual(["bleach"]);
    expect(result.unreadable).toEqual(["dry"]);
    expect(result.missing).toEqual(["wash", "iron", "professional"]);
    expect(result.sentence).toBe("");
    expect(result.notices.join(" ")).toContain("Absence is not treated as permission");
  });

  it("does not treat a selected symbol as permission for any unselected category", () => {
    const result = decodeCare(["iso-wash-40-normal"], "iso", "unknown");
    expect(result.coverage).toBe(1);
    expect(result.missing).toEqual(["bleach", "dry", "iron", "professional"]);
    expect(result.sentence).not.toContain("bleach");
  });

  it("uses the correct regional ironing temperature for one dot", () => {
    expect(decodeCare(["iso-iron-dots-1"], "iso", "unknown").sentence).toBe("Iron at up to 120°C.");
    expect(decodeCare(["us-iron-dots-1"], "us", "unknown").sentence).toBe("Iron at up to 110°C.");
  });

  it("round-trips selections and category states in a share link", () => {
    const params = serializeShare(["iso-wash-30-mild"], "iso", "wool", { bleach: "absent", dry: "unreadable" });
    expect(parseShare(`?${params}`)).toEqual({
      standard: "iso",
      fabric: "wool",
      selected: ["iso-wash-30-mild"],
      states: { bleach: "absent", dry: "unreadable" },
      demo: false,
    });
  });

  it("drops symbols from the wrong regional system in shared URLs", () => {
    const shared = parseShare("?system=us&symbols=iso-wash-95-normal,not-a-symbol");
    expect(shared?.selected).toEqual([]);
  });

  it("reads legacy share links without trusting invalid fabrics", () => {
    const shared = parseShare("?std=iso&s=iso-wash-30-mild&f=invalid");
    expect(shared?.selected).toEqual(["iso-wash-30-mild"]);
    expect(shared?.fabric).toBe("unknown");
  });

  it("gives every published symbol a sourced, non-empty mapping", () => {
    expect(SYMBOLS).toHaveLength(78);
    for (const symbol of SYMBOLS) {
      const result = decodeCare([symbol.id], symbol.standard, "unknown");
      expect(result.selected.map((s) => s.id), symbol.id).toEqual([symbol.id]);
      expect(result.sentence.length, symbol.id).toBeGreaterThan(0);
      expect(referenceForSymbol(symbol).url, symbol.id).toMatch(/^https:\/\//);
    }
  });
});
