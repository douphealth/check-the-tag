import { createFileRoute, notFound } from "@tanstack/react-router";
import { GUIDE_ARTICLES } from "@/lib/articles";
import { ArticleView } from "@/components/ctt/ArticleView";

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
  return <ArticleView a={a} back="/guides" kind="guides"  />;
}
