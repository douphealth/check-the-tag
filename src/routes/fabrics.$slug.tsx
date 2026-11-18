import { createFileRoute, notFound } from "@tanstack/react-router";
import { FABRIC_ARTICLES, fabricImage } from "@/lib/articles";
import { ArticleView } from "@/components/ctt/ArticleView";
import { AmazonPicks } from "@/components/AmazonPicks";
import { fabricPicks } from "@/lib/picks";

export const Route = createFileRoute("/fabrics/$slug")({
  loader: ({ params }) => {
    const a = FABRIC_ARTICLES.find((x) => x.slug === params.slug);
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData: a }) => ({
    meta: a
      ? [{ title: `${a.title} | Check The Tag` }, { name: "description", content: a.description }, { property: "og:title", content: a.title }, { property: "og:description", content: a.description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" }, { property: "og:image", content: fabricImage(a.slug) }, { name: "twitter:image", content: fabricImage(a.slug) }]
      : [{ title: "Unavailable | Check The Tag" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

function Page() {
  const a = Route.useLoaderData();
  return <><ArticleView a={a} back="/fabrics" kind="fabrics" image={fabricImage(a.slug)} /><AmazonPicks title="Products for caring for this fabric" intro="Matched to this fabric guide. Always follow the garment's own care label first." picks={fabricPicks(a.slug)} /></>;
}
