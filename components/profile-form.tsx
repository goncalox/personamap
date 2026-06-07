"use client";

import { useActionState, useMemo, useState } from "react";
import { createProfileAction } from "@/app/actions";
import { slugify } from "@/lib/utils";

export function ProfileForm() {
  const [state, formAction, pending] = useActionState(createProfileAction, { ok: false, message: "" });
  const [name, setName] = useState("");
  const [manualSlug, setManualSlug] = useState("");
  const generatedSlug = useMemo(() => slugify(name), [name]);
  const slug = manualSlug || generatedSlug;

  return (
    <form action={formAction} className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-glow">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Name
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="Walter White"
            className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
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
            className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
          />
          <p className="text-xs leading-5 text-ink/45">This becomes the profile URL. Letters, numbers, and hyphens only.</p>
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Category
          <select name="category" className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass">
            <option value="fictional">Fictional</option>
            <option value="public_figure">Public figure</option>
          </select>
          <p className="text-xs leading-5 text-ink/45">Pick fictional for characters and public figure for real people.</p>
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Source title
          <input
            name="source_title"
            placeholder="Breaking Bad"
            className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
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
          className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
        />
        <p className="text-xs leading-5 text-ink/45">Optional. A direct image URL works best.</p>
      </label>
      <label className="grid gap-2 text-sm font-medium text-ink">
        Description
        <textarea
          name="description"
          rows={6}
          required
          placeholder="A short summary of why people are debating this profile."
          className="rounded-md border border-white/10 bg-coal px-3 py-3 text-ink outline-none focus:border-brass"
        />
        <p className="text-xs leading-5 text-ink/45">At least 20 characters. Add enough context for a newcomer to understand the debate.</p>
      </label>
      {state.message ? (
        <p role="status" className={state.ok ? "text-sm text-emerald-300" : "text-sm text-wine"}>
          {state.message}
        </p>
      ) : null}
      <button
        disabled={pending}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-coal transition hover:bg-brass disabled:opacity-60"
      >
        {pending ? "Creating..." : "Create profile"}
      </button>
    </form>
  );
}
