"use client";

import { useMemo } from "react";
import { useActionState } from "react";
import { submitVoteAction } from "@/app/actions";
import { SelectControl } from "@/components/select-control";
import { getConsensusDisplay } from "@/lib/profile-display";
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
      <h2 className="text-xl font-semibold text-ink">Suggest a typing</h2>
      <p className="mt-1 text-sm leading-6 text-ink/55">
        Choose the type you think fits best. Signed-in suggestions can help the profile settle over time.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {visibleSystems.map((system) => {
          const consensus = profile.consensus.find((item) => item.systemCode === system.code);
          const display = getConsensusDisplay(consensus);

          return (
            <div key={`${system.id}-summary`} className="rounded-md border border-white/10 bg-black/20 p-3 text-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-ink/45">{system.code}</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="font-semibold text-ink">{display.code}</span>
                <span className="text-ink/55">{display.confidenceLabel}</span>
              </div>
              <p className="mt-2 text-xs text-ink/45">{display.status}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {visibleSystems.map((system) => (
          <form key={system.id} action={formAction} className="rounded-lg border border-white/10 bg-black/20 p-4">
            <input type="hidden" name="profileId" value={profile.id} />
            <input type="hidden" name="profileSlug" value={profile.slug} />
            <input type="hidden" name="typingSystemId" value={system.id} />
            <SelectControl
              id={`vote-${system.code}`}
              name="typeOptionId"
              label={system.code}
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
            </SelectControl>
            <button
              disabled={pending}
              className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md bg-brass px-4 text-sm font-semibold text-coal transition hover:bg-ink disabled:opacity-60"
              >
              Save {system.code}
            </button>
            <p className="mt-2 text-xs leading-5 text-ink/45">
              Tip: save one system at a time. MBTI and Enneagram are tracked separately.
            </p>
          </form>
        ))}
      </div>
      {state.message ? (
        <p className={state.ok ? "mt-4 text-sm text-emerald-300" : "mt-4 text-sm text-wine"}>{state.message}</p>
      ) : null}
    </section>
  );
}
