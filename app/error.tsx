"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page-shell flex min-h-[50vh] max-w-3xl items-center py-16">
      <div className="glass-panel border-wine/35 bg-wine/10 p-6">
        <p className="eyebrow text-red-200">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">PersonaMap hit a snag while loading this page.</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Try reloading the page. If the issue keeps happening, the app may be missing Supabase data or a route is
          temporarily unavailable.
        </p>
        <button
          onClick={() => reset()}
          className="primary-action mt-5"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
