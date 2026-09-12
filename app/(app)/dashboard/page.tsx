import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { firstNameOf } from "@/components/app-shell/sidebar";
import { EmptyState } from "@/components/wishlist/empty-state";
import { QuickCreateButton } from "@/components/wishlist/quick-create";
import { HistoryCard } from "@/components/wishlist/history-card";
import { WishCard } from "@/components/wishlist/wish-card";
import { WishGrid } from "@/components/wishlist/wish-grid";
import { requireUser } from "@/lib/auth/session";
import { countInWords, plural } from "@/lib/format";
import { getUserWishes } from "@/lib/services/wishes";

export const metadata: Metadata = { title: "My Wishlist" };

export default async function DashboardPage() {
  const user = await requireUser();
  const wishes = await getUserWishes(user.id);
  const pending = wishes.filter((w) => w.status === "PENDING");
  const history = wishes.filter((w) => w.status !== "PENDING");
  const firstName = firstNameOf(user);

  return (
    <>
      <header className="flex items-center gap-5">
        <div className="min-w-0 flex-1">
          {firstName && <p className="eyebrow mb-2.5 text-ink-muted lg:hidden">{firstName}&apos;s</p>}
          <h1 className="text-[25px] leading-[1.15] font-semibold tracking-[-0.025em] text-ink lg:text-[27px]">
            My Wishlist
          </h1>
          {pending.length > 0 && (
            <p className="mt-2 text-[13px] leading-[1.45] text-ink-muted">
              {countInWords(pending.length, true)} {plural(pending.length, "thing", "things")}{" "}
              you&apos;re still thinking about. Nothing here needs deciding today.
            </p>
          )}
        </div>
        {wishes.length > 0 && (
          <QuickCreateButton className="hidden shadow-card lg:inline-flex">
            <Plus className="text-chip-plus" />
            Add wish
          </QuickCreateButton>
        )}
      </header>

      {wishes.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <section aria-labelledby="pending-title" className="mt-[22px]">
            <h2 id="pending-title" className="sr-only">
              Still thinking about
            </h2>
            {pending.length > 0 ? (
              <WishGrid>
                {pending.map((wish) => (
                  <li key={wish.id}>
                    <WishCard wish={wish} />
                  </li>
                ))}
              </WishGrid>
            ) : (
              <p className="text-[13px] leading-[1.45] text-ink-muted">
                Nothing pending. Everything here has been decided.
              </p>
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
