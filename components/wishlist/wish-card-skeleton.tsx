export function WishCardSkeleton() {
  return (
    <div
      aria-hidden
      className="flex gap-3 rounded-[12px] border bg-card p-3 shadow-card md:flex-col md:gap-0 md:overflow-hidden md:p-0"
    >
      <div className="skeleton min-h-24 w-24 shrink-0 rounded-[9px] md:h-[150px] md:min-h-0 md:w-full md:rounded-none" />
      <div className="flex min-w-0 flex-1 flex-col md:px-4 md:pt-[15px] md:pb-[14px]">
        <div className="skeleton h-[21px] w-3/5 rounded-[5px]" />
        <div className="mt-[7px] flex h-[38px] flex-col gap-2 pt-1">
          <div className="skeleton h-3 w-full rounded-[4px]" />
          <div className="skeleton h-3 w-4/5 rounded-[4px]" />
        </div>
        <div className="mt-3.5 flex items-center justify-between">
          <div className="skeleton h-3 w-24 rounded-[4px]" />
          <div className="skeleton h-3.5 w-16 rounded-[4px]" />
        </div>
        <div className="mt-3.5 border-t border-subtle pt-[13px]">
          <div className="skeleton h-11 w-16 rounded-[9px] lg:h-8" />
        </div>
      </div>
    </div>
  );
}
