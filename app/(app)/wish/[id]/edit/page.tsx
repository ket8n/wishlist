import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WishForm } from "@/components/wishlist/wish-form";
import { requireUser } from "@/lib/auth/session";
import { getWish } from "@/lib/services/wishes";

export const metadata: Metadata = { title: "Edit wish" };

export default async function EditWishPage({ params }: PageProps<"/wish/[id]/edit">) {
  const user = await requireUser();
  const { id } = await params;
  const wish = await getWish(user.id, id);
  if (!wish) notFound();

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <header className="mb-7">
        <p className="eyebrow text-ink-muted">Editing</p>
        <h1 className="mt-2.5 truncate text-[25px] leading-[1.15] font-semibold tracking-[-0.025em] text-ink lg:text-[26px]">
          {wish.name}
        </h1>
      </header>
      <WishForm wish={wish} />
    </div>
  );
}
