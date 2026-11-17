import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Article } from "@/lib/articles";

export function ArticleView({ a, back, image, kind }: { a: Article; back: "/fabrics" | "/guides"; image?: string; kind: string }) {
  return (
    <article>
      <header className="relative overflow-hidden bg-ink-gradient grain">
        {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity" />}
        <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-12">
          <Link to={back} className="inline-flex items-center gap-1.5 text-sm font-semibold opacity-75 hover:opacity-100"><ArrowLeft className="h-4 w-4" />All {kind}</Link>
          <h1 className="mt-8 animate-rise text-4xl leading-[1.05] md:text-6xl">{a.title}</h1>
          <p className="mt-6 max-w-2xl animate-rise text-lg opacity-80">{a.lead}</p>
          <p className="mt-5 text-xs opacity-65">Check The Tag editorial guide · no independent reviewer claimed · <Link to="/sources" className="underline underline-offset-4">method and sources</Link></p>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-5 pt-14">
        <ol className="space-y-6">
          {a.sections.map((s, i) => (
            <motion.li key={s.heading} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
              className="grid gap-4 rounded-3xl border bg-card p-6 md:grid-cols-[4rem_1fr] md:p-8">
              <span className="font-display text-4xl text-clay">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-2xl">{s.heading}</h2>
                {s.body.map((p) => <p key={p} className="mt-3 leading-relaxed text-muted-foreground">{p}</p>)}
              </div>
            </motion.li>
          ))}
        </ol>
        {a.sources.length > 0 && (
          <div className="mt-10 rounded-3xl border bg-muted/60 p-6">
            <p className="eyebrow text-muted-foreground">Sources</p>
            <ul className="mt-3 space-y-2">
              {a.sources.map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">{s.label || s.href}<ExternalLink className="h-3.5 w-3.5" /></a></li>)}
            </ul>
          </div>
        )}
        <div className="mt-10 rounded-3xl bg-sage/50 p-8 text-center">
          <p className="font-display text-2xl">Have the garment in hand?</p>
          <Link to="/" hash="decoder" className="mt-4 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-ink-foreground">Decode its label</Link>
        </div>
      </div>
    </article>
  );
}
