import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 py-16 sm:px-6">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brass">Not found</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">That page does not exist.</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          The profile or route may have moved, or the slug may not exist yet.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/profiles" className="inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-coal transition hover:bg-brass">
            Browse profiles
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-ink transition hover:border-brass hover:text-brass">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
