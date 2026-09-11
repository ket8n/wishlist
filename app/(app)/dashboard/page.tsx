import type { Metadata } from "next";

import { BrandMark } from "@/components/brand-mark";
import { ThemeControl } from "@/components/theme/theme-control";
import { Button } from "@/components/ui/button";
import { logOut } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "My Wishlist" };

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0];

  return (
    <main className="mx-auto w-full max-w-[640px] px-5 py-10 lg:px-10">
      <BrandMark />

      <header className="mt-10">
        {firstName && <p className="eyebrow text-ink-muted">{firstName}&apos;s</p>}
        <h1 className="mt-2 text-[25px] leading-[1.15] font-semibold tracking-[-0.025em] text-ink lg:text-[27px]">
          My Wishlist
        </h1>
        <p className="mt-2 text-[13px] leading-[1.45] text-ink-muted">
          Signed in as {user.email ?? user.name}.
        </p>
      </header>

      <section aria-labelledby="account-title" className="mt-10 max-w-[360px] border-t border-subtle pt-5">
        <h2 id="account-title" className="eyebrow text-ink-muted">
          Theme
        </h2>
        <div className="mt-3">
          <ThemeControl />
        </div>
        <form action={logOut} className="mt-6">
          <Button type="submit" variant="quiet">
            Log out
          </Button>
        </form>
      </section>
    </main>
  );
}
