"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { submitEvidenceAction } from "@/app/actions";
import type { ProfileWithConsensus, TypeOption, TypingSystem } from "@/lib/types";

export function EvidenceForm({
  profile,
  typingSystems,
  typeOptions,
}: {
  profile: ProfileWithConsensus;
  typingSystems: TypingSystem[];
  typeOptions: TypeOption[];
}) {
  const [state, formAction, pending] = useActionState(submitEvidenceAction, { ok: false, message: "" });
  const defaultSystem = typingSystems.find((system) => system.code === "MBTI") ?? typingSystems[0];
  const [selectedSystemId, setSelectedSystemId] = useState(defaultSystem?.id ?? typingSystems[0]?.id ?? "");
  const visibleOptions = useMemo(
    () => typeOptions.filter((option) => option.typing_system_id === selectedSystemId),
    [selectedSystemId, typeOptions],
  );

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-xl font-semibold text-ink">Add evidence</h2>
      <p className="mt-1 text-sm leading-6 text-ink/55">
        Add a short argument that explains why this type should move up, down, or stay put.
      </p>
      <form action={formAction} className="mt-5 grid gap-4">
        <input type="hidden" name="profileId" value={profile.id} />
        <input type="hidden" name="profileSlug" value={profile.slug} />
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium text-ink">
            System
            <select
              name="typingSystemId"
              value={selectedSystemId}
              onChange={(event) => setSelectedSystemId(event.target.value)}
              className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
            >
              {typingSystems.map((system) => (
                <option key={system.id} value={system.id}>
                  {system.code}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Type
            <select
              name="typeOptionId"
              className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
            >
              {visibleOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.code}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Stance
            <select name="stance" className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass">
              <option value="for">For</option>
              <option value="against">Against</option>
            </select>
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Title
          <input
            name="title"
            required
            className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Body
          <textarea
            name="body"
            rows={5}
            required
            placeholder="What did they say or do that supports this typing?"
            className="rounded-md border border-white/10 bg-coal px-3 py-3 text-ink outline-none focus:border-brass"
          />
        </label>
        {state.message ? (
          <p className={state.ok ? "text-sm text-emerald-300" : "text-sm text-wine"}>{state.message}</p>
        ) : null}
        <button
          disabled={pending}
          className="inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-coal transition hover:bg-brass disabled:opacity-60"
        >
          {pending ? "Posting..." : "Post evidence"}
        </button>
      </form>
    </section>
  );
}
