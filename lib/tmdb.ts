export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  release_date: string | null;
  poster_path: string | null;
  original_title: string;
};

export type TmdbCastMember = {
  id: number;
  cast_id: number;
  credit_id: string;
  name: string;
  character: string;
  order: number;
  profile_path: string | null;
};

export type TmdbMovieCredits = {
  id: number;
  cast: TmdbCastMember[];
};

export type TmdbProfileDraft = {
  slug: string;
  name: string;
  category: "fictional";
  source_title: string;
  description: string;
  image_url: string | null;
  external_source: "tmdb";
  external_movie_id: number;
  external_credit_id: string;
  source_type: "movie_cast";
  release_date: string | null;
  actor_name: string | null;
  poster_url: string | null;
  import_status: "preview";
};

function tmdbHeaders() {
  const token = process.env.TMDB_BEARER_TOKEN;
  if (!token) {
    throw new Error("Missing TMDB_BEARER_TOKEN. Add it to your environment to preview imports.");
  }

  return {
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  };
}

async function tmdbFetch<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.themoviedb.org/3${path}`, {
    headers: tmdbHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`TMDb request failed (${response.status}): ${message}`);
  }

  return response.json() as Promise<T>;
}

export async function getMovieDetails(movieId: number) {
  return tmdbFetch<TmdbMovie>(`/movie/${movieId}`);
}

export async function getMovieCredits(movieId: number) {
  return tmdbFetch<TmdbMovieCredits>(`/movie/${movieId}/credits`);
}

export function mapTmdbCastToProfileDrafts(movie: TmdbMovie, credits: TmdbMovieCredits): TmdbProfileDraft[] {
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : null;
  const releaseYear = movie.release_date ? new Date(movie.release_date).getUTCFullYear() : null;

  return credits.cast.slice(0, 12).map((member) => {
    const name = member.character?.trim() || member.name.trim();
    const slug = `${movie.title}-${name}-${movie.id}-${member.credit_id}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);

    return {
      slug,
      name,
      category: "fictional",
      source_title: movie.title,
      description: `${name} from ${movie.title}${releaseYear ? ` (${releaseYear})` : ""}. Imported from TMDb cast credits for later review.`,
      image_url: posterUrl,
      external_source: "tmdb",
      external_movie_id: movie.id,
      external_credit_id: member.credit_id,
      source_type: "movie_cast",
      release_date: movie.release_date,
      actor_name: member.name,
      poster_url: posterUrl,
      import_status: "preview",
    };
  });
}
