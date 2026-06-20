import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getConsensusDisplay } from "@/lib/profile-display";
import type { ProfileWithConsensus } from "@/lib/types";
import { cn, formatCategory, getInitials } from "@/lib/utils";

export function ProfileCard({ profile }: { profile: ProfileWithConsensus }) {
  const mbti = profile.consensus.find((item) => item.systemCode === "MBTI");
  const enneagram = profile.consensus.find((item) => item.systemCode === "ENNEAGRAM");
  const mbtiDisplay = getConsensusDisplay(mbti);
  const enneagramDisplay = getConsensusDisplay(enneagram);
  const primaryDisplay = mbtiDisplay.totalVotes > 0 ? mbtiDisplay : enneagramDisplay.totalVotes > 0 ? enneagramDisplay : mbtiDisplay;
  const isUntyped = primaryDisplay.totalVotes === 0;

  return (
    <Link
      href={`/profiles/${profile.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-glow backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-brass/65 hover:bg-white/[0.075]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {profile.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.image_url}
            alt=""
            className="h-full w-full object-cover opacity-90 saturate-[0.92] transition duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:saturate-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(244,240,232,0.11),rgba(198,161,91,0.16)_45%,rgba(71,123,142,0.13))]">
            <div className="flex size-20 items-center justify-center rounded-full border border-white/10 bg-black/25 text-2xl font-semibold text-ink/80">
              {getInitials(profile.name)}
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-coal/86 to-transparent" aria-hidden />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-md",
            isUntyped
              ? "border-white/15 bg-black/30 text-ink/70"
              : "border-brass/40 bg-brass/15 text-brass",
          )}
        >
          {primaryDisplay.status}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.16em] text-brass">{formatCategory(profile.category)}</p>
            <h3 className="mt-1 truncate text-lg font-semibold text-ink">{profile.name}</h3>
            {profile.source_title ? <p className="truncate text-sm text-ink/55">{profile.source_title}</p> : null}
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-ink/35 transition group-hover:text-brass" aria-hidden />
        </div>
        <div className="mt-auto grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-md border border-white/10 bg-black/20 p-2.5">
            <p className="text-xs text-ink/40">MBTI</p>
            <p className="mt-1 truncate font-semibold text-ink">{mbtiDisplay.code}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/20 p-2.5">
            <p className="text-xs text-ink/40">Ennea</p>
            <p className="mt-1 truncate font-semibold text-ink">{enneagramDisplay.code}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/20 p-2.5">
            <p className="text-xs text-ink/40">Signal</p>
            <p className="mt-1 truncate font-semibold text-ink">{primaryDisplay.confidenceLabel}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
