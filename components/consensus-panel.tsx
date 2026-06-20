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

const visibleSystemOrder = ["MBTI", "ENNEAGRAM"];

export function ConsensusPanel({ consensus }: { consensus: ProfileConsensus[] }) {
  const orderedConsensus = [...consensus].sort((a, b) => {
    const aIndex = visibleSystemOrder.includes(a.systemCode) ? visibleSystemOrder.indexOf(a.systemCode) : visibleSystemOrder.length;
    const bIndex = visibleSystemOrder.includes(b.systemCode) ? visibleSystemOrder.indexOf(b.systemCode) : visibleSystemOrder.length;
    return aIndex - bIndex;
  });

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {orderedConsensus.map((item) => {
        const display = getConsensusDisplay(item);

        return (
          <article key={item.systemCode} className="glass-panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{item.systemCode}</p>
                <h3 className="mt-2 text-4xl font-semibold tracking-normal text-ink">{display.code}</h3>
                <p className="text-sm text-ink/55">
                  {display.status === "Typing pending" ? "Untyped profile" : "Current read"}
                </p>
              </div>
              <span className={cn("rounded-md border px-2.5 py-1 text-xs font-semibold", statusTone[display.status])}>
                {display.status}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-4">
              <div className="h-2 overflow-hidden rounded-full bg-black/30">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brass to-ink"
                  style={{ width: `${display.confidence}%` }}
                />
              </div>
              <p className="min-w-14 text-right text-sm font-semibold text-ink">
                {display.confidenceLabel === "Pending" ? "0%" : display.confidenceLabel}
              </p>
            </div>
            {item.counts.length > 0 ? (
              <div className="mt-5 space-y-2">
                {item.counts.slice(0, 4).map((count) => (
                  <div key={count.code} className="grid grid-cols-[4.5rem_1fr_3rem] items-center gap-3 text-sm">
                    <span className="font-medium text-ink">{count.code}</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-black/25">
                      <span className="block h-full rounded-full bg-white/25" style={{ width: `${count.percentage}%` }} />
                    </span>
                    <span className="text-right text-ink/55">{count.percentage}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-ink/55">
                This profile is ready for an initial typing pass. The read will appear here once one exists.
              </p>
            )}
          </article>
        );
      })}
    </section>
  );
}
