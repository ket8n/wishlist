"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/wishlist/filter-bar";
import { HistoryCard } from "@/components/wishlist/history-card";
import { StatusPills, buildHref } from "@/components/wishlist/status-pills";
import { WishCard } from "@/components/wishlist/wish-card";
import { WishGrid } from "@/components/wishlist/wish-grid";
import { countInWords, plural } from "@/lib/format";
import type { WishStats, WishView } from "@/lib/services/wishes";
import type { WishFilters } from "@/lib/validation/wish";

// Name search filters the wishes already on the page, so typing costs no request.
export function DashboardResults({
  wishes,
  stats,
  filters,
}: {
  wishes: WishView[];
  stats: WishStats;
  filters: WishFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(filters.q ?? "");

  function onQueryChange(value: string) {
    setQuery(value);
    const params = new URLSearchParams(window.location.search);
    if (value.trim()) params.set("q", value);
    else params.delete("q");
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }

  function clearFilters() {
    setQuery("");
    router.replace(pathname, { scroll: false });
  }

  const needle = query.trim().toLowerCase();
  const matches = needle
    ? wishes.filter((wish) => wish.name.toLowerCase().includes(needle))
    : wishes;

  const grid = filters.status === "PENDING" ? matches.filter((w) => w.status === "PENDING") : matches;
  const history =
    filters.status === "PENDING" ? matches.filter((w) => w.status !== "PENDING") : [];
  const filtered = Boolean(needle || filters.priority || filters.category);

  return (
    <>
      <div className="mt-[22px]">
        <FilterBar
          filters={filters}
          query={query}
          onQueryChange={onQueryChange}
          shown={matches.length}
        />
      </div>
      <div className="mt-5">
        <StatusPills filters={filters} stats={stats} query={query} />
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
                <Button variant="quiet" onClick={clearFilters}>
                  Clear filters
                </Button>
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
              href={buildHref(filters, { status: "all", q: query || undefined })}
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
  );
}
