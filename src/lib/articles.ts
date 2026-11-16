import data from "@/data/articles.json";
import linen from "@/assets/linen-natural.webp.asset.json";
import satin from "@/assets/satin-blue.webp.asset.json";
import wool from "@/assets/wool-clay.webp.asset.json";

export interface Article { slug: string; title: string; description: string; lead: string; sections: { heading: string; body: string[] }[]; sources: { label: string; href: string }[] }
export const FABRIC_ARTICLES = data.fabrics as Article[];
export const GUIDE_ARTICLES = data.guides as Article[];
const IMG: Record<string, string> = { linen: linen.url, silk: satin.url, wool: wool.url, cashmere: wool.url, viscose: satin.url, cotton: linen.url };
export const fabricImage = (slug: string) => IMG[slug] ?? linen.url;
export const FABRIC_DECODER_ID: Record<string, string> = { blends: "blend" };
