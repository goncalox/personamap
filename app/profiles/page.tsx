import Link from "next/link";
import { Search, X } from "lucide-react";
import { ProfileCard } from "@/components/profile-card";
import {
  filterProfilesByCategory,
  getProfileCategoryOptions,
  hasActiveProfileFilters,
  normalizeProfileCategory,
} from "@/lib/profile-filters";
import { getProfiles, getTypingData } from "@/lib/queries";
import { cn } from "@/lib/utils";

function profilesHref(params: { q?: string; category?: string; type?: string }) {
  const nextParams = new URLSearchParams();
  if (params.q?.trim()) nextParams.set("q", params.q.trim());
  if (params.category && params.category !== "all") nextParams.set("category", params.category);
  if (params.type && params.type !== "all") nextParams.set("type", params.type);

  const query = nextParams.toString();
  return query ? `/profiles?${query}` : "/profiles";
}

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; system?: string; type?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = normalizeProfileCategory(params.category);
  const [{ typeOptions }, profileMatches] = await Promise.all([
    getTypingData(),
    getProfiles({ q: params.q, system: params.system, type: params.type }),
  ]);
  const profiles = filterProfilesByCategory(profileMatches, selectedCategory);
  const categoryOptions = getProfileCategoryOptions(profileMatches);
  const activeFilters = hasActiveProfileFilters(params);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brass">Profiles</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Browse profiles and typing reads</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">
            Search by name or source, jump between categories, and narrow the directory without turning the page into a vote board.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-ink/65">
          Showing <span className="font-semibold text-ink">{profiles.length}</span> of{" "}
          <span className="font-semibold text-ink">{profileMatches.length}</span> matches
        </div>
      </div>

      <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <form className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_auto_auto]">
          <input type="hidden" name="category" value={selectedCategory} />
          <label className="flex min-h-12 items-center gap-3 rounded-md border border-white/10 bg-coal px-3 focus-within:border-brass">
            <Search className="size-4 shrink-0 text-ink/40" aria-hidden />
            <span className="sr-only">Search profiles</span>
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search Walter White, The Dark Knight..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
            />
          </label>
          <label className="sr-only" htmlFor="type-filter">
            Filter by type
          </label>
          <select
            id="type-filter"
            name="type"
            defaultValue={params.type ?? "all"}
            className="min-h-12 rounded-md border border-white/10 bg-coal px-3 text-sm text-ink outline-none transition focus:border-brass"
          >
            <option value="all">All typings</option>
            {typeOptions.map((option) => (
              <option key={option.id} value={option.code}>
                {option.code}
              </option>
            ))}
          </select>
          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-coal transition hover:bg-brass">
            <Search className="size-4" aria-hidden />
            Search
          </button>
          {activeFilters ? (
            <Link
              href="/profiles"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-ink/75 transition hover:border-brass/70 hover:text-ink"
            >
              <X className="size-4" aria-hidden />
              Reset
            </Link>
          ) : null}
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {categoryOptions.map((category) => {
            const selected = selectedCategory === category.value;

            return (
              <Link
                key={category.value}
                href={profilesHref({ q: params.q, type: params.type, category: category.value })}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm transition",
                  selected
                    ? "border-brass bg-brass/15 text-brass"
                    : "border-white/10 bg-black/20 text-ink/65 hover:border-brass/60 hover:text-ink",
                )}
                aria-current={selected ? "page" : undefined}
              >
                <span>{category.label}</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-ink/60">{category.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {profiles.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-10 text-center">
          <p className="text-lg font-semibold text-ink">No profiles match those filters.</p>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Try a broader search, clear the filters, or add a new profile if you are looking for something specific.
          </p>
        </div>
      )}
    </main>
  );
}
