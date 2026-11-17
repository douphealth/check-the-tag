import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { GUIDE_ARTICLES } from "@/lib/articles";
import { PageHero } from "@/components/ctt/SiteChrome";

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "Laundry care guides & problem solvers | Check The Tag" },
      { name: "description", content: "Shrunken sweaters, faded blacks, missing labels and how ISO differs from U.S. marks." },
      { property: "og:title", content: "Laundry care guides & problem solvers" },
      { property: "og:description", content: "Shrunken sweaters, faded blacks, missing labels and how ISO differs from U.S. marks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Care guides" title="Answers for laundry-day mishaps." lead="Shrunken sweaters, faded blacks, missing labels and how ISO differs from U.S. marks." />
      <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDE_ARTICLES.map((a, i) => (
          <Link key={a.slug} to="/guides/$slug" params={{ slug: a.slug }} className="tile group relative flex flex-col overflow-hidden rounded-3xl border bg-card">
            
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
