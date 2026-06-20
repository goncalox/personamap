import Link from "next/link";
import { ArrowRight, BookOpen, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import { ProfileCard } from "@/components/profile-card";
import { getFeaturedProfiles } from "@/lib/queries";

export default async function HomePage() {
  const { featured, debated } = await getFeaturedProfiles();
  const spotlight = featured[0];

  return (
    <main>
      <section className="page-shell grid min-h-[calc(100svh-76px)] items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
        <div className="max-w-3xl">
          <p className="eyebrow">Evidence-based personality typing</p>
          <h1 className="display-title mt-5">
            A calmer personality database for characters and public figures.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
            PersonaMap keeps typings readable: clean profiles, separate MBTI and Enneagram reads, and evidence attached
            to the profile instead of lost inside popularity noise.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/profiles" className="primary-action">
              Explore profiles
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/profiles/new" className="secondary-action">
              Add a profile
            </Link>
          </div>
          <form
            action="/profiles"
            className="glass-panel mt-8 flex max-w-2xl flex-col gap-3 p-2.5 transition focus-within:border-brass/70 focus-within:ring-2 focus-within:ring-brass/15 sm:flex-row"
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
            <button className="primary-action min-h-12 bg-brass hover:bg-ink">
              Search
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </form>
          <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["Profiles first", "Useful even before votes build up"],
              ["Evidence next", "Arguments stay attached to reads"],
              ["Cleaner debate", "Less noise, more signal"],
            ].map(([title, copy]) => (
              <div key={title} className="subtle-panel p-4">
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="mt-1 text-xs leading-5 text-ink/50">{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 lg:justify-self-end">
          {spotlight ? (
            <div className="glass-panel p-3">
              <div className="flex items-center justify-between gap-3 px-2 pb-3 pt-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-brass" aria-hidden />
                  <p className="text-sm font-semibold text-ink">Spotlight profile</p>
                </div>
                <span className="status-pill">Live read</span>
              </div>
              <ProfileCard profile={spotlight} />
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="glass-panel p-5">
              <p className="text-3xl font-semibold text-ink">{featured.length}</p>
              <p className="mt-1 text-sm text-ink/55">featured profiles</p>
            </div>
            <div className="glass-panel p-5">
              <p className="text-3xl font-semibold text-ink">{debated.length}</p>
              <p className="mt-1 text-sm text-ink/55">contested reads</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/[0.18]">
        <div className="page-shell grid gap-5 py-10 md:grid-cols-3">
          <div className="flex gap-4">
            <BookOpen className="mt-1 size-5 shrink-0 text-brass" aria-hidden />
            <div>
              <h2 className="font-semibold text-ink">Browse by source</h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">
                Search by character, person, or source title and move through the database without forum clutter.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Users className="mt-1 size-5 shrink-0 text-ocean" aria-hidden />
            <div>
              <h2 className="font-semibold text-ink">Typing can grow</h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">
                Empty profiles feel intentional, while seeded reads appear as early labels that can evolve.
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

      <section className="page-shell py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Browse</p>
            <h2 className="section-title mt-2">Featured profiles</h2>
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

      <section className="page-shell pb-16">
        <div>
          <p className="eyebrow text-ocean">Recently debated</p>
          <h2 className="section-title mt-2">Contested reads</h2>
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
