import { StatusChip } from "@/components/wishlist/status-chip";
import { WishCardMenu } from "@/components/wishlist/wish-card-menu";
import { WishViewButton } from "@/components/wishlist/wish-view-button";
import { WishMedia } from "@/components/wishlist/wish-media";
import { PriorityLabel, WaitLine } from "@/components/wishlist/wish-meta";
import { CATEGORY_LABEL, daysInList, formatPrice } from "@/lib/format";
import type { WishView } from "@/lib/services/wishes";

// Horizontal below md, vertical above. Heights are reserved so cards never shift.
export function WishCard({ wish }: { wish: WishView }) {
  const price = formatPrice(wish.estimatedPrice, wish.currency);
  const category = CATEGORY_LABEL[wish.category];
  const image = wish.images[0];
  const titleId = `wish-${wish.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full gap-3 rounded-[12px] border bg-card p-3 shadow-card md:flex-col md:gap-0 md:overflow-hidden md:p-0"
    >
      <WishMedia
        key={image}
        src={image}
        alt={wish.name}
        fallback={<span className="eyebrow text-ink-muted max-md:tracking-normal">{category}</span>}
        className="min-h-24 w-24 shrink-0 self-stretch rounded-[9px] md:h-[150px] md:min-h-0 md:w-full md:rounded-none md:border-b md:border-subtle"
      >
        {image && (
          <span className="eyebrow absolute top-[11px] left-3 hidden rounded-[6px] border border-black/8 bg-white/92 px-[9px] py-1 tracking-[0.06em] text-ink-secondary md:inline-block dark:border-white/10 dark:bg-[rgba(15,17,21,.82)]">
            {category}
          </span>
        )}
        <StatusChip status={wish.status} className="absolute top-[11px] right-3 hidden md:inline-flex" />
      </WishMedia>

      <div className="flex min-w-0 flex-1 flex-col md:px-4 md:pt-[15px] md:pb-[14px]">
        <h3
          id={titleId}
          className="truncate text-[15.5px] leading-[1.25] font-semibold tracking-[-0.015em] text-ink md:h-[21px] md:leading-[1.3]"
        >
          {wish.name}
        </h3>
        <p className="mt-[7px] line-clamp-2 h-[38px] text-[12.5px] leading-[1.5] text-ink-muted">
          {wish.description}
        </p>

        <div className="mt-3.5 flex items-center gap-2">
          <PriorityLabel priority={wish.priority} />
          {price && (
            <span className="ml-auto font-mono text-[14px] leading-none font-medium text-ink">{price}</span>
          )}
        </div>

        <div className="mt-3.5 flex items-center gap-2.5 border-t border-subtle pt-[13px]">
          <WishViewButton wish={wish} />
          <WaitLine days={daysInList(wish.createdAt)} />
          <WishCardMenu wish={wish} />
        </div>
      </div>
    </article>
  );
}
