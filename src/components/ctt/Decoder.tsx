import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowDown, Check, Copy, Link2, Plus, RotateCcw, ShieldCheck, Shirt } from "lucide-react";
import { toast } from "sonner";
import { FABRICS, STANDARDS, getSteps, getSymbols, SYMBOL_BY_ID, type CareSymbol, type Standard } from "@/lib/ctt/catalog";
import { CARE_CATEGORIES, decodeCare, parseShare, serializeShare, toggleSymbol, type CategoryId, type CategoryState, type CategoryStates } from "@/lib/ctt/engine";
import { addToWardrobe } from "@/lib/wardrobe-store";
import { SymbolIcon } from "./SymbolIcon";
import { cn } from "@/lib/utils";

const DEMO = ["iso-wash-30-mild", "iso-bleach-none", "iso-tumble-none", "iso-natural-flat", "iso-iron-dots-1"];
const categoryLabel = (id: string) => CARE_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export function Decoder() {
  const [standard, setStandard] = useState<Standard>("iso");
  const [fabric, setFabric] = useState("unknown");
  const [step, setStep] = useState("wash");
  const [sel, setSel] = useState<string[]>([]);
  const [states, setStates] = useState<CategoryStates>({});
  const [pendingStandard, setPendingStandard] = useState<Standard | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const shared = parseShare(window.location.search);
    if (!shared) return;
    setStandard(shared.standard);
    setSel(shared.selected);
    setFabric(shared.fabric);
    setStates(shared.states);
  }, []);

  const steps = getSteps(standard);
  const sections = useMemo(() => {
    const groups = step === "dry" ? ["tumble", "natural"] : step === "professional" ? ["dryclean", "wetclean"] : [step];
    return groups.map((group) => ({ group, symbols: getSymbols(standard, step).filter((s) => s.group === group) })).filter((s) => s.symbols.length);
  }, [standard, step]);
  const result = useMemo(() => decodeCare(sel, standard, fabric, states), [sel, standard, fabric, states]);
  const pct = (result.coverage / 5) * 100;

  const applyStandard = (next: Standard) => {
    setStandard(next);
    setSel([]);
    setStates({});
    setStep("wash");
    setPendingStandard(null);
  };
  const switchStd = (next: Standard) => {
    if (next === standard) return;
    if (sel.length || Object.keys(states).length) setPendingStandard(next);
    else applyStandard(next);
  };
  const chooseSymbol = (symbol: CareSymbol) => {
    setSel((current) => toggleSymbol(current, symbol.id, standard));
    const category = CARE_CATEGORIES.find((c) => c.groups.includes(symbol.group));
    if (category) setStates((current) => {
      const next = { ...current };
      delete next[category.id];
      return next;
    });
  };
  const markCategory = (id: CategoryId, state: CategoryState) => {
    const category = CARE_CATEGORIES.find((c) => c.id === id)!;
    const active = states[id] === state;
    setSel((current) => current.filter((symbolId) => {
      const group = SYMBOL_BY_ID.get(symbolId)?.group;
      return active || !group || !category.groups.includes(group);
    }));
    setStates((current) => {
      const next = { ...current };
      if (active) delete next[id];
      else next[id] = state;
      return next;
    });
  };
  const shareUrl = () => `${window.location.origin}/?${serializeShare(sel, standard, fabric, states).toString()}`;
  const copy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch {
      toast.error("Copy failed. Your browser may have blocked clipboard access.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <div className="min-w-0 rounded-3xl border bg-card p-5 shadow-soft md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full bg-muted p-1" aria-label="Care label system">
            {(Object.keys(STANDARDS) as Standard[]).map((s) => (
              <button key={s} onClick={() => switchStd(s)} aria-pressed={standard === s} className={cn("relative min-h-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors", standard === s ? "text-ink-foreground" : "text-muted-foreground")}>
                {standard === s && <motion.span layoutId="std" className="absolute inset-0 rounded-full bg-ink" />}
                <span className="relative">{STANDARDS[s].short}</span>
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="decoder-fabric">Fabric for supplementary advice</label>
          <select id="decoder-fabric" value={fabric} onChange={(e) => setFabric(e.target.value)} className="min-h-11 rounded-full border bg-background px-4 py-2 text-sm font-medium">
            {FABRICS.map((f) => <option key={f.id} value={f.id}>{f.id === "unknown" ? "Fabric: not sure" : f.title}</option>)}
          </select>
        </div>

        <AnimatePresence>
          {pendingStandard && (
            <motion.div role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-4 rounded-2xl border bg-caution/50 p-4 text-sm">
                <p className="font-bold">Switch to {STANDARDS[pendingStandard].short} and clear this label?</p>
                <p className="mt-1 text-muted-foreground">ISO and U.S. marks are not silently converted. Your current selections and category notes will be cleared.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => applyStandard(pendingStandard)} className="min-h-10 rounded-full bg-ink px-4 text-xs font-semibold text-ink-foreground">Switch and clear</button>
                  <button onClick={() => setPendingStandard(null)} className="min-h-10 rounded-full border bg-card px-4 text-xs font-semibold">Keep this label</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Five care categories">
          {steps.map((s) => {
            const has = sel.some((id) => getSymbols(standard, s.id).some((symbol) => symbol.id === id));
            const status = s.id === "extras" ? (has ? "provided" : "unknown") : result.states[s.id as CategoryId];
            return (
              <button key={s.id} onClick={() => setStep(s.id)} aria-label={`${s.label} category`} aria-pressed={step === s.id} className={cn("tile flex min-h-12 shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold", step === s.id ? "border-ink bg-ink text-ink-foreground" : "bg-background")}>
                <span className="font-mono text-xs opacity-80">{s.number}</span>{s.short}
                {status === "provided" && <span className="grid h-4 w-4 place-items-center rounded-full bg-clay text-accent-foreground" aria-label="Entered"><Check className="h-3 w-3" /></span>}
                {(status === "absent" || status === "unreadable") && <span className="h-2 w-2 rounded-full bg-clay" aria-label={status === "absent" ? "Marked not on label" : "Marked unreadable"} />}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{steps.find((s) => s.id === step)?.caption}</p>

        <AnimatePresence mode="wait">
          <motion.div key={standard + step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="mt-5 space-y-6">
            {sections.map((section) => (
              <section key={section.group} aria-label={section.group === "tumble" ? "Tumble drying" : section.group === "natural" ? "Air drying" : section.group === "dryclean" ? "Dry cleaning" : section.group === "wetclean" ? "Wet cleaning" : undefined}>
                {sections.length > 1 && <h3 className="mb-3 font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">{section.group === "tumble" ? "Machine drying" : section.group === "natural" ? "Air drying" : section.group === "dryclean" ? "Dry cleaning" : "Professional wet cleaning"}</h3>}
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {section.symbols.map((s) => {
                    const on = sel.includes(s.id);
                    return (
                      <motion.button whileTap={{ scale: 0.96 }} key={s.id} onClick={() => chooseSymbol(s)} aria-pressed={on} aria-label={`${s.title}. ${s.meaning}`}
                        className={cn("tile group relative flex min-h-32 flex-col items-center gap-2 rounded-2xl border p-3 text-center", on ? "border-ink bg-sage/60 ring-1 ring-ink" : "bg-background hover:border-clay")}>
                        {on && <span aria-hidden="true" className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-ink-foreground"><Check className="h-3 w-3" /></span>}
                        <SymbolIcon symbol={s} className="h-14 w-14 text-ink transition-transform group-hover:scale-110" />
                        <span className="text-[11px] font-semibold leading-tight">{s.title}</span>
                        <span className="sr-only">{on ? "Selected" : "Not selected"}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </section>
            ))}
          </motion.div>
        </AnimatePresence>

        {step !== "extras" && (
          <div className="mt-5 rounded-2xl bg-muted/70 p-3">
            <p className="text-xs font-semibold text-muted-foreground">No matching mark in this category?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => markCategory(step as CategoryId, "absent")} aria-pressed={states[step as CategoryId] === "absent"} className={cn("min-h-10 rounded-full border bg-card px-3 text-xs font-semibold", states[step as CategoryId] === "absent" && "border-ink bg-sage/50")}>Not on my label</button>
              <button onClick={() => markCategory(step as CategoryId, "unreadable")} aria-pressed={states[step as CategoryId] === "unreadable"} className={cn("min-h-10 rounded-full border bg-card px-3 text-xs font-semibold", states[step as CategoryId] === "unreadable" && "border-ink bg-caution/60")}>Can’t read this category</button>
            </div>
          </div>
        )}

        {(sel.length > 0 || Object.keys(states).length > 0) && (
          <a href="#instructions" className="sticky bottom-3 z-20 mt-5 flex min-h-12 items-center justify-center gap-2 rounded-full bg-clay px-5 text-sm font-bold text-accent-foreground shadow-lift lg:hidden">View instructions <ArrowDown className="h-4 w-4" /></a>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => { setStandard("iso"); setSel(DEMO); setFabric("wool"); setStates({}); setStep("wash"); }} className="min-h-11 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted">Try a consistent wool-label example</button>
          {(sel.length > 0 || Object.keys(states).length > 0) && <button onClick={() => { setSel([]); setStates({}); }} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><RotateCcw className="h-4 w-4" />Clear</button>}
        </div>
      </div>

      <div id="instructions" className="scroll-mt-24 lg:sticky lg:top-20 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl bg-ink-gradient p-6 shadow-lift grain md:p-7">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0" aria-hidden="true">
              <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="3" />
                <motion.circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--clay)" strokeWidth="3" strokeLinecap="round" strokeDasharray="97.4" animate={{ strokeDashoffset: 97.4 - (97.4 * pct) / 100 }} transition={{ type: "spring", stiffness: 80, damping: 15 }} />
              </svg>
              <span className="absolute inset-0 grid place-items-center font-display text-xl">{result.coverage}/5</span>
            </div>
            <div>
              <p className="eyebrow opacity-60">Label progress</p>
              <p className="mt-1 text-sm font-semibold">{result.coverage} of 5 care categories entered</p>
              <p className="mt-1 text-xs opacity-70">Drying combines tumble + air. Professional care keeps dry + wet cleaning separate.</p>
            </div>
          </div>

          <div className="mt-6 flex min-h-12 flex-wrap gap-2" role="group" aria-label="Selected symbols">
            <AnimatePresence>
              {result.selected.map((s) => (
                <motion.button layout key={s.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                  onClick={() => setSel(sel.filter((x) => x !== s.id))} aria-label={`Remove ${s.title}`} className="h-12 w-12 rounded-xl bg-background p-1.5 text-ink">
                  <SymbolIcon symbol={s} />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <p className="eyebrow mt-6 opacity-60">Your label says</p>
          <div aria-live="polite" aria-atomic="true" className="mt-2">
            <AnimatePresence mode="wait">
              <motion.p key={result.sentence} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-display text-2xl leading-snug">
                {result.sentence || "Pick only the marks you can see. Nothing is guessed from unselected symbols."}
              </motion.p>
            </AnimatePresence>
          </div>

          {(result.missing.length > 0 || result.unreadable.length > 0 || result.absent.length > 0) && (
            <div className="mt-5 rounded-2xl border border-ink-foreground/15 bg-background/5 p-4 text-sm">
              {result.missing.length > 0 && <p><span className="font-bold">Still unknown:</span> {result.missing.map(categoryLabel).join(", ")}.</p>}
              {result.unreadable.length > 0 && <p className="mt-2"><span className="font-bold">Unreadable:</span> {result.unreadable.map(categoryLabel).join(", ")}. No instruction inferred.</p>}
              {result.absent.length > 0 && <p className="mt-2 opacity-75"><span className="font-bold">Marked not on label:</span> {result.absent.map(categoryLabel).join(", ")}. Absence is not permission.</p>}
            </div>
          )}

          {(sel.length > 0 || Object.keys(states).length > 0) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {sel.length > 0 && <button onClick={() => copy(result.sentence, "Instruction copied")} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-background/10 px-3 py-1.5 text-xs font-semibold hover:bg-background/20"><Copy className="h-3.5 w-3.5" />Copy</button>}
              <button onClick={() => copy(shareUrl(), "Share link copied")} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-background/10 px-3 py-1.5 text-xs font-semibold hover:bg-background/20"><Link2 className="h-3.5 w-3.5" />Share link</button>
            </div>
          )}
        </div>

        {result.fibreNote && (
          <div className="mt-4 rounded-2xl border bg-sage/40 p-4">
            <p className="eyebrow text-muted-foreground">Fabric considerations · not label instructions</p>
            <div className="mt-3 flex gap-3"><Shirt className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="text-sm font-bold">{result.fibreNote.title}</p><p className="text-sm text-muted-foreground">{result.fibreNote.message} <span className="opacity-70">— {result.fibreNote.source}</span></p></div></div>
          </div>
        )}

        {(result.risks.length > 0 || result.notices.length > 0) && (
          <div className="mt-4 space-y-3">
            {result.risks.map((r) => (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} key={r.title} className={cn("flex gap-3 rounded-2xl border p-4", r.level === "important" ? "bg-accent/25" : "bg-caution/50")}>
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div><p className="text-sm font-bold">{r.title}</p><p className="text-sm text-muted-foreground">{r.message}</p></div>
              </motion.div>
            ))}
            {result.notices.map((n) => <div key={n} className="flex gap-3 rounded-2xl border bg-card p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" /><p className="text-sm text-muted-foreground">{n}</p></div>)}
          </div>
        )}

        {sel.length > 0 && (
          <form className="mt-4 flex gap-2 rounded-2xl border bg-card p-2" onSubmit={(e) => {
            e.preventDefault();
            const n = name.trim().slice(0, 60); if (!n) return;
            const saved = addToWardrobe({ name: n, standard, fabric, selected: sel });
            if (!saved) { toast.error("This browser blocked storage. Your garment was not saved."); return; }
            setName("");
            toast.success(`${n} saved — plan loads on Wash day`);
          }}>
            <label className="sr-only" htmlFor="garment-name">Garment name</label>
            <input id="garment-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Name this garment, e.g. Navy merino jumper" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
            <button className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-ink-foreground"><Plus className="h-4 w-4" />Save</button>
          </form>
        )}
      </div>
    </div>
  );
}
