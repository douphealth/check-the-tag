import { createFileRoute, notFound } from "@tanstack/react-router";
import { GUIDE_ARTICLES } from "@/lib/articles";
import { ArticleView } from "@/components/ctt/ArticleView";
import { AmazonPicks } from "@/components/AmazonPicks";
import { guidePicks } from "@/lib/picks";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const a = GUIDE_ARTICLES.find((x) => x.slug === params.slug);
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData: a }) => ({
    meta: a
      ? [{ title: `${a.title} | Check The Tag` }, { name: "description", content: a.description }, { property: "og:title", content: a.title }, { property: "og:description", content: a.description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" }]
      : [{ title: "Unavailable | Check The Tag" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

function Page() {
  const a = Route.useLoaderData();
  return <><ArticleView a={a} back="/guides" kind="guides" /><AmazonPicks title="Products for this job" intro="Matched to this guide. Always follow the item's own care label first." picks={guidePicks(a.slug)} /></>;
}
