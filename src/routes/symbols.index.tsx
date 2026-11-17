import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { SYMBOLS, STANDARDS, type Standard } from "@/lib/ctt/catalog";
import { SymbolIcon } from "@/components/ctt/SymbolIcon";
import { PageHero } from "@/components/ctt/SiteChrome";
import { GROUP_LABEL, GROUP_ORDER } from "@/lib/groups";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/symbols/")({
  head: () => ({
    meta: [
      { title: "All 78 laundry care symbols explained | Check The Tag" },
      { name: "description", content: "Searchable library of ISO and U.S. laundry symbols: washing, bleach, drying, ironing and professional care, each in plain language." },
      { property: "og:title", content: "All 78 laundry care symbols explained" },
      { property: "og:description", content: "Search every washing, drying, ironing and dry-cleaning mark." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SymbolsPage,
});

function SymbolsPage() {
  const [q, setQ] = useState("");
  const [std, setStd] = useState<Standard | "all">("all");
  const [group, setGroup] = useState("all");
  const list = useMemo(() => {
    const t = q.toLowerCase().trim();
    return SYMBOLS.filter((s) => (std === "all" || s.standard === std) && (group === "all" || s.group === group) && (!t || `${s.title} ${s.meaning} ${s.group}`.toLowerCase().includes(t)));
  }, [q, std, group]);
  return (
    <>
      <PageHero eyebrow="Symbol library" title="Every mark, in plain words." lead="Filter by label system and category, or just type what you see — “triangle”, “dots”, “circle”, “40”." />
      <div className="sticky top-16 z-30 border-y bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-3">
          <label className="flex min-w-60 flex-1 items-center gap-2 rounded-full border bg-card px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search symbols…" className="w-full bg-transparent text-sm outline-none" />
          </label>
          <div className="flex gap-1 rounded-full bg-muted p-1">
            {(["all", "iso", "us"] as const).map((s) => (
              <button key={s} onClick={() => setStd(s)} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", std === s ? "bg-ink text-ink-foreground" : "text-muted-foreground")}>{s === "all" ? "Both" : STANDARDS[s].short}</button>
            ))}
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-3">
          {["all", ...GROUP_ORDER].map((g) => (
            <button key={g} onClick={() => setGroup(g)} className={cn("shrink-0 rounded-full border px-3 py-1 text-xs font-semibold", group === g ? "border-clay bg-accent/30" : "bg-card")}>{g === "all" ? "All categories" : GROUP_LABEL[g]}</button>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 pt-8">
        <p className="text-sm text-muted-foreground">{list.length} symbols</p>
        <motion.div layout className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {list.map((s) => (
              <motion.div layout key={s.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Link to="/symbols/$id" params={{ id: s.id }} className="tile group flex h-full flex-col rounded-3xl border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <SymbolIcon symbol={s} className="h-16 w-16 text-ink transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110" />
                    <span className="eyebrow rounded-full bg-muted px-2 py-1 text-[10px]">{s.standard === "iso" ? "ISO" : "US"}</span>
                  </div>
                  <p className="mt-4 font-display text-lg leading-tight">{s.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.meaning}</p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
