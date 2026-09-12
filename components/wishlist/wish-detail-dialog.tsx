"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { WishDetail } from "@/components/wishlist/wish-detail";
import type { WishView } from "@/lib/services/wishes";

export function WishDetailDialog({
  wish,
  open,
  onOpenChange,
}: {
  wish: WishView;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-[920px]">
        <div className="p-[18px] lg:p-6">
          <WishDetail
            wish={wish}
            title={
              <DialogTitle className="mt-3 text-[23px] leading-[1.2] font-semibold tracking-[-0.025em] text-ink lg:text-[26px]">
                {wish.name}
              </DialogTitle>
            }
            footerStart={
              <Link
                href={`/wish/${wish.id}`}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-[6px] text-[12.5px] font-medium text-ink-muted hover:text-ink lg:min-h-0"
              >
                Open full page
                <ArrowUpRight className="size-3.5" />
              </Link>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
