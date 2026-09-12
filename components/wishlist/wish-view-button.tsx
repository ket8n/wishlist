"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { WishDetailDialog } from "@/components/wishlist/wish-detail-dialog";
import type { WishView } from "@/lib/services/wishes";
import { cn } from "@/lib/utils";

export function WishViewButton({
  wish,
  variant = "quiet",
  className,
}: {
  wish: WishView;
  variant?: "quiet" | "link";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {variant === "link" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "inline-flex min-h-11 items-center rounded-[6px] px-1 text-[11.5px] font-semibold text-brand-fg hover:underline lg:min-h-0",
            className,
          )}
        >
          View<span className="sr-only"> {wish.name}</span>
        </button>
      ) : (
        <Button
          variant="quiet"
          size="sm"
          onClick={() => setOpen(true)}
          className={cn("text-brand-strong", className)}
        >
          View<span className="sr-only"> {wish.name}</span>
        </Button>
      )}
      <WishDetailDialog wish={wish} open={open} onOpenChange={setOpen} />
    </>
  );
}
