import Link from "next/link";
import { Compass, LogOut, Plus, Search } from "lucide-react";
import { getCurrentUser } from "@/lib/queries";
import { signOutAction } from "@/app/actions";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-coal/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold text-ink">
          <span className="grid size-9 place-items-center rounded-md bg-brass text-coal">
            <Compass className="size-5" aria-hidden />
          </span>
          PersonaMap
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/profiles"
            aria-label="Profiles"
            className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm text-ink/80 transition hover:bg-white/10 hover:text-ink"
          >
            <Search className="size-4" aria-hidden />
            <span className="hidden sm:inline">Profiles</span>
          </Link>
          <Link
            href="/profiles/new"
            aria-label="New Profile"
            className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm text-ink/80 transition hover:bg-white/10 hover:text-ink"
          >
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">New Profile</span>
          </Link>
          {user ? (
            <form action={signOutAction}>
              <button
                aria-label="Logout"
                className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm text-ink/80 transition hover:bg-white/10 hover:text-ink"
              >
                <LogOut className="size-4" aria-hidden />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/15 px-4 text-sm font-medium text-ink transition hover:border-brass hover:text-brass"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
