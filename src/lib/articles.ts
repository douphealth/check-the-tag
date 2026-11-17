import data from "@/data/articles.json";
import linen from "@/assets/linen-natural.webp.asset.json";
import satin from "@/assets/satin-blue.webp.asset.json";
import wool from "@/assets/wool-clay.webp.asset.json";

export interface Article { slug: string; title: string; description: string; lead: string; sections: { heading: string; body: string[] }[]; sources: { label: string; href: string }[] }
export const FABRIC_ARTICLES = data.fabrics as Article[];
export const GUIDE_ARTICLES = data.guides as Article[];
// Resolve asset pointers against their verified serving origin, not the deployment
// origin: external hosts do not implement Lovable's /__l5e/assets-v1 endpoint.
const ASSET_ORIGIN = "https://id-preview--00b0600c-9fa5-49b4-be7a-667c0327eb9c.lovable.app";
const linenUrl = new URL(linen.url, ASSET_ORIGIN).href;
const satinUrl = new URL(satin.url, ASSET_ORIGIN).href;
const woolUrl = new URL(wool.url, ASSET_ORIGIN).href;
const IMG: Record<string, string> = { linen: linenUrl, silk: satinUrl, wool: woolUrl, cashmere: woolUrl, viscose: satinUrl, cotton: linenUrl };
export const fabricImage = (slug: string) => IMG[slug] ?? linenUrl;
export const FABRIC_DECODER_ID: Record<string, string> = { blends: "blend" };
