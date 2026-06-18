import type { ProfileConsensus } from "@/lib/types";

export type ConsensusDisplayStatus =
  | "Typing pending"
  | "Initial read"
  | "Consensus"
  | "Contested"
  | "Highly contested";

export type ConsensusDisplay = {
  code: string;
  confidence: number;
  confidenceLabel: string;
  status: ConsensusDisplayStatus;
  totalVotes: number;
};

export function getConsensusDisplay(consensus: ProfileConsensus | null | undefined): ConsensusDisplay {
  const totalVotes = consensus?.totalVotes ?? 0;
  const confidence = consensus?.confidence ?? 0;

  if (totalVotes === 0) {
    return {
      code: "Untyped",
      confidence,
      confidenceLabel: "Pending",
      status: "Typing pending" satisfies ConsensusDisplayStatus,
      totalVotes,
    };
  }

  if (totalVotes < 3) {
    return {
      code: consensus?.consensusCode ?? "Untyped",
      confidence,
      confidenceLabel: "Early",
      status: "Initial read" satisfies ConsensusDisplayStatus,
      totalVotes,
    };
  }

  return {
    code: consensus?.consensusCode ?? "Untyped",
    confidence,
    confidenceLabel: `${confidence}%`,
    status: consensus?.status === "Speculative" ? "Initial read" : (consensus?.status ?? "Contested"),
    totalVotes,
  };
}

export function getProfileDescription(description: string | null | undefined) {
  return description?.trim() || "No description has been added yet.";
}
