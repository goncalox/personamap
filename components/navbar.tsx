import Link from "next/link";
import { Compass, LogOut, Plus, Search } from "lucide-react";
import { getCurrentUser } from "@/lib/queries";
import { signOutAction } from "@/app/actions";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-coal/72 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl">
      <nav className="page-shell flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-base font-semibold text-ink">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-ink text-coal shadow-[0_10px_30px_rgba(244,240,232,0.16)]">
            <Compass className="size-5" aria-hidden />
          </span>
          <span className="truncate">PersonaMap</span>
        </Link>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.045] p-1 sm:gap-1.5">
          <Link
            href="/profiles"
            aria-label="Profiles"
            className="inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink/72 transition hover:bg-white/10 hover:text-ink"
          >
            <Search className="size-4" aria-hidden />
            <span className="hidden sm:inline">Profiles</span>
          </Link>
          <Link
            href="/profiles/new"
            aria-label="New Profile"
            className="inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink/72 transition hover:bg-white/10 hover:text-ink"
          >
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">New</span>
          </Link>
          {user ? (
            <form action={signOutAction}>
              <button
                aria-label="Logout"
                className="inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink/72 transition hover:bg-white/10 hover:text-ink"
              >
                <LogOut className="size-4" aria-hidden />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-9 items-center justify-center rounded-md bg-ink px-4 text-sm font-semibold text-coal transition hover:bg-brass"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
