import type { Metadata } from "next";

import { WishForm } from "@/components/wishlist/wish-form";
import { requireUser } from "@/lib/auth/session";
import { wishDraftSchema } from "@/lib/validation/wish";

export const metadata: Metadata = { title: "Add a wish" };

export default async function NewWishPage({ searchParams }: PageProps<"/wish/new">) {
  await requireUser();
  const { image, ...draft } = wishDraftSchema.parse(await searchParams);

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <header className="mb-7">
        <p className="eyebrow text-ink-muted">What have you been thinking about?</p>
        <h1 className="mt-2.5 text-[25px] leading-[1.15] font-semibold tracking-[-0.025em] text-ink lg:text-[26px]">
          Add a wish
        </h1>
        <p className="mt-2 text-[13px] leading-[1.45] text-ink-muted">
          Only the name is required, everything else can wait.
        </p>
      </header>
      <WishForm draft={{ ...draft, images: image ? [image] : undefined }} />
    </div>
  );
}
