import { ArrowDown, ArrowUp } from "lucide-react";
import type { EvidenceCard as EvidenceCardType } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

export function EvidenceCard({ evidence }: { evidence: EvidenceCardType }) {
  return (
    <article className="glass-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-semibold uppercase",
              evidence.stance === "for"
                ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-200"
                : "border-wine/50 bg-wine/15 text-red-200",
            )}
          >
            {evidence.stance}
          </span>
          <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-xs font-semibold text-ink">
            {evidence.type_options?.code ?? "Type"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink/60">
          <ArrowUp className="size-4" aria-hidden />
          {evidence.score}
          <ArrowDown className="size-4" aria-hidden />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink">{evidence.title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink/70">{evidence.body}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-ink/40">
        <p>{formatDate(evidence.created_at)}</p>
        <p>{evidence.type_options?.label ?? "Type still being clarified"}</p>
      </div>
    </article>
  );
}
