import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — Mirror" }] }),
  component: HistoryLayout,
});

function HistoryLayout() {
  return (
    <div className="min-h-screen bg-paper px-6 md:px-10 py-10 md:py-16">
      <div className="max-w-[640px] mx-auto">
        <header className="flex items-center justify-between mb-12">
          <Link to="/" className="font-serif text-lg tracking-label uppercase text-ink">
            Mirror
          </Link>
          <nav className="flex items-center gap-5 text-[12px] tracking-label uppercase text-ink-3">
            <Link to="/" className="hover:text-ink transition-colors">
              New
            </Link>
            <span className="text-ink">History</span>
          </nav>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
