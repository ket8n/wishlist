import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { firstNameOf } from "@/components/app-shell/sidebar";
import { EmptyState } from "@/components/wishlist/empty-state";
import { ClearFiltersButton, FilterBar } from "@/components/wishlist/filter-bar";
import { HistoryCard } from "@/components/wishlist/history-card";
import { QuickCreateButton } from "@/components/wishlist/quick-create";
import { StatusPills, buildHref } from "@/components/wishlist/status-pills";
import { WishCard } from "@/components/wishlist/wish-card";
import { WishGrid } from "@/components/wishlist/wish-grid";
import { requireUser } from "@/lib/auth/session";
import { countInWords, plural } from "@/lib/format";
import { getUserWishes, getWishStats } from "@/lib/services/wishes";
import { wishFiltersSchema } from "@/lib/validation/wish";

export const metadata: Metadata = { title: "My Wishlist" };

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const user = await requireUser();
  const filters = wishFiltersSchema.parse(await searchParams);

  // Pending and All keep the History band below; a terminal pill owns the grid.
  const gridStatus =
    filters.status === "PENDING" || filters.status === "all" ? undefined : filters.status;
  const [wishes, stats] = await Promise.all([
    getUserWishes(user.id, {
      q: filters.q,
      status: gridStatus,
      priority: filters.priority,
      category: filters.category,
      sort: filters.sort,
    }),
    getWishStats(user.id),
  ]);

  const grid =
    filters.status === "PENDING" ? wishes.filter((w) => w.status === "PENDING") : wishes;
  const history =
    filters.status === "PENDING" ? wishes.filter((w) => w.status !== "PENDING") : [];

  const filtered = Boolean(filters.q || filters.priority || filters.category);
  const firstName = firstNameOf(user);

  return (
    <>
      <header className="flex items-center gap-5">
        <div className="min-w-0 flex-1">
          {firstName && <p className="eyebrow mb-2.5 text-ink-muted lg:hidden">{firstName}&apos;s</p>}
          <h1 className="text-[25px] leading-[1.15] font-semibold tracking-[-0.025em] text-ink lg:text-[27px]">
            My Wishlist
          </h1>
          {stats.pending > 0 && (
            <p className="mt-2 text-[13px] leading-[1.45] text-ink-muted">
              {countInWords(stats.pending, true)} {plural(stats.pending, "thing", "things")}{" "}
              you&apos;re still thinking about. Nothing here needs deciding today.
            </p>
          )}
        </div>
        {stats.total > 0 && (
          <QuickCreateButton className="hidden shadow-card lg:inline-flex">
            <Plus className="text-chip-plus" />
            Add wish
          </QuickCreateButton>
        )}
      </header>

      {stats.total === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mt-[22px]">
            <FilterBar filters={filters} shown={wishes.length} />
          </div>
          <div className="mt-5">
            <StatusPills filters={filters} stats={stats} />
          </div>

          <section aria-labelledby="results-title" className="mt-[22px]">
            <h2 id="results-title" className="sr-only">
              Wishes
            </h2>
            {grid.length > 0 ? (
              <WishGrid>
                {grid.map((wish) => (
                  <li key={wish.id}>
                    <WishCard wish={wish} />
                  </li>
                ))}
              </WishGrid>
            ) : (
              <div className="rounded-[12px] border border-subtle bg-sunken px-5 py-8 text-center">
                <p className="text-[13.5px] text-ink">
                  {filtered ? "Nothing matches those filters." : "Nothing here yet."}
                </p>
                {filtered && (
                  <div className="mt-4 flex justify-center">
                    <ClearFiltersButton />
                  </div>
                )}
              </div>
            )}
          </section>

          {history.length > 0 && (
            <section aria-labelledby="history-title" className="mt-9 border-t pt-6">
              <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
                <h2
                  id="history-title"
                  className="text-[15px] leading-[1.2] font-semibold tracking-[-0.015em] text-ink"
                >
                  History
                </h2>
                <p className="text-[12.5px] leading-[1.3] text-ink-muted">
                  {countInWords(history.length, true)} {plural(history.length, "decision", "decisions")}{" "}
                  you&apos;ve already made.
                </p>
                <Link
                  href={buildHref(filters, { status: "all" })}
                  className="ml-auto rounded-[6px] text-[12px] font-semibold text-brand-fg hover:underline"
                >
                  See all
                </Link>
              </div>
              <ul className="mt-4 grid gap-3.5 lg:grid-cols-2">
                {history.map((wish) => (
                  <li key={wish.id}>
                    <HistoryCard wish={wish} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </>
  );
}
