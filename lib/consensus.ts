import type { ProfileConsensus, TypeOption, TypingSystemCode, Vote } from "@/lib/types";

export function getConsensusStatus(totalVotes: number, confidence: number): ProfileConsensus["status"] {
  if (totalVotes < 3) return "Speculative";
  if (confidence >= 70) return "Consensus";
  if (confidence >= 45) return "Contested";
  return "Highly contested";
}

export function calculateConsensus(params: {
  profileId: string;
  systemCode: TypingSystemCode;
  typeOptions: TypeOption[];
  votes: Vote[];
}): ProfileConsensus {
  const optionMap = new Map(params.typeOptions.map((option) => [option.id, option]));
  const countsByOption = new Map<string, number>();

  for (const vote of params.votes) {
    if (!optionMap.has(vote.type_option_id)) continue;
    countsByOption.set(vote.type_option_id, (countsByOption.get(vote.type_option_id) ?? 0) + 1);
  }

  const totalVotes = Array.from(countsByOption.values()).reduce((sum, count) => sum + count, 0);
  const counts = Array.from(countsByOption.entries())
    .map(([optionId, votes]) => {
      const option = optionMap.get(optionId);
      return {
        code: option?.code ?? "Unknown",
        label: option?.label ?? "Unknown",
        votes,
        percentage: totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100),
      };
    })
    .sort((a, b) => b.votes - a.votes || a.code.localeCompare(b.code));

  const top = counts.at(0);
  const confidence = top?.percentage ?? 0;

  return {
    profileId: params.profileId,
    systemCode: params.systemCode,
    consensusCode: top?.code ?? null,
    consensusLabel: top?.label ?? null,
    confidence,
    totalVotes,
    status: getConsensusStatus(totalVotes, confidence),
    counts,
  };
}

export function summarizeEvidence(params: {
  consensusCode: string | null;
  evidence: Array<{ title: string; stance: "for" | "against"; score: number }>;
}) {
  if (!params.consensusCode) {
    return "There is not enough evidence yet to explain this profile's typing.";
  }

  const forTitles = params.evidence
    .filter((card) => card.stance === "for")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((card) => card.title);
  const againstTitles = params.evidence
    .filter((card) => card.stance === "against")
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((card) => card.title);

  const strongestCase = forTitles.length > 0 ? forTitles.join(", ") : "no strong supporting cards yet";
  const objections = againstTitles.length > 0 ? againstTitles.join(", ") : "no major objections yet";

  return `The strongest case for ${params.consensusCode} is based on: ${strongestCase}. Main objections: ${objections}.`;
}
