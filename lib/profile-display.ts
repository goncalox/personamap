import type { ProfileConsensus } from "@/lib/types";

export function getConsensusDisplay(consensus: ProfileConsensus | null | undefined) {
  const totalVotes = consensus?.totalVotes ?? 0;

  return {
    code: consensus?.consensusCode ?? "Untyped",
    confidence: consensus?.confidence ?? 0,
    status: totalVotes === 0 ? "Needs votes" : (consensus?.status ?? "Speculative"),
    totalVotes,
  };
}

export function getProfileDescription(description: string | null | undefined) {
  return description?.trim() || "No description has been added yet.";
}
