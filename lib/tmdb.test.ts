import { describe, expect, it } from "vitest";
import { mapTmdbCastToProfileDrafts, type TmdbMovie, type TmdbMovieCredits } from "@/lib/tmdb";

const movie: TmdbMovie = {
  id: 27205,
  title: "Inception",
  overview: "A thief who steals corporate secrets through dream-sharing technology.",
  release_date: "2010-07-16",
  poster_path: "/poster.jpg",
  original_title: "Inception",
};

const credits: TmdbMovieCredits = {
  id: 27205,
  cast: [
    {
      id: 1,
      cast_id: 1,
      credit_id: "credit-1",
      name: "Leonardo DiCaprio",
      character: "Cobb",
      order: 0,
      profile_path: null,
    },
    {
      id: 2,
      cast_id: 2,
      credit_id: "credit-2",
      name: "Joseph Gordon-Levitt",
      character: "Arthur",
      order: 1,
      profile_path: null,
    },
  ],
};

describe("mapTmdbCastToProfileDrafts", () => {
  it("maps cast members into profile drafts with import metadata", () => {
    const drafts = mapTmdbCastToProfileDrafts(movie, credits);

    expect(drafts).toHaveLength(2);
    expect(drafts[0]).toMatchObject({
      name: "Cobb",
      category: "fictional",
      source_title: "Inception",
      external_source: "tmdb",
      external_movie_id: 27205,
      external_credit_id: "credit-1",
      source_type: "movie_cast",
      release_date: "2010-07-16",
      actor_name: "Leonardo DiCaprio",
      import_status: "preview",
    });
    expect(drafts[0].description).toContain("Inception");
    expect(drafts[0].image_url).toContain("image.tmdb.org");
  });
});
