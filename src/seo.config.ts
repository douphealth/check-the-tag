// Site-wide SEO settings used by src/lib/seo-edge.ts, /sitemap.xml and /llms.txt.
export type SeoPage = { path: string; title: string; section?: string; desc?: string; lastmod?: string };
import { FABRIC_ARTICLES, GUIDE_ARTICLES } from "@/lib/articles";
import { SYMBOLS } from "@/lib/ctt/catalog";

export const SEO = {
  origin: "https://checkthetag.shop",
  pagesDevHost: "check-the-tag.pages.dev",
  name: "Check The Tag",
  description: "Decode any laundry care label in seconds: tap the symbols on a clothing tag and get one clear washing instruction, risk warnings and fabric advice (ISO 3758:2023 and U.S. ASTM D5489 symbols).",
  lang: "en",
  logo: "/mark.svg" as string | undefined,
  sameAs: [] as string[],
  sectionNames: {} as Record<string, string>,
  keepTrailingSlash: false,
  // Google AdSense publisher ID ("ca-pub-…"). Empty = no ad code and no /ads.txt.
  adsenseClient: "",
};

export const LLMS_NOTES: string[] = [
  "Symbol meanings follow ISO 3758:2023 and ASTM D5489; each symbol page lists its standard and risk notes.",
  "Advice is general fabric-care guidance; follow the garment manufacturer's label when it differs."
];

export function seoPages(): SeoPage[] {
  return [
    { path: "/", title: "Check The Tag — laundry care label decoder", section: "Start here" },
    { path: "/symbols", title: "All laundry care symbols explained", section: "Start here" },
    { path: "/fabrics", title: "Fabric care guides", section: "Start here" },
    { path: "/guides", title: "Laundry guides", section: "Start here" },
    { path: "/wash-day", title: "Wash day planner", section: "Start here" },
    { path: "/sources", title: "Sources and standards", section: "Start here" },
    ...SYMBOLS.map((s) => ({ path: `/symbols/${s.id}`, title: `${s.title} — care symbol meaning`, section: "Care symbols", desc: s.meaning })),
    ...FABRIC_ARTICLES.map((a) => ({ path: `/fabrics/${a.slug}`, title: a.title, section: "Fabric guides", desc: a.description })),
    ...GUIDE_ARTICLES.map((a) => ({ path: `/guides/${a.slug}`, title: a.title, section: "Laundry guides", desc: a.description })),
  ];
}
