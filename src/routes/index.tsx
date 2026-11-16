import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SYMBOLS, type CareSymbol } from "@/lib/ctt/catalog";
import { SymbolIcon } from "@/components/ctt/SymbolIcon";
import { Decoder } from "@/components/ctt/Decoder";
import { FABRIC_ARTICLES, GUIDE_ARTICLES, fabricImage } from "@/lib/articles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Check The Tag — Decode any laundry care label in seconds" },
      { name: "description", content: "Tap the symbols on your clothing tag and get one clear washing instruction, risk warnings and fabric advice. ISO 3758:2023 and U.S. ASTM marks." },
      { property: "og:title", content: "Check The Tag — Decode any laundry care label" },
      { property: "og:description", content: "Tap the marks on your tag. Get one clear instruction, with warnings and fabric advice." },
    ],
  }),
  component: Index,
});

const RIBBON = SYMBOLS.filter((s) => s.standard === "iso");

function Index() {
  return (
    <>
      <section className="relative overflow-hidden bg-paper-glow">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-10 pt-14 md:grid-cols-[1.2fr_1fr] md:pt-20">
          <div>
            <p className="eyebrow inline-flex animate-rise items-center gap-2 rounded-full border bg-card px-3 py-1.5"><Sparkles className="h-3.5 w-3.5 text-clay" />ISO 3758:2023 · U.S. ASTM · reviewed Nov 2026</p>
            <h1 className="mt-6 animate-rise text-5xl font-medium leading-[0.98] md:text-[5.5rem]">
              Read the tag.<br /><em className="text-clay">Save the sweater.</em>
            </h1>
            <p className="mt-6 max-w-xl animate-rise text-lg text-muted-foreground [animation-delay:120ms]">
              Tap the little marks on your clothing label and get one clear instruction, with the warnings that actually matter for the fabric.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-rise [animation-delay:200ms]">
              <a href="#decoder" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-ink-foreground shadow-lift transition-transform hover:-translate-y-0.5">Decode a label <ArrowRight className="h-4 w-4" /></a>
              <Link to="/symbols" className="inline-flex items-center gap-2 rounded-full border bg-card px-6 py-3.5 font-semibold hover:bg-muted">Browse 78 symbols</Link>
            </div>
          </div>
          <HeroOrbit />
        </div>
        <div className="relative border-y bg-card/60 py-4">
          <div className="flex w-max animate-marquee gap-6">
            {[...RIBBON, ...RIBBON].map((s, i) => <SymbolIcon key={i} symbol={s} className="h-10 w-10 text-ink/70" />)}
          </div>
        </div>
      </section>

      <section id="decoder" className="mx-auto max-w-7xl scroll-mt-20 px-5 pt-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted-foreground">The decoder</p>
            <h2 className="mt-2 text-4xl md:text-5xl">Tap what you see on the tag</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">One mark per category. Pick a step, tap a symbol, and the instruction rewrites itself as you go.</p>
        </div>
        <Decoder />
      </section>

      <Stats />
      <Quiz />

      <section className="mx-auto max-w-7xl px-5 pt-24">
        <div className="flex items-end justify-between"><h2 className="text-4xl">Care by fabric</h2><Link to="/fabrics" className="text-sm font-semibold underline-offset-4 hover:underline">All fabrics →</Link></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FABRIC_ARTICLES.slice(0, 4).map((a, i) => (
            <Link key={a.slug} to="/fabrics/$slug" params={{ slug: a.slug }} className="tile group relative overflow-hidden rounded-3xl border bg-card">
              <img src={fabricImage(a.slug)} alt="" loading="lazy" className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ filter: `hue-rotate(${i * 25}deg)` }} />
              <div className="p-5"><p className="eyebrow text-muted-foreground">{a.slug}</p><p className="mt-1 font-display text-lg leading-snug">{a.title}</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-20">
        <h2 className="text-4xl">Problem solvers</h2>
        <div className="mt-8 divide-y rounded-3xl border bg-card">
          {GUIDE_ARTICLES.map((g) => (
            <Link key={g.slug} to="/guides/$slug" params={{ slug: g.slug }} className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-muted">
              <div><p className="font-display text-xl">{g.title}</p><p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{g.description}</p></div>
              <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function HeroOrbit() {
  const picks = useMemo(() => ["iso-wash-40-normal", "iso-bleach-none", "iso-tumble-low", "iso-iron-dots-2", "iso-natural-flat", "iso-dryclean-p"].map((id) => SYMBOLS.find((s) => s.id === id)!), []);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-8 rounded-full border border-dashed border-ink/20" />
      <div className="absolute inset-0 grid place-items-center">
        <motion.div initial={{ rotate: -8, scale: 0.9, opacity: 0 }} animate={{ rotate: -4, scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }}
          className="relative w-56 rounded-2xl bg-card p-5 shadow-lift">
          <div className="mx-auto -mt-8 mb-3 h-6 w-6 rounded-full border-4 border-background bg-clay" />
          <p className="eyebrow text-center text-muted-foreground">100% merino wool</p>
          <div className="mt-3 grid grid-cols-3 gap-2">{picks.slice(0, 6).map((s) => <SymbolIcon key={s.id} symbol={s} className="h-14 w-14 text-ink" />)}</div>
          <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground">MADE IN PORTUGAL · RN 0420</p>
        </motion.div>
      </div>
      {picks.map((s, i) => {
        const a = (i / picks.length) * Math.PI * 2;
        return (
          <motion.div key={s.id} drag dragSnapToOrigin whileHover={{ scale: 1.15 }}
            className="absolute h-16 w-16 cursor-grab rounded-2xl border bg-card p-2.5 text-ink shadow-soft animate-float"
            style={{ left: `calc(50% + ${Math.cos(a) * 44}% - 2rem)`, top: `calc(50% + ${Math.sin(a) * 44}% - 2rem)`, animationDelay: `${i * -1.1}s` }}>
            <SymbolIcon symbol={s} />
          </motion.div>
        );
      })}
    </div>
  );
}

function Stats() {
  const items = [["78", "illustrated marks"], ["2", "label systems: ISO and U.S."], ["10", "fabric field guides"], ["0", "accounts or tracking"]];
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24">
      <div className="grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([n, l], i) => (
          <motion.div key={l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card p-8">
            <p className="font-display text-6xl text-clay">{n}</p><p className="mt-2 text-sm text-muted-foreground">{l}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function pickRound(): { answer: CareSymbol; options: CareSymbol[] } {
  const pool = SYMBOLS.filter((s) => s.standard === "iso");
  const answer = pool[Math.floor(Math.random() * pool.length)]!;
  const others = pool.filter((s) => s.id !== answer.id).sort(() => Math.random() - 0.5).slice(0, 3);
  return { answer, options: [answer, ...others].sort(() => Math.random() - 0.5) };
}

function Quiz() {
  const [round, setRound] = useState<ReturnType<typeof pickRound> | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const start = () => { setRound(pickRound()); setPicked(null); };
  const choose = (id: string) => {
    if (picked || !round) return;
    setPicked(id);
    setScore((s) => ({ right: s.right + (id === round.answer.id ? 1 : 0), total: s.total + 1 }));
  };
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24">
      <div className="relative overflow-hidden rounded-3xl bg-ink-gradient p-8 grain md:p-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow opacity-60">60-second challenge</p>
            <h2 className="mt-2 text-4xl md:text-5xl">Could you read a tag without us?</h2>
            <p className="mt-4 opacity-75">Name the symbol. Score {score.right}/{score.total}.</p>
            {!round && <button onClick={start} className="mt-6 rounded-full bg-clay px-6 py-3 font-semibold text-accent-foreground">Start the quiz</button>}
          </div>
          {round && (
            <div>
              <motion.div key={round.answer.id} initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} className="mx-auto h-32 w-32 rounded-3xl bg-background p-4 text-ink"><SymbolIcon symbol={round.answer} /></motion.div>
              <div className="mt-6 grid gap-2">
                {round.options.map((o) => (
                  <button key={o.id} onClick={() => choose(o.id)} className={cn("rounded-xl border border-ink-foreground/20 px-4 py-3 text-left text-sm font-semibold transition-colors",
                    picked && o.id === round.answer.id && "bg-sage text-ink", picked === o.id && o.id !== round.answer.id && "bg-destructive text-destructive-foreground", !picked && "hover:bg-background/10")}>{o.title}</button>
                ))}
              </div>
              {picked && <button onClick={start} className="mt-4 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-accent-foreground">Next symbol →</button>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
