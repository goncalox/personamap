import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell flex min-h-[60vh] max-w-3xl items-center py-16">
      <div className="glass-panel p-6">
        <p className="eyebrow">Not found</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">That page does not exist.</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          The profile or route may have moved, or the slug may not exist yet.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/profiles" className="primary-action">
            Browse profiles
          </Link>
          <Link href="/" className="secondary-action">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
