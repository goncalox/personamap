import { Search } from "lucide-react";
import { ProfileCard } from "@/components/profile-card";
import { getProfiles, getTypingData } from "@/lib/queries";

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; system?: string; type?: string }>;
}) {
  const params = await searchParams;
  const [{ typeOptions }, profiles] = await Promise.all([getTypingData(), getProfiles(params)]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brass">Profiles</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Personality database</h1>
        </div>
        <p className="text-sm text-ink/55">{profiles.length} profiles</p>
      </div>

      <form className="mt-8 grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 md:grid-cols-[1fr_180px_180px_120px]">
        <label className="flex min-h-11 items-center gap-3 rounded-md border border-white/10 bg-coal px-3">
          <Search className="size-4 text-ink/40" aria-hidden />
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search by name or source"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
          />
        </label>
        <select
          name="category"
          defaultValue={params.category ?? "all"}
          className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-sm text-ink outline-none"
        >
          <option value="all">All categories</option>
          <option value="fictional">Fictional</option>
          <option value="public_figure">Public figures</option>
        </select>
        <select
          name="type"
          defaultValue={params.type ?? "all"}
          className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-sm text-ink outline-none"
        >
          <option value="all">All types</option>
          {typeOptions.map((option) => (
            <option key={option.id} value={option.code}>
              {option.code}
            </option>
          ))}
        </select>
        <button className="min-h-11 rounded-md bg-ink px-4 text-sm font-semibold text-coal transition hover:bg-brass">
          Filter
        </button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </main>
  );
}
