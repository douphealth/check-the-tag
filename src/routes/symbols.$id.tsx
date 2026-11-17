import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";
import { SYMBOL_BY_ID, SYMBOLS, STANDARDS } from "@/lib/ctt/catalog";
import { SOURCES } from "@/lib/ctt/provenance";
import { SymbolIcon } from "@/components/ctt/SymbolIcon";
import { GROUP_LABEL } from "@/lib/groups";

export const Route = createFileRoute("/symbols/$id")({
  loader: ({ params }) => {
    const s = SYMBOL_BY_ID.get(params.id);
    if (!s) throw notFound();
    return { id: s.id };
  },
  head: ({ loaderData }) => {
    const s = loaderData ? SYMBOL_BY_ID.get(loaderData.id) : undefined;
    if (!s) return { meta: [{ title: "Symbol not found | Check The Tag" }, { name: "robots", content: "noindex" }] };
    const t = `${s.title} — ${GROUP_LABEL[s.group]} symbol meaning | Check The Tag`;
    return { meta: [{ title: t }, { name: "description", content: s.meaning }, { property: "og:title", content: t }, { property: "og:description", content: s.meaning }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" }] };
  },
  component: SymbolPage,
});

function SymbolPage() {
  const { id } = Route.useLoaderData();
  const s = SYMBOL_BY_ID.get(id)!;
  const src = s.standard === "us" ? SOURCES["ftc"]! : SOURCES["ginetex"]!;
  const related = SYMBOLS.filter((x) => x.group === s.group && x.standard === s.standard && x.id !== s.id);
  return (
    <div className="mx-auto max-w-6xl px-5 pt-10">
      <Link to="/symbols" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />All symbols</Link>
      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.2fr]">
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[2.5rem] bg-ink-gradient grain">
          <SymbolIcon symbol={s} className="h-3/5 w-3/5 animate-rise" />
        </div>
        <div className="self-center">
          <p className="eyebrow text-muted-foreground">{STANDARDS[s.standard].name} · {GROUP_LABEL[s.group]}</p>
          <h1 className="mt-3 text-5xl leading-tight md:text-6xl">{s.title}</h1>
          <p className="mt-6 text-xl leading-relaxed">{s.meaning}</p>
          {s.risk && <div className="mt-6 flex gap-3 rounded-2xl border bg-accent/20 p-5"><AlertTriangle className="h-5 w-5 shrink-0 text-destructive" /><p className="text-sm">{s.risk}</p></div>}
          <p className="mt-5 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Restriction:</span> {s.risk || "Follow the complete garment label and any accompanying written instructions."}</p>
          <a href={src.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline">Source: {src.name} · {src.edition} <ExternalLink className="h-3.5 w-3.5" /></a>
          <p className="mt-3 text-xs text-muted-foreground">Editorial source mapping; no independent certification claimed. <Link to="/sources" className="underline underline-offset-4">Review method and artwork status</Link>.</p>
          <div className="mt-8"><Link to="/" hash="decoder" search={{ std: s.standard, s: s.id }} className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 py-3 font-semibold text-ink-foreground">Start decoding with this mark</Link></div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl">Related {GROUP_LABEL[s.group]?.toLowerCase()} marks</h2>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {related.map((r) => (
              <Link key={r.id} to="/symbols/$id" params={{ id: r.id }} className="tile flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 text-center">
                <SymbolIcon symbol={r} className="h-12 w-12 text-ink" /><span className="text-xs font-semibold">{r.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
