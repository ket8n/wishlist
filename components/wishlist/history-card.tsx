import { StatusChip } from "@/components/wishlist/status-chip";
import { WishMedia } from "@/components/wishlist/wish-media";
import { WishViewButton } from "@/components/wishlist/wish-view-button";
import { formatPrice } from "@/lib/format";
import type { WishView } from "@/lib/services/wishes";

// Terminal wishes: recessed surface, full-contrast type, never faded.
export function HistoryCard({ wish }: { wish: WishView }) {
  const price = formatPrice(wish.estimatedPrice, wish.currency);
  const image = wish.images[0];
  const titleId = `history-${wish.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="flex items-center gap-3.5 rounded-[11px] border border-subtle bg-sunken p-3.5"
    >
      <WishMedia
        key={image}
        src={image}
        alt={wish.name}
        className="size-11 shrink-0 rounded-[8px] border md:size-12"
      />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-[9px]">
          <h3 id={titleId} className="truncate text-[13.5px] leading-[1.3] font-semibold text-ink">
            {wish.name}
          </h3>
          <StatusChip status={wish.status} />
        </div>
        {wish.note && (
          <p className="voice mt-1.5 line-clamp-2 text-[13.5px] leading-[1.4] text-ink-muted md:line-clamp-1">
            {wish.note}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3.5">
        {price && (
          <span className="hidden font-mono text-[12.5px] leading-none text-ink-secondary sm:inline">
            {price}
          </span>
        )}
        <WishViewButton wish={wish} variant="link" />
      </div>
    </article>
  );
}
