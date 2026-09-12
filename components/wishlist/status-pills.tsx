import Link from "next/link";

import { cn } from "@/lib/utils";
import type { WishStats } from "@/lib/services/wishes";
import type { StatusFilter, WishFilters } from "@/lib/validation/wish";

export function buildHref(filters: WishFilters, patch: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  const merged: Record<string, string | undefined> = {
    q: filters.q,
    status: filters.status,
    priority: filters.priority,
    category: filters.category,
    sort: filters.sort,
    ...patch,
  };
  for (const [key, value] of Object.entries(merged)) {
    if (!value) continue;
    if (key === "status" && value === "PENDING") continue;
    if (key === "sort" && value === "updated") continue;
    params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `/dashboard?${qs}` : "/dashboard";
}

export function StatusPills({
  filters,
  stats,
  query,
}: {
  filters: WishFilters;
  stats: WishStats;
  query?: string;
}) {
  const pills: { value: StatusFilter; label: string; count: number }[] = [
    { value: "PENDING", label: "Pending", count: stats.pending },
    { value: "all", label: "All", count: stats.total },
    { value: "BOUGHT", label: "Bought", count: stats.bought },
    { value: "COMPLETED", label: "Completed", count: stats.completed },
    { value: "REJECTED", label: "Rejected", count: stats.rejected },
  ];

  return (
    <nav aria-label="Filter by status" className="-mx-5 overflow-x-auto px-5 lg:mx-0 lg:px-0">
      <ul className="flex w-max items-center gap-[7px] lg:w-auto lg:flex-wrap">
        {pills.map((pill) => {
          const active = filters.status === pill.value;
          return (
            <li key={pill.value}>
              <Link
                href={buildHref(filters, { status: pill.value, q: query?.trim() || undefined })}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-medium transition-colors duration-150 lg:min-h-0 lg:py-[7px]",
                  active
                    ? "bg-pill-active font-semibold text-pill-active-fg"
                    : "border border-border bg-chrome text-ink-secondary hover:text-ink",
                )}
              >
                {pill.label}
                <span className="font-mono">{pill.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
