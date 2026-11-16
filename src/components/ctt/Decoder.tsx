import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Copy, Link2, Plus, RotateCcw, ShieldCheck, Shirt } from "lucide-react";
import { toast } from "sonner";
import { FABRICS, STANDARDS, getSteps, getSymbols, SYMBOL_BY_ID, type Standard } from "@/lib/ctt/catalog";
import { decodeCare, toggleSymbol } from "@/lib/ctt/engine";
import { addToWardrobe } from "@/lib/wardrobe-store";
import { SymbolIcon } from "./SymbolIcon";
import { cn } from "@/lib/utils";

const DEMO = ["iso-wash-30-mild", "iso-bleach-none", "iso-tumble-none", "iso-natural-flat", "iso-iron-dots-1"];

export function Decoder() {
  const [standard, setStandard] = useState<Standard>("iso");
  const [fabric, setFabric] = useState("unknown");
  const [step, setStep] = useState("wash");
  const [sel, setSel] = useState<string[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const std = p.get("std") === "us" ? "us" : "iso";
    const ids = (p.get("s") || "").split(",").filter((id) => SYMBOL_BY_ID.get(id)?.standard === std);
    if (ids.length) { setStandard(std); setSel(ids); }
    const f = p.get("f"); if (f && FABRICS.some((x) => x.id === f)) setFabric(f);
  }, []);

  const steps = getSteps(standard);
  const symbols = getSymbols(standard, step);
  const result = useMemo(() => decodeCare(sel, standard, fabric), [sel, standard, fabric]);
  const pct = (result.coverage / 5) * 100;

  const switchStd = (s: Standard) => { setStandard(s); setSel([]); if (s === "iso" && step === "extras") setStep("wash"); };
  const shareUrl = () => `${window.location.origin}/?std=${standard}&f=${fabric}&s=${sel.join(",")}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      {/* Picker */}
      <div className="min-w-0 rounded-3xl border bg-card p-5 shadow-soft md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full bg-muted p-1">
            {(Object.keys(STANDARDS) as Standard[]).map((s) => (
              <button key={s} onClick={() => switchStd(s)} className={cn("relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors", standard === s ? "text-ink-foreground" : "text-muted-foreground")}>
                {standard === s && <motion.span layoutId="std" className="absolute inset-0 rounded-full bg-ink" />}
                <span className="relative">{STANDARDS[s].short}</span>
              </button>
            ))}
          </div>
          <select value={fabric} onChange={(e) => setFabric(e.target.value)} className="rounded-full border bg-background px-4 py-2 text-sm font-medium">
            {FABRICS.map((f) => <option key={f.id} value={f.id}>{f.id === "unknown" ? "Fabric: not sure" : f.title}</option>)}
          </select>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {steps.map((s) => {
            const has = sel.some((id) => { const g = SYMBOL_BY_ID.get(id)?.group; return s.id === "care" ? g === "dryclean" || g === "wetclean" : g === s.id; });
            return (
              <button key={s.id} onClick={() => setStep(s.id)} className={cn("tile flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold", step === s.id ? "border-ink bg-ink text-ink-foreground" : "bg-background")}>
                <span className="font-mono text-xs opacity-60">{s.number}</span>{s.short}
                {has && <span className="h-2 w-2 rounded-full bg-clay" />}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{steps.find((s) => s.id === step)?.caption}</p>

        <AnimatePresence mode="wait">
          <motion.div key={standard + step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}
            className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {symbols.map((s) => {
              const on = sel.includes(s.id);
              return (
                <motion.button whileTap={{ scale: 0.92 }} key={s.id} onClick={() => setSel(toggleSymbol(sel, s.id, standard))} title={s.meaning}
                  className={cn("tile group relative flex flex-col items-center gap-2 rounded-2xl border p-3 text-center", on ? "border-ink bg-sage/60" : "bg-background hover:border-clay")}>
                  {on && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-ink-foreground"><Check className="h-3 w-3" /></span>}
                  <SymbolIcon symbol={s} className="h-14 w-14 text-ink transition-transform group-hover:scale-110" />
                  <span className="text-[11px] font-semibold leading-tight">{s.title}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => { setStandard("iso"); setSel(DEMO); setFabric("wool"); }} className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted">Try a wool sweater label</button>
          {sel.length > 0 && <button onClick={() => setSel([])} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><RotateCcw className="h-4 w-4" />Clear</button>}
        </div>
      </div>

      {/* Result */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl bg-ink-gradient p-6 shadow-lift grain md:p-7">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0">
              <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="3" />
                <motion.circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--clay)" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray="97.4" animate={{ strokeDashoffset: 97.4 - (97.4 * pct) / 100 }} transition={{ type: "spring", stiffness: 80, damping: 15 }} />
              </svg>
              <span className="absolute inset-0 grid place-items-center font-display text-xl">{result.coverage}/5</span>
            </div>
            <div>
              <p className="eyebrow opacity-60">Label coverage</p>
              <p className="mt-1 text-sm opacity-80">{result.missing.length ? `Not yet: ${result.missing.join(", ")}` : "All five care categories covered"}</p>
            </div>
          </div>

          <div className="mt-6 flex min-h-12 flex-wrap gap-2">
            <AnimatePresence>
              {result.selected.map((s) => (
                <motion.button layout key={s.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                  onClick={() => setSel(sel.filter((x) => x !== s.id))} className="h-12 w-12 rounded-xl bg-background p-1.5 text-ink" title={`Remove ${s.title}`}>
                  <SymbolIcon symbol={s} />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <p className="eyebrow mt-6 opacity-60">Plain-language instruction</p>
          <AnimatePresence mode="wait">
            <motion.p key={result.sentence} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 font-display text-2xl leading-snug">
              {result.sentence || "Pick the marks you see on the tag. Nothing is guessed from symbols you didn't select."}
            </motion.p>
          </AnimatePresence>

          {sel.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => { navigator.clipboard.writeText(result.sentence); toast.success("Instruction copied"); }} className="inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1.5 text-xs font-semibold hover:bg-background/20"><Copy className="h-3.5 w-3.5" />Copy</button>
              <button onClick={() => { navigator.clipboard.writeText(shareUrl()); toast.success("Share link copied"); }} className="inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1.5 text-xs font-semibold hover:bg-background/20"><Link2 className="h-3.5 w-3.5" />Share link</button>
            </div>
          )}
        </div>

        {(result.risks.length > 0 || result.notices.length > 0 || result.fibreNote) && (
          <div className="mt-4 space-y-3">
            {result.risks.map((r) => (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} key={r.title} className={cn("flex gap-3 rounded-2xl border p-4", r.level === "important" ? "bg-accent/25" : "bg-caution/50")}>
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div><p className="text-sm font-bold">{r.title}</p><p className="text-sm text-muted-foreground">{r.message}</p></div>
              </motion.div>
            ))}
            {result.fibreNote && <div className="flex gap-3 rounded-2xl border bg-sage/40 p-4"><Shirt className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="text-sm font-bold">{result.fibreNote.title}</p><p className="text-sm text-muted-foreground">{result.fibreNote.message} <span className="opacity-70">— {result.fibreNote.source}</span></p></div></div>}
            {result.notices.map((n) => <div key={n} className="flex gap-3 rounded-2xl border bg-card p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" /><p className="text-sm text-muted-foreground">{n}</p></div>)}
          </div>
        )}

        {sel.length > 0 && (
          <form className="mt-4 flex gap-2 rounded-2xl border bg-card p-2" onSubmit={(e) => {
            e.preventDefault();
            const n = name.trim().slice(0, 60); if (!n) return;
            addToWardrobe({ name: n, standard, fabric, selected: sel }); setName("");
            toast.success(`${n} saved — plan loads on Wash day`);
          }}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name this garment, e.g. Navy merino jumper" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
            <button className="inline-flex items-center gap-1 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-ink-foreground"><Plus className="h-4 w-4" />Save</button>
          </form>
        )}
      </div>
    </div>
  );
}
