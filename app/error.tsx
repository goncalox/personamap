"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-3xl items-center px-4 py-16 sm:px-6">
      <div className="rounded-lg border border-wine/40 bg-wine/10 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-wine">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">PersonaMap hit a snag while loading this page.</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Try reloading the page. If the issue keeps happening, the app may be missing Supabase data or a route is
          temporarily unavailable.
        </p>
        <button
          onClick={() => reset()}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-coal transition hover:bg-brass"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
