import { voteSchema } from "@/lib/validations";

export type ActionState = {
  ok: boolean;
  message: string;
};

export type ProtectedVotePayload = {
  profile_id: string;
  user_id: string;
  typing_system_id: string;
  type_option_id: string;
  updated_at: string;
};

export type ProtectedVoteDependencies = {
  getCurrentUser: () => Promise<{ id: string } | null>;
  getTypeOption: (typeOptionId: string) => Promise<{ id: string; typing_system_id: string } | null>;
  upsertVote: (payload: ProtectedVotePayload) => Promise<{ error: { message: string } | null }>;
  now?: () => Date;
};

export async function saveProtectedVote(
  rawInput: unknown,
  dependencies: ProtectedVoteDependencies,
): Promise<ActionState> {
  const parsed = voteSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid typing suggestion." };
  }

  const user = await dependencies.getCurrentUser();
  if (!user) {
    return { ok: false, message: "Log in to suggest a type." };
  }

  const typeOption = await dependencies.getTypeOption(parsed.data.typeOptionId);
  if (!typeOption || typeOption.typing_system_id !== parsed.data.typingSystemId) {
    return { ok: false, message: "Selected type does not belong to this typing system." };
  }

  const { error } = await dependencies.upsertVote({
    profile_id: parsed.data.profileId,
    user_id: user.id,
    typing_system_id: parsed.data.typingSystemId,
    type_option_id: parsed.data.typeOptionId,
    updated_at: (dependencies.now?.() ?? new Date()).toISOString(),
  });

  if (error) return { ok: false, message: error.message };

  return { ok: true, message: "Typing suggestion saved." };
}
