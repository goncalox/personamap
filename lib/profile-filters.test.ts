import { describe, expect, it } from "vitest";
import {
  filterProfilesByCategory,
  getProfileCategoryOptions,
  hasActiveProfileFilters,
  normalizeProfileCategory,
} from "@/lib/profile-filters";
import type { ProfileWithConsensus } from "@/lib/types";

function profile(id: string, category: string): ProfileWithConsensus {
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
    consensus: [],
  };
}

describe("profile filters", () => {
  const profiles = [
    profile("walter-white", "fictional"),
    profile("bruce-wayne", "fictional"),
    profile("carl-jung", "public_figure"),
    profile("unknown-category", "historical_figure"),
  ];

  it("normalizes empty category filters to all", () => {
    expect(normalizeProfileCategory(undefined)).toBe("all");
    expect(normalizeProfileCategory("")).toBe("all");
    expect(normalizeProfileCategory("all")).toBe("all");
    expect(normalizeProfileCategory("fictional")).toBe("fictional");
  });

  it("filters profiles by category without removing unknown categories from all", () => {
    expect(filterProfilesByCategory(profiles, "fictional").map((item) => item.slug)).toEqual(["walter-white", "bruce-wayne"]);
    expect(filterProfilesByCategory(profiles, "historical_figure").map((item) => item.slug)).toEqual(["unknown-category"]);
    expect(filterProfilesByCategory(profiles, "all")).toHaveLength(4);
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
    expect(hasActiveProfileFilters({ type: "INTJ" })).toBe(true);
  });
});
