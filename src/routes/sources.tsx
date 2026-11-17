import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { LAST_REVIEWED, SOURCES } from "@/lib/ctt/provenance";
import { PageHero } from "@/components/ctt/SiteChrome";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Sources, review method & artwork status | Check The Tag" },
      { name: "description", content: "Exact references, editorial review scope, regional differences, correction procedure, privacy limits and care-symbol artwork status." },
      { property: "og:title", content: "Sources, review method & artwork status" },
      { property: "og:description", content: "What Check The Tag uses, how interpretations are checked, and what remains unverified." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Sources,
});

const reviewRows = [
  ["Scope", "Plain-language mappings for the 78 displayed ISO and U.S. symbols; selected drying, ironing and wool cautions."],
  ["Method", "Each stable symbol ID is mapped to one structured meaning and a named reference. Decoder rules are deterministic and covered by automated tests."],
  ["Reviewer", "Check The Tag editorial source check. No independent reviewer, textile-laboratory validation, certification or standards-body endorsement is claimed."],
  ["Last source check", `${LAST_REVIEWED}. This date records an editorial comparison with the listed references, not independent review.`],
  ["Regional limit", "The U.S. set follows the FTC-hosted historical ASTM D5489-96c chart. It is not represented as the full current ASTM D5489-25 edition."],
];

function Sources() {
  return (
    <>
      <PageHero eyebrow={`Editorial source check · ${LAST_REVIEWED}`} title="Built on references, with limits in plain sight." lead="Meanings are plain-language interpretations of the references below. Check The Tag is educational and does not claim certification, affiliation or independent professional review." />

      <section className="mx-auto max-w-5xl px-5" aria-labelledby="review-record">
        <h2 id="review-record" className="text-3xl">Review record</h2>
        <dl className="mt-5 divide-y rounded-3xl border bg-card px-6">
          {reviewRows.map(([term, detail]) => (
            <div key={term} className="grid gap-2 py-5 md:grid-cols-[10rem_1fr]">
              <dt className="text-sm font-bold">{term}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-14 max-w-5xl px-5" aria-labelledby="reference-ledger">
        <h2 id="reference-ledger" className="text-3xl">Reference ledger</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {Object.entries(SOURCES).map(([key, source]) => (
            <a key={key} href={source.url} target="_blank" rel="noreferrer" className="tile group rounded-3xl border bg-card p-6">
              <p className="eyebrow text-muted-foreground">{source.authority}</p>
              <p className="mt-2 flex items-center gap-2 font-display text-2xl">{source.name}<ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" /></p>
              <p className="mt-1 text-sm font-semibold">{source.edition}</p>
              <p className="mt-3 text-sm text-muted-foreground">{source.note}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-14 grid max-w-5xl gap-5 px-5 md:grid-cols-2">
        <section className="rounded-3xl border bg-caution/35 p-7" aria-labelledby="artwork-status">
          <h2 id="artwork-status" className="text-2xl">Artwork and trademark status</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The drawings here are original simplified teaching diagrams, not copies of official artwork. That does <strong className="text-foreground">not</strong> establish reproduction or trademark rights.</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">GINETEX states that its care symbols are protected trademarks and describes authorization through national committees. Rights clearance remains an external launch requirement; no license is claimed.</p>
          <a href="https://www.ginetex.net/thematique/GB/textile/how-to-join-ginetex" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-4">Read GINETEX authorization guidance <ExternalLink className="h-3.5 w-3.5" /></a>
        </section>

        <section className="rounded-3xl border bg-card p-7" aria-labelledby="corrections">
          <h2 id="corrections" className="text-2xl">Corrections and change history</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A correction report should identify the stable symbol ID, quote the applicable source and edition, and explain the expected wording. High-risk interpretation errors should be corrected before release.</p>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li><strong className="text-foreground">2026-11-17:</strong> Clarified five categories, separated drying and professional subcategories, added absent/unreadable states, and removed unsupported review and tracking claims.</li>
            <li><strong className="text-foreground">2026-11-01:</strong> Initial source ledger and editorial comparison recorded.</li>
          </ol>
        </section>
      </div>

      <section className="mx-auto mt-5 max-w-5xl px-5">
        <div className="rounded-3xl bg-muted p-8 text-sm leading-relaxed text-muted-foreground">
          <p><strong className="text-foreground">Privacy and deletion.</strong> No account is required. Saved garments and colour choices live only in this browser. Remove garments on Wash day or clear this site’s browser data to delete them. Clearing data, private browsing or changing devices can lose them. Hosting and error diagnostics may process technical request data, so the site does not claim “no tracking.”</p>
          <p className="mt-3"><strong className="text-foreground">Decision limits.</strong> Only selected symbols become label instructions. Fabric advice is supplementary and never overrides the tag. Missing, absent and unreadable marks are different states; none is treated as permission. The garment maker’s complete label always wins.</p>
        </div>
      </section>
    </>
  );
}
