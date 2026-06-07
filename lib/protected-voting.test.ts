import { describe, expect, it, vi } from "vitest";
import { saveProtectedVote, type ProtectedVoteDependencies } from "@/lib/protected-voting";

const input = {
  profileId: "10000000-0000-4000-8000-000000000001",
  typingSystemId: "20000000-0000-4000-8000-000000000001",
  typeOptionId: "30000000-0000-4000-8000-000000000001",
};

function dependencies(overrides: Partial<ProtectedVoteDependencies> = {}): ProtectedVoteDependencies {
  return {
    getCurrentUser: vi.fn(async () => ({ id: "40000000-0000-4000-8000-000000000001" })),
    getTypeOption: vi.fn(async () => ({
      id: input.typeOptionId,
      typing_system_id: input.typingSystemId,
    })),
    upsertVote: vi.fn(async () => ({ error: null })),
    now: () => new Date("2026-06-07T12:00:00.000Z"),
    ...overrides,
  };
}

describe("saveProtectedVote", () => {
  it("rejects unauthenticated users before reading options or writing votes", async () => {
    const deps = dependencies({
      getCurrentUser: vi.fn(async () => null),
      getTypeOption: vi.fn(async () => {
        throw new Error("should not read type options");
      }),
      upsertVote: vi.fn(async () => {
        throw new Error("should not write votes");
      }),
    });

    const result = await saveProtectedVote(input, deps);

    expect(result).toEqual({ ok: false, message: "Log in to vote." });
    expect(deps.getTypeOption).not.toHaveBeenCalled();
    expect(deps.upsertVote).not.toHaveBeenCalled();
  });

  it("rejects type options that do not belong to the selected typing system", async () => {
    const deps = dependencies({
      getTypeOption: vi.fn(async () => ({
        id: input.typeOptionId,
        typing_system_id: "20000000-0000-4000-8000-000000000999",
      })),
    });

    const result = await saveProtectedVote(input, deps);

    expect(result).toEqual({
      ok: false,
      message: "Selected type does not belong to this typing system.",
    });
    expect(deps.upsertVote).not.toHaveBeenCalled();
  });

  it("writes the vote with Supabase snake_case columns for authenticated users", async () => {
    const deps = dependencies();

    const result = await saveProtectedVote(input, deps);

    expect(result).toEqual({ ok: true, message: "Vote saved." });
    expect(deps.upsertVote).toHaveBeenCalledWith({
      profile_id: input.profileId,
      user_id: "40000000-0000-4000-8000-000000000001",
      typing_system_id: input.typingSystemId,
      type_option_id: input.typeOptionId,
      updated_at: "2026-06-07T12:00:00.000Z",
    });
  });

  it("does not touch auth or Supabase when the submitted ids are invalid", async () => {
    const deps = dependencies();

    const result = await saveProtectedVote({ ...input, profileId: "not-a-uuid" }, deps);

    expect(result.ok).toBe(false);
    expect(deps.getCurrentUser).not.toHaveBeenCalled();
    expect(deps.upsertVote).not.toHaveBeenCalled();
  });
});
