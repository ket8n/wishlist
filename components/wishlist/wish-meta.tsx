import { LONG_WAIT_DAYS, PRIORITY_LABEL, plural } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { WISH_PRIORITIES } from "@/lib/validation/wish";

type Priority = (typeof WISH_PRIORITIES)[number];

const SWATCH: Record<Priority, string> = {
  HIGH: "bg-priority-high",
  MEDIUM: "bg-priority-medium",
  LOW: "bg-priority-low",
};

export function PriorityLabel({ priority }: { priority: Priority }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11.5px] leading-none font-medium text-ink-secondary">
      <span aria-hidden className={cn("size-1.5 shrink-0 rounded-[1px]", SWATCH[priority])} />
      Priority: {PRIORITY_LABEL[priority]}
    </span>
  );
}

export function WaitLine({ days }: { days: number }) {
  return (
    <span
      className={cn(
        "text-[11.5px] leading-none font-medium",
        days > LONG_WAIT_DAYS ? "text-wait-long" : "text-wait",
      )}
    >
      {days === 0 ? "Added today" : `In your list ${days} ${plural(days, "day", "days")}`}
    </span>
  );
}
