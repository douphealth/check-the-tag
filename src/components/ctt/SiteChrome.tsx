import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Decoder" },
  { to: "/symbols", label: "Symbols" },
  { to: "/fabrics", label: "Fabrics" },
  { to: "/guides", label: "Guides" },
  { to: "/wash-day", label: "Wash day" },
  { to: "/sources", label: "Sources" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={cn("sticky top-0 z-50 transition-all duration-300", scrolled ? "bg-background/80 backdrop-blur-xl border-b" : "bg-transparent")}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-semibold">
          <img src="/mark.svg" alt="" className="h-8 w-8 transition-transform hover:rotate-6" />
          Check The Tag
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "bg-ink text-ink-foreground hover:text-ink-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t bg-background px-5 py-3 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 font-medium">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink-gradient">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Check The Tag</p>
          <p className="mt-3 max-w-xs text-sm opacity-75">Plain-language laundry symbol guidance based on ISO 3758:2023 and the FTC-hosted ASTM chart. Educational, not official artwork.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {NAV.map((n) => <Link key={n.to} to={n.to} className="opacity-80 hover:opacity-100">{n.label}</Link>)}
        </div>
        <p className="text-sm opacity-60 md:text-right">Always defer to the garment maker's full label. Your saved garments stay on this device.</p>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <section className="bg-paper-glow">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 md:pt-24">
        <p className="eyebrow animate-rise text-accent-foreground">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl animate-rise text-5xl font-medium leading-[1.02] md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl animate-rise text-lg text-muted-foreground [animation-delay:120ms]">{lead}</p>
      </div>
    </section>
  );
}
