import { describe, expect, it } from "vitest";
import {
  filterProfilesByCategory,
  filterProfilesByTyping,
  getProfileCategoryOptions,
  hasActiveProfileFilters,
  normalizeProfileCategory,
  normalizeProfileType,
} from "@/lib/profile-filters";
import type { ProfileConsensus, ProfileWithConsensus, TypingSystemCode } from "@/lib/types";

function consensus(systemCode: TypingSystemCode, consensusCode: string | null): ProfileConsensus {
  return {
    profileId: "profile",
    systemCode,
    consensusCode,
    consensusLabel: consensusCode,
    confidence: consensusCode ? 100 : 0,
    totalVotes: consensusCode ? 1 : 0,
    status: "Speculative",
    counts: consensusCode ? [{ code: consensusCode, label: consensusCode, votes: 1, percentage: 100 }] : [],
  };
}

function profile(
  id: string,
  category: string,
  typing: { mbti?: string | null; enneagram?: string | null } = {},
): ProfileWithConsensus {
  return {
    id,
    slug: id,
    name: id,
    category,
    source_title: null,
    description: null,
    image_url: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    consensus: [consensus("MBTI", typing.mbti ?? null), consensus("ENNEAGRAM", typing.enneagram ?? null)],
  };
}

describe("profile filters", () => {
  const profiles = [
    profile("walter-white", "fictional", { mbti: "INTJ", enneagram: "5w6" }),
    profile("bruce-wayne", "fictional", { mbti: "INTJ", enneagram: "1w9" }),
    profile("carl-jung", "public_figure", { mbti: "INFJ", enneagram: "5w4" }),
    profile("unknown-category", "historical_figure", { mbti: null, enneagram: null }),
  ];

  it("normalizes empty category filters to all", () => {
    expect(normalizeProfileCategory(undefined)).toBe("all");
    expect(normalizeProfileCategory("")).toBe("all");
    expect(normalizeProfileCategory("all")).toBe("all");
    expect(normalizeProfileCategory("fictional")).toBe("fictional");
  });

  it("normalizes empty type filters to all", () => {
    expect(normalizeProfileType(undefined)).toBe("all");
    expect(normalizeProfileType("")).toBe("all");
    expect(normalizeProfileType("all")).toBe("all");
    expect(normalizeProfileType("INTJ")).toBe("INTJ");
  });

  it("filters profiles by category without removing unknown categories from all", () => {
    expect(filterProfilesByCategory(profiles, "fictional").map((item) => item.slug)).toEqual(["walter-white", "bruce-wayne"]);
    expect(filterProfilesByCategory(profiles, "historical_figure").map((item) => item.slug)).toEqual(["unknown-category"]);
    expect(filterProfilesByCategory(profiles, "all")).toHaveLength(4);
  });

  it("filters MBTI and Enneagram independently", () => {
    expect(filterProfilesByTyping(profiles, { mbti: "INTJ" }).map((item) => item.slug)).toEqual(["walter-white", "bruce-wayne"]);
    expect(filterProfilesByTyping(profiles, { enneagram: "5w6" }).map((item) => item.slug)).toEqual(["walter-white"]);
    expect(filterProfilesByTyping(profiles, { mbti: "INTJ", enneagram: "1w9" }).map((item) => item.slug)).toEqual([
      "bruce-wayne",
    ]);
  });

  it("builds category options with counts and graceful unknown labels", () => {
    expect(getProfileCategoryOptions(profiles)).toEqual([
      { value: "all", label: "All profiles", count: 4 },
      { value: "fictional", label: "Fictional", count: 2 },
      { value: "public_figure", label: "Public figures", count: 1 },
      { value: "historical_figure", label: "Historical Figure", count: 1 },
    ]);
  });

  it("detects active search, category, or typing filters", () => {
    expect(hasActiveProfileFilters({})).toBe(false);
    expect(hasActiveProfileFilters({ category: "all", type: "all" })).toBe(false);
    expect(hasActiveProfileFilters({ q: "joker" })).toBe(true);
    expect(hasActiveProfileFilters({ category: "fictional" })).toBe(true);
    expect(hasActiveProfileFilters({ mbti: "INTJ" })).toBe(true);
    expect(hasActiveProfileFilters({ enneagram: "5w6" })).toBe(true);
    expect(hasActiveProfileFilters({ type: "INTJ" })).toBe(true);
  });
});
