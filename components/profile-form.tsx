"use client";

import { useActionState, useMemo, useState } from "react";
import { createProfileAction } from "@/app/actions";
import { SelectControl } from "@/components/select-control";
import { slugify } from "@/lib/utils";

export function ProfileForm() {
  const [state, formAction, pending] = useActionState(createProfileAction, { ok: false, message: "" });
  const [name, setName] = useState("");
  const [manualSlug, setManualSlug] = useState("");
  const generatedSlug = useMemo(() => slugify(name), [name]);
  const slug = manualSlug || generatedSlug;

  return (
    <form action={formAction} className="glass-panel grid gap-5 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Name
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="Walter White"
            className="field-control"
          />
          <p className="text-xs leading-5 text-ink/45">Use the character or public figure name people will search for.</p>
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Slug
          <input
            name="slug"
            value={slug}
            onChange={(event) => setManualSlug(slugify(event.target.value))}
            required
            placeholder="walter-white"
            className="field-control"
          />
          <p className="text-xs leading-5 text-ink/45">This becomes the profile URL. Letters, numbers, and hyphens only.</p>
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <SelectControl
          name="category"
          label="Category"
          helper="Pick fictional for characters and public figure for real people."
        >
          <option value="fictional">Fictional</option>
          <option value="public_figure">Public figure</option>
        </SelectControl>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Source title
          <input
            name="source_title"
            placeholder="Breaking Bad"
            className="field-control"
          />
          <p className="text-xs leading-5 text-ink/45">The book, show, movie, or public context this person is known for.</p>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-ink">
        Image URL
        <input
          name="image_url"
          type="url"
          placeholder="https://..."
          className="field-control"
        />
        <p className="text-xs leading-5 text-ink/45">Optional. A direct image URL works best.</p>
      </label>
      <label className="grid gap-2 text-sm font-medium text-ink">
        Description
        <textarea
          name="description"
          rows={6}
          placeholder="Optional. Add a short summary if helpful."
          className="field-control min-h-36 py-3"
        />
        <p className="text-xs leading-5 text-ink/45">
          Optional. Leave blank if the profile is just getting started and let the community add context later.
        </p>
      </label>
      {state.message ? (
        <p
          role="status"
          className={
            state.ok
              ? "rounded-md border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-200"
              : "rounded-md border border-wine/35 bg-wine/10 px-3 py-2 text-sm text-red-200"
          }
        >
          {state.message}
        </p>
      ) : null}
      <button
        disabled={pending}
        className="primary-action w-fit"
      >
        {pending ? "Creating..." : "Create profile"}
      </button>
    </form>
  );
}
