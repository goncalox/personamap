import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, Search, Users } from "lucide-react";
import { ProfileCard } from "@/components/profile-card";
import { getFeaturedProfiles } from "@/lib/queries";

export default async function HomePage() {
  const { featured, debated } = await getFeaturedProfiles();

  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100svh-145px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brass">Evidence-based personality typing</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl">
            PersonaMap helps people type characters and public figures with receipts, not vibes.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
            Track what the community thinks, see how confident the consensus is, and read the evidence behind each
            typing. It is a database for debate, not a popularity contest.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/profiles"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-semibold text-coal transition hover:bg-brass"
            >
              Explore profiles
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/profiles/new"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-ink transition hover:border-brass hover:text-brass"
            >
              Add a profile
            </Link>
          </div>
          <form
            action="/profiles"
            className="mt-7 flex max-w-2xl flex-col gap-3 rounded-lg border border-white/10 bg-black/25 p-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="hero-search">
              Search profiles
            </label>
            <div className="flex min-h-12 flex-1 items-center gap-3 px-3">
              <Search className="size-5 text-ink/40" aria-hidden />
              <input
                id="hero-search"
                name="q"
                placeholder="Search Walter White, Sherlock, Hermione..."
                className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink/35"
              />
            </div>
            <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-brass px-5 text-sm font-semibold text-coal transition hover:bg-ink hover:text-ink">
              Search
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </form>
        </div>
        <div className="grid gap-4 lg:justify-self-end">
          <div className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-brass" aria-hidden />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brass">Why it works</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold text-ink">Consensus, not popularity</h2>
                <p className="mt-1 text-sm leading-6 text-ink/60">
                  Votes roll up into a visible consensus so you can see what is winning and how sure it is.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink">Evidence stays attached</h2>
                <p className="mt-1 text-sm leading-6 text-ink/60">
                  Arguments are tied to the profile, the system, and the type they support or challenge.
                </p>
              </div>
            </div>
          </div>
          {featured.slice(0, 1).map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/20">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-3">
          <div className="flex gap-4">
            <BookOpen className="mt-1 size-5 shrink-0 text-brass" aria-hidden />
            <div>
              <h2 className="font-semibold text-ink">Votes need context</h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">
                See the current read, the confidence level, and the strongest arguments underneath it.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Users className="mt-1 size-5 shrink-0 text-ocean" aria-hidden />
            <div>
              <h2 className="font-semibold text-ink">Confidence is visible</h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">
                Speculative, contested, and consensus labels stay explicit so people know how settled a type really is.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 size-5 shrink-0 text-wine" aria-hidden />
            <div>
              <h2 className="font-semibold text-ink">Debate stays focused</h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">
                Evidence cards explain why a type is winning, disputed, or still too early to call.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brass">Browse</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">Featured profiles</h2>
          </div>
          <Link href="/profiles" className="text-sm font-semibold text-brass hover:text-ink">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ocean">Recently debated</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Contested reads</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {debated.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>
    </main>
  );
}
