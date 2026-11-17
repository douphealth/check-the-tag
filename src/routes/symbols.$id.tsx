import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";
import { SYMBOL_BY_ID, SYMBOLS, STANDARDS } from "@/lib/ctt/catalog";
import { SOURCES } from "@/lib/ctt/provenance";
import { SymbolIcon } from "@/components/ctt/SymbolIcon";
import { GROUP_LABEL } from "@/lib/groups";
import { GROUP_TIPS, counterpart, howToRead, symbolAnswer, symbolFaq } from "@/lib/symbol-content";

export const Route = createFileRoute("/symbols/$id")({
  loader: ({ params }) => {
    const s = SYMBOL_BY_ID.get(params.id);
    if (!s) throw notFound();
    return { id: s.id };
  },
  head: ({ loaderData }) => {
    const s = loaderData ? SYMBOL_BY_ID.get(loaderData.id) : undefined;
    if (!s) return { meta: [{ title: "Symbol not found | Check The Tag" }, { name: "robots", content: "noindex" }] };
    const t = `${s.title} — ${GROUP_LABEL[s.group]} symbol meaning (${STANDARDS[s.standard].short}) | Check The Tag`;
    return { meta: [{ title: t }, { name: "description", content: `${s.title} care label symbol (${STANDARDS[s.standard].short}): ${s.meaning}`.slice(0, 158) }, { property: "og:title", content: t }, { property: "og:description", content: s.meaning }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" }] };
  },
  component: SymbolPage,
});

function SymbolPage() {
  const { id } = Route.useLoaderData();
  const s = SYMBOL_BY_ID.get(id)!;
  const src = s.standard === "us" ? SOURCES["ftc"]! : SOURCES["ginetex"]!;
  const twin = counterpart(s);
  const faq = symbolFaq(s);
  const ld = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) }).replace(/</g, "\\u003c");
  const groupAll = SYMBOLS.filter((x) => x.group === s.group && x.standard === s.standard);
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
      <section className="mt-16 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-3xl">What does this symbol mean?</h2>
          <p className="mt-4 text-lg leading-relaxed">{symbolAnswer(s)}</p>
          <h3 className="mt-8 text-xl font-semibold">How to recognise it</h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">{howToRead(s)}</p>
        </div>
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="text-2xl">{s.standard === "iso" ? "US label equivalent" : "International (ISO) equivalent"}</h2>
          {twin ? (<Link to="/symbols/$id" params={{ id: twin.id }} className="mt-4 flex items-center gap-4 hover:opacity-80"><SymbolIcon symbol={twin} className="h-14 w-14 shrink-0 text-ink" /><span><span className="block font-semibold">{twin.title}</span><span className="text-sm text-muted-foreground">{twin.meaning}</span></span></Link>)
            : <p className="mt-4 text-sm text-muted-foreground">No direct equivalent in the {s.standard === "iso" ? "US (FTC / ASTM)" : "ISO 3758"} system in our catalogue. Read the full label and any written instructions.</p>}
          <h3 className="mt-8 text-lg font-semibold">Practical tips for {GROUP_LABEL[s.group]?.toLowerCase()}</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">{(GROUP_TIPS[s.group] ?? []).map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </section>
      {groupAll.length > 1 && (
        <section className="mt-16">
          <h2 className="text-3xl">All {STANDARDS[s.standard].short} {GROUP_LABEL[s.group]?.toLowerCase()} symbols compared</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border"><table className="w-full text-sm"><thead><tr className="text-left"><th className="p-3">Symbol</th><th className="p-3">Meaning</th></tr></thead>
            <tbody>{groupAll.map((x) => <tr key={x.id} className={`border-t ${x.id === s.id ? "bg-accent/20" : ""}`}><td className="p-3 font-semibold whitespace-nowrap">{x.id === s.id ? x.title : <Link to="/symbols/$id" params={{ id: x.id }} className="underline-offset-4 hover:underline">{x.title}</Link>}</td><td className="p-3 text-muted-foreground">{x.meaning}</td></tr>)}</tbody></table></div>
        </section>
      )}
      <section className="mt-16">
        <h2 className="text-3xl">Frequently asked questions</h2>
        <div className="mt-6 divide-y rounded-2xl border">{faq.map((x) => <div key={x.q} className="p-5"><h3 className="font-semibold">{x.q}</h3><p className="mt-2 text-muted-foreground leading-relaxed">{x.a}</p></div>)}</div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />
      </section>
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
