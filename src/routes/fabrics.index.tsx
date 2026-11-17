import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { FABRIC_ARTICLES, fabricImage } from "@/lib/articles";
import { PageHero } from "@/components/ctt/SiteChrome";

export const Route = createFileRoute("/fabrics/")({
  head: () => ({
    meta: [
      { title: "Fabric care guides | Check The Tag" },
      { name: "description", content: "Wool, silk, linen, denim and more — what each fibre fears, and how to read its label." },
      { property: "og:title", content: "Fabric care guides" },
      { property: "og:description", content: "Wool, silk, linen, denim and more — what each fibre fears, and how to read its label." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Fabric field guide" title="Know the fibre. Then trust the tag." lead="Wool, silk, linen, denim and more — what each fibre fears, and how to read its label." />
      <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
        {FABRIC_ARTICLES.map((a, i) => (
          <Link key={a.slug} to="/fabrics/$slug" params={{ slug: a.slug }} className="tile group relative flex flex-col overflow-hidden rounded-3xl border bg-card">
            <img src={fabricImage(a.slug)} alt="" loading="lazy" className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ filter: `hue-rotate(${i * 30}deg)` }} />
            <div className="flex flex-1 flex-col p-6">
              <p className="eyebrow text-muted-foreground">{String(i + 1).padStart(2, "0")} · {a.slug.replace(/-/g, " ")}</p>
              <p className="mt-2 font-display text-2xl leading-snug">{a.title}</p>
              <p className="mt-3 line-clamp-3 flex-1 text-sm text-muted-foreground">{a.description}</p>
              <ArrowUpRight className="mt-4 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
