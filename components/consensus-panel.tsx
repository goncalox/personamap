import { getConsensusDisplay, type ConsensusDisplayStatus } from "@/lib/profile-display";
import type { ProfileConsensus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusTone: Record<ConsensusDisplayStatus, string> = {
  "Typing pending": "border-white/15 bg-white/[0.06] text-ink/75",
  "Initial read": "border-ocean/50 bg-ocean/15 text-ocean",
  Consensus: "border-emerald-400/50 bg-emerald-400/15 text-emerald-200",
  Contested: "border-brass/50 bg-brass/15 text-brass",
  "Highly contested": "border-wine/50 bg-wine/15 text-red-200",
};

export function ConsensusPanel({ consensus }: { consensus: ProfileConsensus[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {consensus.map((item) => {
        const display = getConsensusDisplay(item);

        return (
          <article key={item.systemCode} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{item.systemCode}</p>
                <h3 className="mt-2 text-3xl font-semibold text-ink">{display.code}</h3>
                <p className="text-sm text-ink/55">
                  {display.status === "Typing pending" ? "No read yet" : "Community read"}
                </p>
              </div>
              <span className={cn("rounded-md border px-2.5 py-1 text-xs font-semibold", statusTone[display.status])}>
                {display.status}
              </span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/30">
              <div className="h-full rounded-full bg-brass" style={{ width: `${display.confidence}%` }} />
            </div>
            <p className="mt-2 text-sm text-ink/60">
              {display.confidenceLabel === "Pending" ? "Typing will appear here once seeded." : `${display.confidenceLabel} signal`}
            </p>
            {item.counts.length > 0 ? (
              <div className="mt-4 space-y-2">
                {item.counts.slice(0, 4).map((count) => (
                  <div key={count.code} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{count.code}</span>
                    <span className="text-ink/55">{count.percentage}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-ink/55">
                This profile is ready for an initial typing pass. Once a type is seeded, it will show here as an early read.
              </p>
            )}
          </article>
        );
      })}
    </section>
  );
}
