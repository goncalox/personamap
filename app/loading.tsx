export default function Loading() {
  return (
    <main className="page-shell flex min-h-[50vh] items-center justify-center py-16">
      <div className="glass-panel flex items-center gap-3 px-5 py-4 text-sm text-ink/60">
        <span className="size-2 rounded-full bg-brass shadow-[0_0_24px_rgba(198,161,91,0.45)]" />
        Loading PersonaMap...
      </div>
    </main>
  );
}
