"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { submitEvidenceAction } from "@/app/actions";
import { SelectControl } from "@/components/select-control";
import type { ProfileWithConsensus, TypeOption, TypingSystem } from "@/lib/types";

const visibleSystemOrder = ["MBTI", "ENNEAGRAM"];

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
  const orderedSystems = useMemo(
    () =>
      [...typingSystems].sort((a, b) => {
        const aIndex = visibleSystemOrder.includes(a.code) ? visibleSystemOrder.indexOf(a.code) : visibleSystemOrder.length;
        const bIndex = visibleSystemOrder.includes(b.code) ? visibleSystemOrder.indexOf(b.code) : visibleSystemOrder.length;
        return aIndex - bIndex;
      }),
    [typingSystems],
  );
  const defaultSystem = orderedSystems.find((system) => system.code === "MBTI") ?? orderedSystems[0];
  const [selectedSystemId, setSelectedSystemId] = useState(defaultSystem?.id ?? orderedSystems[0]?.id ?? "");
  const visibleOptions = useMemo(
    () => typeOptions.filter((option) => option.typing_system_id === selectedSystemId),
    [selectedSystemId, typeOptions],
  );

  return (
    <section className="glass-panel p-5">
      <h2 className="text-xl font-semibold text-ink">Add evidence</h2>
      <p className="mt-1 text-sm leading-6 text-ink/55">
        Add a short argument tied to a specific system and type.
      </p>
      <form action={formAction} className="mt-5 grid gap-4">
        <input type="hidden" name="profileId" value={profile.id} />
        <input type="hidden" name="profileSlug" value={profile.slug} />
        <div className="grid gap-4 md:grid-cols-3">
          <SelectControl
            name="typingSystemId"
            label="System"
            value={selectedSystemId}
            onChange={(event) => setSelectedSystemId(event.target.value)}
          >
            {orderedSystems.map((system) => (
              <option key={system.id} value={system.id}>
                {system.code}
              </option>
            ))}
          </SelectControl>
          <SelectControl name="typeOptionId" label="Type">
            {visibleOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.code}
              </option>
            ))}
          </SelectControl>
          <SelectControl name="stance" label="Stance">
            <option value="for">For</option>
            <option value="against">Against</option>
          </SelectControl>
        </div>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Title
          <input
            name="title"
            required
            className="field-control"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Body
          <textarea
            name="body"
            rows={5}
            required
            placeholder="What did they say or do that supports this typing?"
            className="field-control min-h-32 py-3"
          />
        </label>
        {state.message ? (
          <p className={state.ok ? "text-sm text-emerald-300" : "text-sm text-wine"}>{state.message}</p>
        ) : null}
        <button
          disabled={pending}
          className="primary-action w-fit"
        >
          {pending ? "Posting..." : "Post evidence"}
        </button>
      </form>
    </section>
  );
}
