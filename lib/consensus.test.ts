import { describe, expect, it } from "vitest";
import { calculateConsensus, getConsensusStatus } from "@/lib/consensus";
import type { TypeOption, Vote } from "@/lib/types";

const profileId = "10000000-0000-4000-8000-000000000001";
const systemId = "20000000-0000-4000-8000-000000000001";

const options: TypeOption[] = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    typing_system_id: systemId,
    code: "INTJ",
    label: "INTJ",
    description: null,
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    typing_system_id: systemId,
    code: "ENTJ",
    label: "ENTJ",
    description: null,
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    typing_system_id: systemId,
    code: "INTP",
    label: "INTP",
    description: null,
  },
];

function vote(typeOptionId: string, index: number): Vote {
  return {
    id: `40000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    profile_id: profileId,
    user_id: `50000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    typing_system_id: systemId,
    type_option_id: typeOptionId,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("calculateConsensus", () => {
  it("marks fewer than three counted votes as speculative even at 100% confidence", () => {
    const consensus = calculateConsensus({
      profileId,
      systemCode: "MBTI",
      typeOptions: options,
      votes: [vote(options[0].id, 1), vote(options[0].id, 2)],
    });

    expect(consensus.consensusCode).toBe("INTJ");
    expect(consensus.confidence).toBe(100);
    expect(consensus.totalVotes).toBe(2);
    expect(consensus.status).toBe("Speculative");
  });

  it("ignores votes for type options outside the requested system options", () => {
    const consensus = calculateConsensus({
      profileId,
      systemCode: "MBTI",
      typeOptions: options,
      votes: [
        vote(options[1].id, 1),
        vote("99999999-9999-4999-8999-999999999999", 2),
      ],
    });

    expect(consensus.totalVotes).toBe(1);
    expect(consensus.counts).toEqual([
      {
        code: "ENTJ",
        label: "ENTJ",
        percentage: 100,
        votes: 1,
      },
    ]);
  });

  it("uses the requested status thresholds", () => {
    expect(getConsensusStatus(3, 70)).toBe("Consensus");
    expect(getConsensusStatus(3, 69)).toBe("Contested");
    expect(getConsensusStatus(3, 45)).toBe("Contested");
    expect(getConsensusStatus(3, 44)).toBe("Highly contested");
  });

  it("breaks tied top counts deterministically by type code", () => {
    const consensus = calculateConsensus({
      profileId,
      systemCode: "MBTI",
      typeOptions: options,
      votes: [
        vote(options[2].id, 1),
        vote(options[0].id, 2),
        vote(options[2].id, 3),
        vote(options[0].id, 4),
      ],
    });

    expect(consensus.consensusCode).toBe("INTJ");
    expect(consensus.counts.map((count) => count.code)).toEqual(["INTJ", "INTP"]);
  });
});
