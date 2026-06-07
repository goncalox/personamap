import { describe, expect, it } from "vitest";
import { getConsensusDisplay, getProfileDescription } from "@/lib/profile-display";
import { formatCategory, getInitials } from "@/lib/utils";

describe("profile display helpers", () => {
  it("shows an untyped needs-votes state when no consensus exists yet", () => {
    expect(getConsensusDisplay(null)).toEqual({
      code: "Untyped",
      confidence: 0,
      status: "Needs votes",
      totalVotes: 0,
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
