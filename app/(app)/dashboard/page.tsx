import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { firstNameOf } from "@/components/app-shell/sidebar";
import { DashboardResults } from "@/components/wishlist/dashboard-results";
import { EmptyState } from "@/components/wishlist/empty-state";
import { QuickCreateButton } from "@/components/wishlist/quick-create";
import { requireUser } from "@/lib/auth/session";
import { countInWords, plural } from "@/lib/format";
import { getRequestWishStats, getUserWishes } from "@/lib/services/wishes";
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
    getRequestWishStats(user.id),
  ]);

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
        <DashboardResults wishes={wishes} stats={stats} filters={filters} />
      )}
    </>
  );
}
