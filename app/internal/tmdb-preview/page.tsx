import type { Metadata } from "next";
import { getMovieCredits, getMovieDetails, mapTmdbCastToProfileDrafts } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "TMDb import preview",
  description: "Internal preview for movie character imports from TMDb.",
};

function parseMovieId(value: string | undefined) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default async function TmdbPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ movieId?: string }>;
}) {
  const params = await searchParams;
  const movieId = parseMovieId(params.movieId);

  let error: string | null = null;
  let drafts: ReturnType<typeof mapTmdbCastToProfileDrafts> | null = null;
  let movieTitle = "";

  if (movieId) {
    try {
      const [movie, credits] = await Promise.all([getMovieDetails(movieId), getMovieCredits(movieId)]);
      drafts = mapTmdbCastToProfileDrafts(movie, credits);
      movieTitle = movie.title;
    } catch (err) {
      error = err instanceof Error ? err.message : "Unable to preview TMDb import.";
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brass">Internal</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">TMDb movie import preview</h1>
        <p className="mt-4 text-sm leading-6 text-ink/65">
          Enter a TMDb movie ID to preview draft character profiles before any import logic is automated.
        </p>
      </div>

      <form className="mt-8 flex max-w-xl gap-3">
        <label className="grid flex-1 gap-2 text-sm font-medium text-ink">
          Movie ID
          <input
            name="movieId"
            defaultValue={params.movieId}
            inputMode="numeric"
            placeholder="27205"
            className="min-h-11 rounded-md border border-white/10 bg-white/[0.04] px-3 text-ink outline-none focus:border-brass"
          />
        </label>
        <button className="mt-auto inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-coal transition hover:bg-brass">
          Preview
        </button>
      </form>

      {error ? (
        <p role="alert" className="mt-6 rounded-lg border border-wine/40 bg-wine/10 p-4 text-sm text-ink">
          {error}
        </p>
      ) : null}

      {drafts ? (
        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ocean">Preview</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">{movieTitle}</h2>
            </div>
            <p className="text-sm text-ink/55">{drafts.length} draft profiles</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {drafts.map((draft) => (
              <article key={draft.external_credit_id} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-brass">Draft profile</p>
                <h3 className="mt-2 text-2xl font-semibold text-ink">{draft.name}</h3>
                <p className="mt-1 text-sm text-ink/55">{draft.source_title}</p>
                <p className="mt-4 text-sm leading-6 text-ink/70">{draft.description}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-ink/45">Actor</dt>
                    <dd className="font-medium text-ink">{draft.actor_name ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-ink/45">Release</dt>
                    <dd className="font-medium text-ink">{draft.release_date ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-ink/45">Source</dt>
                    <dd className="font-medium text-ink">{draft.external_source}</dd>
                  </div>
                  <div>
                    <dt className="text-ink/45">Import status</dt>
                    <dd className="font-medium text-ink">{draft.import_status}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
