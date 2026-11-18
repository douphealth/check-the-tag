// Partner / affiliate slots. A slot stays invisible until its url is set.
// Add your tracking link to "url" (and the programme name to "partner"), commit, push: Cloudflare deploys it.
// Per-item links (e.g. one product page per device) go in OFFER_LINKS keyed by item slug; they override the slot url.
export type OfferSlotId = "laundry-care";
export type OfferSlot = { heading: string; body: string; cta: string; url: string; partner: string };

export const OFFER_SLOTS: Record<OfferSlotId, OfferSlot> = {
  "laundry-care": { heading: "Care products for this label", body: "Detergents, wool washes and colour-safe (oxygen) bleach suited to what this label allows.", cta: "Browse care products", url: "", partner: "" },
};

export const OFFER_LINKS: Record<string, string> = {};
