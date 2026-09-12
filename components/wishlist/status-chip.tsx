import { STATUS_LABEL } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { WishStatusValue } from "@/lib/validation/wish";

const STYLE: Record<WishStatusValue, string> = {
  PENDING: "bg-pending-bg text-pending",
  BOUGHT: "bg-bought-bg text-bought",
  COMPLETED: "bg-completed-bg text-completed",
  REJECTED: "bg-rejected-bg text-rejected",
};

export function StatusChip({ status, className }: { status: WishStatusValue; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-[6px] px-[9px] py-1 text-[11px] leading-none font-semibold",
        STYLE[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
