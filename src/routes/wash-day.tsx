import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Droplets, Thermometer, Trash2 } from "lucide-react";
import { computePlan, type Garment } from "@/lib/ctt/planner";
import { SYMBOL_BY_ID } from "@/lib/ctt/catalog";
import { SymbolIcon } from "@/components/ctt/SymbolIcon";
import { PageHero } from "@/components/ctt/SiteChrome";
import { loadWardrobe, saveWardrobe } from "@/lib/wardrobe-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wash-day")({
  head: () => ({
    meta: [
      { title: "Wash-day planner — group garments into safe loads | Check The Tag" },
      { name: "description", content: "Save decoded garments and sort them into compatible machine loads by colour, cycle and the lowest temperature on each label." },
      { property: "og:title", content: "Wash-day planner" },
      { property: "og:description", content: "Group your saved garments into safe, compatible wash loads." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WashDay,
});

const COLOURS = [["dark", "Darks"], ["light", "Lights"], ["bright", "Brights"]] as const;
const CYCLE = ["Normal", "Mild / permanent press", "Very mild / gentle"];

function WashDay() {
  const [items, setItems] = useState<Garment[]>([]);
  const [colours, setColours] = useState<Record<string, string>>({});
  useEffect(() => {
    setItems(loadWardrobe());
    try { setColours(JSON.parse(localStorage.getItem("ctt-colours") || "{}")); } catch { /* ignore */ }
  }, []);
  const setColour = (id: string, c: string) => {
    const next = { ...colours, [id]: c };
    try { localStorage.setItem("ctt-colours", JSON.stringify(next)); setColours(next); }
    catch { toast.error("This browser blocked storage. The colour choice was not saved."); }
  };
  const remove = (id: string) => {
    const next = items.filter((x) => x.id !== id);
    if (!saveWardrobe(next)) { toast.error("This browser blocked storage. The garment was not removed."); return; }
    setItems(next);
  };
  const plan = useMemo(() => computePlan(items, colours), [items, colours]);

  return (
    <>
      <PageHero eyebrow="Wash-day planner" title="Fewer loads. The strictest label leads." lead="Garments you save from the decoder appear here. Tag each with a colour group and we build loads that respect the strictest label in the drum." />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[1fr_1.1fr]">
        <section>
          <h2 className="text-2xl">Your garments <span className="text-muted-foreground">({items.length})</span></h2>
          {items.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-dashed bg-card p-10 text-center">
              <p className="font-display text-xl">No saved garments yet</p>
              <p className="mt-2 text-sm text-muted-foreground">Decode a label, give it a name and hit Save.</p>
              <Link to="/" hash="decoder" className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ink-foreground">Open the decoder</Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              <AnimatePresence>
                {items.map((g) => (
                  <motion.li layout key={g.id} exit={{ opacity: 0, x: -40 }} className="rounded-2xl border bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{g.name}</p>
                      <button onClick={() => remove(g.id)} aria-label={`Remove ${g.name}`} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {g.selected.map((id) => { const s = SYMBOL_BY_ID.get(id); return s ? <SymbolIcon key={id} symbol={s} className="h-8 w-8 text-ink" /> : null; })}
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      {COLOURS.map(([k, l]) => (
                        <button key={k} onClick={() => setColour(g.id, k)} className={cn("rounded-full border px-3 py-1 text-xs font-semibold", colours[g.id] === k ? "border-ink bg-ink text-ink-foreground" : "bg-background")}>{l}</button>
                      ))}
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>
        <section className="lg:sticky lg:top-20 lg:self-start">
          <h2 className="text-2xl">Your loads</h2>
          <div className="mt-4 space-y-4">
            {plan.batches.map((b, i) => (
              <motion.div layout key={b.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl bg-ink-gradient p-6 grain">
                <p className="eyebrow opacity-60">Load {i + 1} · {b.kind}</p>
                <p className="mt-1 font-display text-3xl">{b.colour}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <span className="inline-flex items-center gap-1.5"><Thermometer className="h-4 w-4 text-clay" />Max {b.maxTemp}°C</span>
                  <span className="inline-flex items-center gap-1.5"><Droplets className="h-4 w-4 text-clay" />{CYCLE[b.cycle] ?? "Gentle"} cycle</span>
                </div>
                <p className="mt-4 text-sm opacity-80">{b.items.join(" · ")}</p>
              </motion.div>
            ))}
            {plan.pending.length > 0 && (
              <div className="rounded-3xl border bg-caution/40 p-6">
                <p className="font-semibold">Not in a machine load yet</p>
                <ul className="mt-2 space-y-1 text-sm">{plan.pending.map((p) => <li key={p.item.id}><b>{p.item.name}</b> — {p.reason}</li>)}</ul>
              </div>
            )}
            {items.length > 0 && plan.batches.length === 0 && plan.pending.length === 0 && <p className="text-muted-foreground">Pick colour groups to build loads.</p>}
          </div>
        </section>
      </div>
    </>
  );
}
