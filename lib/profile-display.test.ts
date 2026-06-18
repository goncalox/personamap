import { describe, expect, it } from "vitest";
import { getConsensusDisplay, getProfileDescription } from "@/lib/profile-display";
import { formatCategory, getInitials } from "@/lib/utils";

describe("profile display helpers", () => {
  it("shows an intentional pending state when no consensus exists yet", () => {
    expect(getConsensusDisplay(null)).toEqual({
      code: "Untyped",
      confidence: 0,
      confidenceLabel: "Pending",
      status: "Typing pending",
      totalVotes: 0,
    });
  });

  it("shows a single seeded vote as an initial read instead of mature consensus", () => {
    expect(
      getConsensusDisplay({
        profileId: "profile-1",
        systemCode: "MBTI",
        consensusCode: "INTJ",
        consensusLabel: "INTJ",
        confidence: 100,
        totalVotes: 1,
        status: "Speculative",
        counts: [{ code: "INTJ", label: "INTJ", percentage: 100, votes: 1 }],
      }),
    ).toMatchObject({
      code: "INTJ",
      confidenceLabel: "Early",
      status: "Initial read",
    });
  });

  it("falls back to a neutral description when none is provided", () => {
    expect(getProfileDescription(null)).toBe("No description has been added yet.");
    expect(getProfileDescription("   ")).toBe("No description has been added yet.");
  });

  it("formats unexpected categories without crashing", () => {
    expect(formatCategory("historical_figure")).toBe("Historical Figure");
    expect(formatCategory(null)).toBe("Unknown category");
  });

  it("creates stable initials for placeholder art", () => {
    expect(getInitials("Walter White")).toBe("WW");
    expect(getInitials("Cher")).toBe("C");
    expect(getInitials("")).toBe("?");
  });
});
