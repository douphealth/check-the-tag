import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { addToWardrobe, loadWardrobe, saveWardrobe } from "@/lib/wardrobe-store";

const garment = { name: "Navy merino jumper", standard: "iso" as const, fabric: "wool", selected: ["iso-wash-30-mild"] };

describe("browser-only wardrobe storage", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("saves and reloads a valid garment", () => {
    expect(addToWardrobe(garment)).not.toBeNull();
    expect(loadWardrobe()).toMatchObject([garment]);
  });

  it("discards invalid entries and symbols from the wrong regional system", () => {
    localStorage.setItem("ctt-wardrobe-v6", JSON.stringify([
      null,
      { name: "", selected: [] },
      { id: "valid", name: "Recovered shirt", standard: "us", fabric: "not-a-fabric", selected: ["iso-wash-30-mild", "us-wash-dots-1"] },
    ]));
    expect(loadWardrobe()).toEqual([
      { id: "valid", name: "Recovered shirt", standard: "us", fabric: "unknown", selected: ["us-wash-dots-1"] },
    ]);
  });

  it("reports unavailable storage instead of claiming a garment was saved", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("Blocked", "SecurityError"); });
    expect(addToWardrobe(garment)).toBeNull();
  });

  it("reports a failed deletion write", () => {
    expect(addToWardrobe(garment)).not.toBeNull();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("Full", "QuotaExceededError"); });
    expect(saveWardrobe([])).toBe(false);
    expect(loadWardrobe()).toHaveLength(1);
  });
});
