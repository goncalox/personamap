import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProfileCard } from "@/components/profile-card";
import { SelectControl } from "@/components/select-control";
import {
  filterProfilesByCategory,
  filterProfilesByTyping,
  getProfileCategoryOptions,
  hasActiveProfileFilters,
  normalizeProfileCategory,
  normalizeProfileType,
} from "@/lib/profile-filters";
import { getProfiles, getTypingData } from "@/lib/queries";
import { cn } from "@/lib/utils";

function profilesHref(params: { q?: string; category?: string; mbti?: string; enneagram?: string }) {
  const nextParams = new URLSearchParams();
  if (params.q?.trim()) nextParams.set("q", params.q.trim());
  if (params.category && params.category !== "all") nextParams.set("category", params.category);
  if (params.mbti && params.mbti !== "all") nextParams.set("mbti", params.mbti);
  if (params.enneagram && params.enneagram !== "all") nextParams.set("enneagram", params.enneagram);

  const query = nextParams.toString();
  return query ? `/profiles?${query}` : "/profiles";
}

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; mbti?: string; enneagram?: string; system?: string; type?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = normalizeProfileCategory(params.category);
  const selectedMbti = normalizeProfileType(params.mbti);
  const selectedEnneagram = normalizeProfileType(params.enneagram);
  const [{ typingSystems, typeOptions }, searchMatches] = await Promise.all([
    getTypingData(),
    getProfiles({ q: params.q }),
  ]);
  const typingMatches = filterProfilesByTyping(searchMatches, { mbti: selectedMbti, enneagram: selectedEnneagram });
  const profiles = filterProfilesByCategory(typingMatches, selectedCategory);
  const categoryOptions = getProfileCategoryOptions(typingMatches);
  const mbtiSystem = typingSystems.find((system) => system.code === "MBTI");
  const enneagramSystem = typingSystems.find((system) => system.code === "ENNEAGRAM");
  const mbtiOptions = typeOptions.filter((option) => option.typing_system_id === mbtiSystem?.id);
  const enneagramOptions = typeOptions.filter((option) => option.typing_system_id === enneagramSystem?.id);
  const activeFilters = hasActiveProfileFilters(params);

  return (
    <main className="page-shell py-10 sm:py-12">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Profiles</p>
          <h1 className="section-title mt-2 sm:text-4xl">Browse the map</h1>
          <p className="body-copy mt-3 max-w-2xl">
            Find characters and public figures by name, source, category, MBTI, or Enneagram without mixing the systems.
          </p>
        </div>
        <div className="glass-panel w-fit px-4 py-3 text-sm text-ink/65">
          Showing <span className="font-semibold text-ink">{profiles.length}</span> of{" "}
          <span className="font-semibold text-ink">{typingMatches.length}</span> matches
        </div>
      </div>

      <section className="glass-panel mt-8 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink/72">
          <SlidersHorizontal className="size-4 text-brass" aria-hidden />
          Search and filters
        </div>
        <form className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_160px_190px_auto_auto] xl:items-end">
          <input type="hidden" name="category" value={selectedCategory} />
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
            Search
            <span className="field-control flex min-h-12 items-center gap-3 px-3 focus-within:border-brass focus-within:ring-2 focus-within:ring-brass/20">
              <Search className="size-4 shrink-0 text-ink/40" aria-hidden />
              <input
                name="q"
                defaultValue={params.q}
                placeholder="Search Walter White, The Dark Knight..."
                className="w-full bg-transparent text-sm normal-case tracking-normal text-ink outline-none placeholder:text-ink/35"
              />
            </span>
          </label>
          <SelectControl
            id="mbti-filter"
            name="mbti"
            label="MBTI"
            defaultValue={selectedMbti}
            labelClassName="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45"
            className="min-h-12 normal-case tracking-normal"
          >
            <option value="all">All MBTI</option>
            {mbtiOptions.map((option) => (
              <option key={option.id} value={option.code}>
                {option.code}
              </option>
            ))}
          </SelectControl>
          <SelectControl
            id="enneagram-filter"
            name="enneagram"
            label="Enneagram"
            defaultValue={selectedEnneagram}
            labelClassName="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45"
            className="min-h-12 normal-case tracking-normal"
          >
            <option value="all">All Enneagram</option>
            {enneagramOptions.map((option) => (
              <option key={option.id} value={option.code}>
                {option.code}
              </option>
            ))}
          </SelectControl>
          <button className="primary-action min-h-12 px-4">
            <Search className="size-4" aria-hidden />
            Search
          </button>
          {activeFilters ? (
            <Link
              href="/profiles"
              className="secondary-action min-h-12 px-4"
            >
              <X className="size-4" aria-hidden />
              Reset
            </Link>
          ) : null}
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {categoryOptions.map((category) => {
            const selected = selectedCategory === category.value;

            return (
              <Link
                key={category.value}
                href={profilesHref({
                  q: params.q,
                  mbti: selectedMbti,
                  enneagram: selectedEnneagram,
                  category: category.value,
                })}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition",
                  selected
                    ? "border-brass bg-brass/15 text-brass shadow-[0_0_30px_rgba(198,161,91,0.08)]"
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
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="glass-panel mt-8 border-dashed p-10 text-center">
          <p className="text-lg font-semibold text-ink">No profiles match those filters.</p>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Try a broader search, clear the filters, or add a new profile if you are looking for something specific.
          </p>
        </div>
      )}
    </main>
  );
}
