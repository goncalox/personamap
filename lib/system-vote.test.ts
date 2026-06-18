import { describe, expect, it, vi } from "vitest";
import { saveSystemVote, type SystemVoteDependencies } from "@/lib/system-vote";

const dependencies = (overrides: Partial<SystemVoteDependencies> = {}): SystemVoteDependencies => ({
  systemUserId: "10000000-0000-4000-8000-000000000001",
  findProfile: vi.fn(async () => ({ id: "20000000-0000-4000-8000-000000000001", slug: "bruce-wayne" })),
  findTypingSystem: vi.fn(async () => ({ id: "30000000-0000-4000-8000-000000000001", code: "MBTI" })),
  findTypeOption: vi.fn(async () => ({
    id: "40000000-0000-4000-8000-000000000001",
    code: "INTJ",
    typing_system_id: "30000000-0000-4000-8000-000000000001",
  })),
  upsertVote: vi.fn(async () => ({ error: null })),
  now: () => new Date("2026-01-01T00:00:00.000Z"),
  ...overrides,
});

describe("saveSystemVote", () => {
  it("upserts a system-owned vote for a profile slug and type code", async () => {
    const deps = dependencies();
    const result = await saveSystemVote(
      {
        profileSlug: "bruce-wayne",
        systemCode: "mbti",
        typeCode: "INTJ",
      },
      deps,
    );

    expect(result).toEqual({
      ok: true,
      message: "Initial typing saved.",
      profileSlug: "bruce-wayne",
      systemCode: "MBTI",
      typeCode: "INTJ",
    });
    expect(deps.findTypingSystem).toHaveBeenCalledWith("MBTI");
    expect(deps.upsertVote).toHaveBeenCalledWith({
      profile_id: "20000000-0000-4000-8000-000000000001",
      user_id: "10000000-0000-4000-8000-000000000001",
      typing_system_id: "30000000-0000-4000-8000-000000000001",
      type_option_id: "40000000-0000-4000-8000-000000000001",
      updated_at: "2026-01-01T00:00:00.000Z",
    });
  });

  it("rejects missing profile identifiers before writing", async () => {
    const deps = dependencies();
    const result = await saveSystemVote({ systemCode: "MBTI", typeCode: "INTJ" }, deps);

    expect(result).toEqual({ ok: false, message: "Provide profileId or profileSlug.", status: 400 });
    expect(deps.upsertVote).not.toHaveBeenCalled();
  });

  it("rejects type options that do not belong to the requested system", async () => {
    const deps = dependencies({
      findTypeOption: vi.fn(async () => ({
        id: "40000000-0000-4000-8000-000000000001",
        code: "INTJ",
        typing_system_id: "99999999-9999-4999-8999-999999999999",
      })),
    });
    const result = await saveSystemVote({ profileSlug: "bruce-wayne", systemCode: "MBTI", typeCode: "INTJ" }, deps);

    expect(result).toEqual({ ok: false, message: "Type option not found for this system.", status: 404 });
    expect(deps.upsertVote).not.toHaveBeenCalled();
  });
});
