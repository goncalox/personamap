import { z } from "zod";
import type { ProtectedVotePayload } from "@/lib/protected-voting";

const systemVoteSchema = z
  .object({
    profileId: z.string().uuid().optional(),
    profileSlug: z.string().trim().min(1).optional(),
    systemCode: z.string().trim().min(1),
    typeCode: z.string().trim().min(1),
  })
  .refine((value) => value.profileId || value.profileSlug, {
    message: "Provide profileId or profileSlug.",
    path: ["profileSlug"],
  });

export type SystemVoteDependencies = {
  systemUserId: string;
  findProfile: (input: { profileId?: string; profileSlug?: string }) => Promise<{ id: string; slug: string } | null>;
  findTypingSystem: (systemCode: string) => Promise<{ id: string; code: string } | null>;
  findTypeOption: (input: {
    typingSystemId: string;
    typeCode: string;
  }) => Promise<{ id: string; code: string; typing_system_id: string } | null>;
  upsertVote: (payload: ProtectedVotePayload) => Promise<{ error: { message: string } | null }>;
  now?: () => Date;
};

export type SystemVoteResult =
  | { ok: true; message: string; profileSlug: string; systemCode: string; typeCode: string }
  | { ok: false; message: string; status: number };

export async function saveSystemVote(
  rawInput: unknown,
  dependencies: SystemVoteDependencies,
): Promise<SystemVoteResult> {
  const parsed = systemVoteSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid vote.", status: 400 };
  }

  const profile = await dependencies.findProfile({
    profileId: parsed.data.profileId,
    profileSlug: parsed.data.profileSlug,
  });
  if (!profile) {
    return { ok: false, message: "Profile not found.", status: 404 };
  }

  const systemCode = parsed.data.systemCode.toUpperCase();
  const typingSystem = await dependencies.findTypingSystem(systemCode);
  if (!typingSystem) {
    return { ok: false, message: "Typing system not found.", status: 404 };
  }

  const typeOption = await dependencies.findTypeOption({
    typingSystemId: typingSystem.id,
    typeCode: parsed.data.typeCode,
  });
  if (!typeOption || typeOption.typing_system_id !== typingSystem.id) {
    return { ok: false, message: "Type option not found for this system.", status: 404 };
  }

  const { error } = await dependencies.upsertVote({
    profile_id: profile.id,
    user_id: dependencies.systemUserId,
    typing_system_id: typingSystem.id,
    type_option_id: typeOption.id,
    updated_at: (dependencies.now?.() ?? new Date()).toISOString(),
  });

  if (error) return { ok: false, message: error.message, status: 500 };

  return {
    ok: true,
    message: "Initial typing saved.",
    profileSlug: profile.slug,
    systemCode: typingSystem.code,
    typeCode: typeOption.code,
  };
}
