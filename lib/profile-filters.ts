import type { ProfileWithConsensus } from "@/lib/types";
import { formatCategory } from "@/lib/utils";

const defaultCategories = [
  { value: "fictional", label: "Fictional" },
  { value: "public_figure", label: "Public figures" },
] as const;

export type ProfileFilterParams = {
  q?: string;
  category?: string;
  mbti?: string;
  enneagram?: string;
  system?: string;
  type?: string;
};

export type ProfileCategoryOption = {
  value: string;
  label: string;
  count: number;
};

export function normalizeProfileCategory(category: string | null | undefined) {
  const normalized = category?.trim();
  return normalized && normalized !== "all" ? normalized : "all";
}

export function normalizeProfileType(type: string | null | undefined) {
  const normalized = type?.trim();
  return normalized && normalized !== "all" ? normalized : "all";
}

export function filterProfilesByCategory(profiles: ProfileWithConsensus[], category: string | null | undefined) {
  const normalizedCategory = normalizeProfileCategory(category);
  if (normalizedCategory === "all") return profiles;

  return profiles.filter((profile) => profile.category === normalizedCategory);
}

export function filterProfilesByTyping(profiles: ProfileWithConsensus[], params: Pick<ProfileFilterParams, "mbti" | "enneagram">) {
  const mbti = normalizeProfileType(params.mbti);
  const enneagram = normalizeProfileType(params.enneagram);

  return profiles.filter((profile) => {
    const matchesMbti =
      mbti === "all" || profile.consensus.some((consensus) => consensus.systemCode === "MBTI" && consensus.consensusCode === mbti);
    const matchesEnneagram =
      enneagram === "all" ||
      profile.consensus.some((consensus) => consensus.systemCode === "ENNEAGRAM" && consensus.consensusCode === enneagram);

    return matchesMbti && matchesEnneagram;
  });
}

export function getProfileCategoryOptions(profiles: ProfileWithConsensus[]): ProfileCategoryOption[] {
  const counts = new Map<string, number>();
  for (const profile of profiles) {
    counts.set(profile.category, (counts.get(profile.category) ?? 0) + 1);
  }

  const defaultOptions = defaultCategories.map((category) => ({
    ...category,
    count: counts.get(category.value) ?? 0,
  }));
  const defaultValues = new Set<string>(defaultCategories.map((category) => category.value));
  const extraOptions = Array.from(counts.entries())
    .filter(([category]) => !defaultValues.has(category))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, count]) => ({
      value: category,
      label: formatCategory(category),
      count,
    }));

  return [{ value: "all", label: "All profiles", count: profiles.length }, ...defaultOptions, ...extraOptions];
}

export function hasActiveProfileFilters(params: ProfileFilterParams) {
  return Boolean(
    params.q?.trim() ||
      normalizeProfileCategory(params.category) !== "all" ||
      normalizeProfileType(params.mbti) !== "all" ||
      normalizeProfileType(params.enneagram) !== "all" ||
      (params.type && params.type !== "all") ||
      (params.system && params.system !== "all"),
  );
}
