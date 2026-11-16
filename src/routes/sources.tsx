import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { LAST_REVIEWED, SOURCES } from "@/lib/ctt/provenance";
import { PageHero } from "@/components/ctt/SiteChrome";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Sources & methodology | Check The Tag" },
      { name: "description", content: "Where our symbol meanings come from: ISO 3758:2023, GINETEX, the FTC-hosted ASTM chart and Woolmark, with licensing limits stated plainly." },
      { property: "og:title", content: "Sources & methodology" },
      { property: "og:description", content: "The standards and references behind every symbol meaning." },
    ],
  }),
  component: Sources,
});

function Sources() {
  return (
    <>
      <PageHero eyebrow={`Last human review · ${LAST_REVIEWED}`} title="Built on standards, not guesses." lead="Meanings are plain-language descriptions of public references. Symbol drawings are original teaching diagrams — not licensed official care-mark artwork." />
      <div className="mx-auto grid max-w-5xl gap-4 px-5 md:grid-cols-2">
        {Object.entries(SOURCES).map(([k, s]) => (
          <a key={k} href={s.url} target="_blank" rel="noreferrer" className="tile group rounded-3xl border bg-card p-6">
            <p className="eyebrow text-muted-foreground">{s.authority}</p>
            <p className="mt-2 flex items-center gap-2 font-display text-2xl">{s.name}<ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" /></p>
            <p className="mt-1 text-sm font-semibold">{s.edition}</p>
            <p className="mt-3 text-sm text-muted-foreground">{s.note}</p>
          </a>
        ))}
      </div>
      <div className="mx-auto mt-10 max-w-5xl px-5">
        <div className="rounded-3xl bg-muted p-8 text-sm leading-relaxed text-muted-foreground">
          <p><b className="text-foreground">Privacy.</b> No accounts, no tracking. Saved garments live only in this browser.</p>
          <p className="mt-3"><b className="text-foreground">Limits.</b> This guide never infers instructions from symbols you didn't select, and the garment maker's full label always wins.</p>
        </div>
      </div>
    </>
  );
}
