import { calculateConsensus } from "@/lib/consensus";
import type {
  EvidenceCard,
  Profile,
  ProfileWithConsensus,
  TypeOption,
  TypingSystem,
  Vote,
} from "@/lib/types";

const now = "2026-01-01T00:00:00.000Z";

export const typingSystems: TypingSystem[] = [
  { id: "11111111-1111-4111-8111-111111111111", code: "MBTI", name: "Myers-Briggs Type Indicator" },
  { id: "22222222-2222-4222-8222-222222222222", code: "ENNEAGRAM", name: "Enneagram" },
];

const mbtiId = typingSystems[0].id;
const enneagramId = typingSystems[1].id;

const mbtiCodes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

const enneagramCodes = [
  "1w9",
  "1w2",
  "2w1",
  "2w3",
  "3w2",
  "3w4",
  "4w3",
  "4w5",
  "5w4",
  "5w6",
  "6w5",
  "6w7",
  "7w6",
  "7w8",
  "8w7",
  "8w9",
  "9w8",
  "9w1",
];

export const typeOptions: TypeOption[] = [
  ...mbtiCodes.map((code, index) => ({
    id: `33333333-3333-4333-8333-${String(index + 1).padStart(12, "0")}`,
    typing_system_id: mbtiId,
    code,
    label: code,
    description: null,
  })),
  ...enneagramCodes.map((code, index) => ({
    id: `44444444-4444-4444-8444-${String(index + 1).padStart(12, "0")}`,
    typing_system_id: enneagramId,
    code,
    label: code,
    description: null,
  })),
];

export const profiles: Profile[] = [
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    slug: "walter-white",
    name: "Walter White",
    category: "fictional",
    source_title: "Breaking Bad",
    description: "A chemistry teacher whose precision, pride, and long-game planning transform him into a criminal strategist.",
    image_url: "https://images.unsplash.com/photo-1535406208535-1429839cfd13?auto=format&fit=crop&w=900&q=80",
    created_at: now,
    updated_at: now,
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
    slug: "light-yagami",
    name: "Light Yagami",
    category: "fictional",
    source_title: "Death Note",
    description: "A brilliant student whose certainty hardens into control, secrecy, and ruthless long-range tactics.",
    image_url: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
    created_at: now,
    updated_at: now,
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3",
    slug: "lelouch-lamperouge",
    name: "Lelouch Lamperouge",
    category: "fictional",
    source_title: "Code Geass",
    description: "A theatrical tactician who uses systems, symbolism, and people to reshape political reality.",
    image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    created_at: now,
    updated_at: now,
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4",
    slug: "tony-stark",
    name: "Tony Stark",
    category: "fictional",
    source_title: "Marvel",
    description: "An inventive engineer driven by novelty, improvisation, and public reinvention.",
    image_url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    created_at: now,
    updated_at: now,
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5",
    slug: "sherlock-holmes",
    name: "Sherlock Holmes",
    category: "fictional",
    source_title: "Sherlock Holmes",
    description: "A detached investigator who prizes models, exact observation, and elegant explanations.",
    image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80",
    created_at: now,
    updated_at: now,
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa6",
    slug: "hermione-granger",
    name: "Hermione Granger",
    category: "fictional",
    source_title: "Harry Potter",
    description: "A disciplined, principled student who uses preparation and rules to protect the people she loves.",
    image_url: "https://images.unsplash.com/photo-1455885666463-9b6c1b96c1f3?auto=format&fit=crop&w=900&q=80",
    created_at: now,
    updated_at: now,
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa7",
    slug: "wednesday-addams",
    name: "Wednesday Addams",
    category: "fictional",
    source_title: "The Addams Family",
    description: "A severe, independent observer with a taste for restraint and darkly exact standards.",
    image_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=900&q=80",
    created_at: now,
    updated_at: now,
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa8",
    slug: "batman-bruce-wayne",
    name: "Batman / Bruce Wayne",
    category: "fictional",
    source_title: "DC Comics",
    description: "A vigilant strategist who channels trauma into discipline, contingency planning, and moral restraint.",
    image_url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
    created_at: now,
    updated_at: now,
  },
];

function optionId(code: string) {
  const option = typeOptions.find((item) => item.code === code);
  if (!option) throw new Error(`Missing option ${code}`);
  return option.id;
}

const profileTypeVotes: Array<[string, string, string[]]> = [
  ["walter-white", "MBTI", ["INTJ", "INTJ", "INTJ", "ENTJ", "INTP"]],
  ["walter-white", "ENNEAGRAM", ["5w6", "5w6", "3w4", "8w9"]],
  ["light-yagami", "MBTI", ["ENTJ", "ENTJ", "INTJ", "ENTJ", "ENTP"]],
  ["light-yagami", "ENNEAGRAM", ["1w2", "3w4", "1w2", "8w7"]],
  ["lelouch-lamperouge", "MBTI", ["ENTJ", "ENTJ", "ENFJ", "ENTJ"]],
  ["lelouch-lamperouge", "ENNEAGRAM", ["3w4", "3w4", "8w7"]],
  ["tony-stark", "MBTI", ["ENTP", "ENTP", "ENTP", "ESTP", "ENTJ"]],
  ["tony-stark", "ENNEAGRAM", ["7w8", "7w8", "3w4", "7w6"]],
  ["sherlock-holmes", "MBTI", ["INTP", "INTP", "ISTP", "INTJ"]],
  ["sherlock-holmes", "ENNEAGRAM", ["5w6", "5w6", "5w4"]],
  ["hermione-granger", "MBTI", ["ESTJ", "ISTJ", "ESTJ", "ENFJ"]],
  ["hermione-granger", "ENNEAGRAM", ["1w2", "1w2", "6w5"]],
  ["wednesday-addams", "MBTI", ["INTJ", "ISTP", "INTJ"]],
  ["wednesday-addams", "ENNEAGRAM", ["5w4", "4w5"]],
  ["batman-bruce-wayne", "MBTI", ["INTJ", "INTJ", "ISTJ", "INFJ"]],
  ["batman-bruce-wayne", "ENNEAGRAM", ["1w9", "6w5", "1w9"]],
];

export const votes: Vote[] = profileTypeVotes.flatMap(([slug, systemCode, codes], groupIndex) => {
  const profile = profiles.find((item) => item.slug === slug)!;
  const system = typingSystems.find((item) => item.code === systemCode)!;

  return codes.map((code, index) => ({
    id: `55555555-5555-4555-8555-${String(groupIndex * 20 + index + 1).padStart(12, "0")}`,
    profile_id: profile.id,
    user_id: `66666666-6666-4666-8666-${String(index + 1).padStart(12, "0")}`,
    typing_system_id: system.id,
    type_option_id: optionId(code),
    created_at: now,
    updated_at: now,
  }));
});

export const evidenceCards: EvidenceCard[] = [
  {
    id: "77777777-7777-4777-8777-777777777701",
    profile_id: profiles[0].id,
    user_id: "66666666-6666-4666-8666-000000000001",
    typing_system_id: mbtiId,
    type_option_id: optionId("INTJ"),
    title: "Long-range identity construction",
    body: "Walter repeatedly chooses strategies that preserve a private vision of competence and legacy, even when faster emotional repairs are available.",
    stance: "for",
    score: 18,
    created_at: now,
    updated_at: now,
    type_options: { code: "INTJ", label: "INTJ" },
  },
  {
    id: "77777777-7777-4777-8777-777777777702",
    profile_id: profiles[0].id,
    user_id: "66666666-6666-4666-8666-000000000002",
    typing_system_id: mbtiId,
    type_option_id: optionId("ENTJ"),
    title: "Direct control under pressure",
    body: "His best moments often involve asserting command, structuring people around goals, and measuring success through external leverage.",
    stance: "against",
    score: 9,
    created_at: now,
    updated_at: now,
    type_options: { code: "ENTJ", label: "ENTJ" },
  },
  {
    id: "77777777-7777-4777-8777-777777777703",
    profile_id: profiles[3].id,
    user_id: "66666666-6666-4666-8666-000000000003",
    typing_system_id: mbtiId,
    type_option_id: optionId("ENTP"),
    title: "Prototype-first problem solving",
    body: "Tony explores possibilities by building, sparring, testing limits, and revising quickly instead of protecting one fixed master plan.",
    stance: "for",
    score: 21,
    created_at: now,
    updated_at: now,
    type_options: { code: "ENTP", label: "ENTP" },
  },
];

export function buildProfilesWithConsensus(sourceProfiles = profiles): ProfileWithConsensus[] {
  return sourceProfiles.map((profile) => {
    const consensus = typingSystems.map((system) =>
      calculateConsensus({
        profileId: profile.id,
        systemCode: system.code,
        typeOptions: typeOptions.filter((option) => option.typing_system_id === system.id),
        votes: votes.filter((vote) => vote.profile_id === profile.id && vote.typing_system_id === system.id),
      }),
    );

    return { ...profile, consensus };
  });
}
