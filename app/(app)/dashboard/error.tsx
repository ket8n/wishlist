"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="rounded-[12px] border border-subtle bg-sunken px-5 py-6">
      <h2 className="text-[15px] leading-[1.3] font-semibold text-rejected">
        We couldn&apos;t load your wishes.
      </h2>
      <p className="mt-1.5 text-[13px] leading-[1.5] text-ink-muted">
        This is usually temporary. Nothing you saved has been lost.
      </p>
      <Button onClick={() => retry()} className="mt-4">
        Try again
      </Button>
    </section>
  );
}
