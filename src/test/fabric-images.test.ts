import { describe, expect, it } from "vitest";
import { FABRIC_ARTICLES, fabricImage } from "@/lib/articles";

describe("portable fabric image delivery", () => {
  it("keeps every fabric image off the external website's unsupported asset endpoint", () => {
    for (const article of FABRIC_ARTICLES) {
      const url = new URL(fabricImage(article.slug), "https://check-the-tag.pages.dev");
      expect(url.protocol).toBe("https:");
      expect(url.hostname).toBe("id-preview--00b0600c-9fa5-49b4-be7a-667c0327eb9c.lovable.app");
      expect(url.pathname).toMatch(/^\/__l5e\/assets-v1\/.+\.webp$/);
    }
  });
});