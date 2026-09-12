import { WishCardSkeleton } from "@/components/wishlist/wish-card-skeleton";
import { WishGrid } from "@/components/wishlist/wish-grid";

export default function DashboardLoading() {
  return (
    <div role="status">
      <span className="sr-only">Loading your wishes</span>
      <div aria-hidden>
        <div className="skeleton h-[29px] w-44 rounded-[6px] lg:h-[31px]" />
        <div className="skeleton mt-2.5 h-3.5 w-72 max-w-full rounded-[4px]" />
      </div>
      <WishGrid className="mt-[22px]">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i}>
            <WishCardSkeleton />
          </li>
        ))}
      </WishGrid>
    </div>
  );
}
