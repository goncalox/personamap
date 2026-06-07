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
            className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Slug
          <input
            name="slug"
            value={slug}
            onChange={(event) => setManualSlug(slugify(event.target.value))}
            required
            className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
          />
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Category
          <select name="category" className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass">
            <option value="fictional">Fictional</option>
            <option value="public_figure">Public figure</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Source title
          <input
            name="source_title"
            className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-ink">
        Image URL
        <input
          name="image_url"
          type="url"
          className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-ink">
        Description
        <textarea
          name="description"
          rows={6}
          required
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
        {pending ? "Creating..." : "Create profile"}
      </button>
    </form>
  );
}
