import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { WishDetail } from "@/components/wishlist/wish-detail";
import { getCurrentUser, requireUser } from "@/lib/auth/session";
import { getWish } from "@/lib/services/wishes";

export async function generateMetadata({ params }: PageProps<"/wish/[id]">): Promise<Metadata> {
  const user = await getCurrentUser();
  if (!user) return { title: "Wishlist" };
  const { id } = await params;
  const wish = await getWish(user.id, id);
  return { title: wish ? wish.name : "Wishlist" };
}

export default async function WishDetailPage({ params }: PageProps<"/wish/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  const wish = await getWish(user.id, id);
  if (!wish) notFound();

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 rounded-[6px] text-[12.5px] font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="size-3.5" />
        Back to wishlist
      </Link>

      <div className="mt-5">
        <WishDetail
          wish={wish}
          title={
            <h1 className="mt-3 text-[23px] leading-[1.2] font-semibold tracking-[-0.025em] text-ink lg:text-[26px]">
              {wish.name}
            </h1>
          }
        />
      </div>
    </div>
  );
}
