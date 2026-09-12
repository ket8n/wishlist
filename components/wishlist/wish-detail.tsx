import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DeleteWishDialog } from "@/components/wishlist/delete-wish-dialog";
import { NotePanel } from "@/components/wishlist/note-panel";
import { StatusActions } from "@/components/wishlist/status-change";
import { StatusChip } from "@/components/wishlist/status-chip";
import { WishGallery } from "@/components/wishlist/wish-gallery";
import { PriorityLabel } from "@/components/wishlist/wish-meta";
import {
  CATEGORY_LABEL,
  LONG_WAIT_DAYS,
  daysInList,
  formatDate,
  formatPrice,
  formatRelative,
  plural,
} from "@/lib/format";
import type { WishView } from "@/lib/services/wishes";
import { cn } from "@/lib/utils";

export function WishDetail({
  wish,
  title,
  footerStart,
}: {
  wish: WishView;
  title: React.ReactNode;
  footerStart?: React.ReactNode;
}) {
  const price = formatPrice(wish.estimatedPrice, wish.currency);
  const days = daysInList(wish.createdAt);

  return (
    <div className="grid gap-6 lg:grid-cols-[344px_1fr] lg:gap-8">
      <WishGallery images={wish.images} name={wish.name} />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusChip status={wish.status} />
          <span className="eyebrow text-ink-muted">{CATEGORY_LABEL[wish.category]}</span>
          <PriorityLabel priority={wish.priority} />
        </div>

        {title}

        {wish.description && (
          <p className="mt-3 max-w-[460px] text-[13.5px] leading-[1.6] text-ink-muted">
            {wish.description}
          </p>
        )}

        {wish.note && (
          <div className="mt-6">
            <NotePanel
              note={wish.note}
              updatedAt={wish.noteUpdatedAt}
              editHref={`/wish/${wish.id}/edit`}
            />
          </div>
        )}

        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border bg-border">
          <MetaCell label="Estimated price">
            <span className="font-mono text-[16px] font-medium text-ink lg:text-[17px]">
              {price ?? "Not set"}
            </span>
          </MetaCell>
          <MetaCell label="In your list">
            <span
              className={cn(
                "text-[13px] font-medium",
                days > LONG_WAIT_DAYS ? "text-wait-long" : "text-ink",
              )}
            >
              {days === 0 ? "Added today" : `${days} ${plural(days, "day", "days")}`}
            </span>
          </MetaCell>
          <MetaCell label="Added">
            <span className="text-[13px] text-ink">{formatDate(wish.createdAt)}</span>
          </MetaCell>
          <MetaCell label={wish.fulfilledOn ? "Decided" : "Last edited"}>
            <span className="text-[13px] text-ink">
              {wish.fulfilledOn ? formatDate(wish.fulfilledOn) : formatRelative(wish.updatedAt)}
            </span>
          </MetaCell>
        </dl>

        {wish.links.length > 0 && (
          <section className="mt-6">
            <h3 className="eyebrow text-ink-muted">Links</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {wish.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-[6px] text-[13px] font-medium text-brand-fg hover:underline lg:min-h-0"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-2.5 border-t border-subtle pt-5">
          {footerStart}
          <div className="flex flex-wrap items-center gap-2.5 lg:ml-auto">
            <DeleteWishDialog wishId={wish.id} name={wish.name} />
            <Button asChild variant="secondary">
              <Link href={`/wish/${wish.id}/edit`}>Edit wish</Link>
            </Button>
            <StatusActions wish={wish} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-card px-4 py-3.5">
      <dt className="eyebrow text-ink-muted">{label}</dt>
      <dd className="mt-2">{children}</dd>
    </div>
  );
}
