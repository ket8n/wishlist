import { cn } from "@/lib/utils";

// 1 col <768 · 2 col to 1279 · 3 col to 1699 · 4 col above.
export function WishGrid({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-[13px] md:grid-cols-2 md:gap-5 xl:grid-cols-3 min-[1700px]:grid-cols-4",
        className,
      )}
    >
      {children}
    </ul>
  );
}
