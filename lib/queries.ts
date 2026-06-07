import { calculateConsensus } from "@/lib/consensus";
import { buildProfilesWithConsensus, evidenceCards, profiles, typeOptions, typingSystems, votes } from "@/lib/seed-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PostgrestError } from "@supabase/supabase-js";
import type { EvidenceCard, Profile, ProfileWithConsensus, TypeOption, TypingSystem, Vote } from "@/lib/types";

function logSupabaseQueryError(context: {
  scope: string;
  table: string;
  slug?: string;
  profileId?: string;
  details?: Record<string, unknown>;
}, error: PostgrestError) {
  console.error("[supabase-query-error]", {
    ...context,
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getTypingData(): Promise<{ typingSystems: TypingSystem[]; typeOptions: TypeOption[] }> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { typingSystems, typeOptions };

  const [{ data: systems, error: systemsError }, { data: options, error: optionsError }] = await Promise.all([
    supabase.from("typing_systems").select("*").order("code"),
    supabase.from("type_options").select("*").order("code"),
  ]);

  if (systemsError) {
    logSupabaseQueryError({ scope: "getTypingData", table: "typing_systems" }, systemsError);
    throw new Error("Failed to load typing systems.");
  }
  if (optionsError) {
    logSupabaseQueryError({ scope: "getTypingData", table: "type_options" }, optionsError);
    throw new Error("Failed to load type options.");
  }

  return {
    typingSystems: (systems as TypingSystem[] | null) ?? typingSystems,
    typeOptions: (options as TypeOption[] | null) ?? typeOptions,
  };
}

export async function getProfiles(params?: {
  q?: string;
  category?: string;
  system?: string;
  type?: string;
}): Promise<ProfileWithConsensus[]> {
  const supabase = await createSupabaseServerClient();
  let loadedProfiles: Profile[] = profiles;
  let loadedVotes: Vote[] = votes;
  let loadedSystems: TypingSystem[] = typingSystems;
  let loadedOptions: TypeOption[] = typeOptions;

  if (supabase) {
    const [
      { data: profileRows, error: profileError },
      { data: voteRows, error: voteError },
      { data: systems, error: systemsError },
      { data: options, error: optionsError },
    ] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("votes").select("*"),
      supabase.from("typing_systems").select("*"),
      supabase.from("type_options").select("*"),
    ]);

    if (profileError) {
      logSupabaseQueryError({ scope: "getProfiles", table: "profiles", details: params }, profileError);
      throw new Error("Failed to load profiles.");
    }
    if (voteError) {
      logSupabaseQueryError({ scope: "getProfiles", table: "votes", details: params }, voteError);
      throw new Error("Failed to load votes.");
    }
    if (systemsError) {
      logSupabaseQueryError({ scope: "getProfiles", table: "typing_systems", details: params }, systemsError);
      throw new Error("Failed to load typing systems.");
    }
    if (optionsError) {
      logSupabaseQueryError({ scope: "getProfiles", table: "type_options", details: params }, optionsError);
      throw new Error("Failed to load type options.");
    }

    loadedProfiles = (profileRows as Profile[] | null) ?? profiles;
    loadedVotes = (voteRows as Vote[] | null) ?? votes;
    loadedSystems = (systems as TypingSystem[] | null) ?? typingSystems;
    loadedOptions = (options as TypeOption[] | null) ?? typeOptions;
  }

  const normalizedQuery = params?.q?.trim().toLowerCase();
  const filteredProfiles = loadedProfiles.filter((profile) => {
    const matchesSearch =
      !normalizedQuery ||
      profile.name.toLowerCase().includes(normalizedQuery) ||
      profile.source_title?.toLowerCase().includes(normalizedQuery);
    const matchesCategory = !params?.category || params.category === "all" || profile.category === params.category;
    return matchesSearch && matchesCategory;
  });

  const withConsensus = filteredProfiles.map((profile) => ({
    ...profile,
    consensus: loadedSystems.map((system) =>
      calculateConsensus({
        profileId: profile.id,
        systemCode: system.code,
        typeOptions: loadedOptions.filter((option) => option.typing_system_id === system.id),
        votes: loadedVotes.filter((vote) => vote.profile_id === profile.id && vote.typing_system_id === system.id),
      }),
    ),
  }));

  if (!params?.type || params.type === "all") return withConsensus;

  return withConsensus.filter((profile) =>
    profile.consensus.some(
      (consensus) =>
        (!params.system || params.system === "all" || consensus.systemCode === params.system) &&
        consensus.consensusCode === params.type,
    ),
  );
}

export async function getFeaturedProfiles() {
  const allProfiles = await getProfiles();
  return {
    featured: allProfiles.slice(0, 4),
    debated: [...allProfiles]
      .sort((a, b) => {
        const aMbti = a.consensus.find((item) => item.systemCode === "MBTI");
        const bMbti = b.consensus.find((item) => item.systemCode === "MBTI");
        return (aMbti?.confidence ?? 100) - (bMbti?.confidence ?? 100);
      })
      .slice(0, 3),
  };
}

export async function getProfileBySlug(slug: string) {
  try {
    const allProfiles = await getProfiles();
    return allProfiles.find((profile) => profile.slug === slug) ?? null;
  } catch (error) {
    console.error("[profile-detail-load-error]", {
      scope: "getProfileBySlug",
      slug,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export async function getEvidenceForProfile(profileId: string, context?: { slug?: string }): Promise<EvidenceCard[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return evidenceCards.filter((card) => card.profile_id === profileId);

  const { data, error } = await supabase
    .from("evidence_cards")
    .select("*")
    .eq("profile_id", profileId)
    .order("score", { ascending: false });

  if (error) {
    logSupabaseQueryError(
      {
        scope: "getEvidenceForProfile",
        table: "evidence_cards",
        slug: context?.slug,
        profileId,
      },
      error,
    );
    throw new Error("Failed to load evidence cards.");
  }
  return (data as EvidenceCard[] | null) ?? evidenceCards.filter((card) => card.profile_id === profileId);
}

export function getFallbackProfiles() {
  return buildProfilesWithConsensus();
}
