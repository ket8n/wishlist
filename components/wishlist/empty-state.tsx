import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <section className="flex flex-col items-center py-12 text-center">
      <h2 className="voice text-[22px] leading-[1.35] text-ink">
        Add something you&apos;ve been thinking about.
      </h2>
      <p className="mt-2 text-[13px] leading-[1.45] text-ink-muted">
        It doesn&apos;t have to be something you&apos;ll buy.
      </p>
      <Button asChild variant="primary" className="mt-6">
        <Link href="/wish/new">
          <Plus />
          Add wish
        </Link>
      </Button>
    </section>
  );
}
