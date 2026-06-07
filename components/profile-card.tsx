import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProfileWithConsensus } from "@/lib/types";
import { formatCategory } from "@/lib/utils";

export function ProfileCard({ profile }: { profile: ProfileWithConsensus }) {
  const mbti = profile.consensus.find((item) => item.systemCode === "MBTI");
  const enneagram = profile.consensus.find((item) => item.systemCode === "ENNEAGRAM");

  return (
    <Link
      href={`/profiles/${profile.slug}`}
      className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-glow transition hover:-translate-y-0.5 hover:border-brass/70"
    >
      <div className="aspect-[4/3] overflow-hidden bg-white/5">
        {profile.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.image_url}
            alt=""
            className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : null}
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-brass">{formatCategory(profile.category)}</p>
            <h3 className="mt-1 text-lg font-semibold text-ink">{profile.name}</h3>
            {profile.source_title ? <p className="text-sm text-ink/55">{profile.source_title}</p> : null}
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-ink/35 transition group-hover:text-brass" aria-hidden />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs font-semibold text-ink/75">
            {mbti?.status ?? "Consensus pending"}
          </span>
          <span className="text-xs text-ink/45">Tap to open profile</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-md bg-black/20 p-2">
            <p className="text-ink/45">MBTI</p>
            <p className="font-semibold text-ink">{mbti?.consensusCode ?? "TBD"}</p>
          </div>
          <div className="rounded-md bg-black/20 p-2">
            <p className="text-ink/45">Enneagram</p>
            <p className="font-semibold text-ink">{enneagram?.consensusCode ?? "TBD"}</p>
          </div>
          <div className="rounded-md bg-black/20 p-2">
            <p className="text-ink/45">Confidence</p>
            <p className="font-semibold text-ink">{mbti ? `${mbti.confidence}%` : "0%"}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-ink/45">
          <span>{mbti?.totalVotes ?? 0} MBTI votes</span>
          <span>{enneagram?.totalVotes ?? 0} Enneagram votes</span>
        </div>
      </div>
    </Link>
  );
}
