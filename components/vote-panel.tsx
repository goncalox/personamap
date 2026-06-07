"use client";

import { useMemo } from "react";
import { useActionState } from "react";
import { submitVoteAction } from "@/app/actions";
import type { ProfileWithConsensus, TypeOption, TypingSystem } from "@/lib/types";

export function VotePanel({
  profile,
  typingSystems,
  typeOptions,
}: {
  profile: ProfileWithConsensus;
  typingSystems: TypingSystem[];
  typeOptions: TypeOption[];
}) {
  const [state, formAction, pending] = useActionState(submitVoteAction, { ok: false, message: "" });
  const visibleSystems = useMemo(
    () => typingSystems.filter((system) => system.code === "MBTI" || system.code === "ENNEAGRAM"),
    [typingSystems],
  );

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-xl font-semibold text-ink">Cast a vote</h2>
      <p className="mt-1 text-sm text-ink/55">Voting is protected by Supabase auth once env vars are configured.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {visibleSystems.map((system) => (
          <form key={system.id} action={formAction} className="rounded-lg border border-white/10 bg-black/20 p-4">
            <input type="hidden" name="profileId" value={profile.id} />
            <input type="hidden" name="profileSlug" value={profile.slug} />
            <input type="hidden" name="typingSystemId" value={system.id} />
            <label className="text-sm font-medium text-ink" htmlFor={`vote-${system.code}`}>
              {system.code}
            </label>
            <select
              id={`vote-${system.code}`}
              name="typeOptionId"
              className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-coal px-3 text-sm text-ink outline-none transition focus:border-brass"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Choose type
              </option>
              {typeOptions
                .filter((option) => option.typing_system_id === system.id)
                .map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.code}
                  </option>
                ))}
            </select>
            <button
              disabled={pending}
              className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md bg-brass px-4 text-sm font-semibold text-coal transition hover:bg-ink disabled:opacity-60"
            >
              Save {system.code}
            </button>
          </form>
        ))}
      </div>
      {state.message ? (
        <p className={state.ok ? "mt-4 text-sm text-emerald-300" : "mt-4 text-sm text-wine"}>{state.message}</p>
      ) : null}
    </section>
  );
}
