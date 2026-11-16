import { describe, expect, it } from "vitest";
import { decodeCare } from "@/lib/ctt/engine";
import { computePlan } from "@/lib/ctt/planner";

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
});
