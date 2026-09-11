import { cn } from "@/lib/utils";

// 22px indigo square + wordmark (DESIGN_SPEC §7.12).
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span aria-hidden className="size-[22px] rounded-[6px] bg-brand" />
      <span className="text-[15.5px] leading-none font-semibold tracking-[-0.015em] text-ink">
        Wishlist
      </span>
    </span>
  );
}
