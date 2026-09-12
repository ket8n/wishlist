import Link from "next/link";
import { List, Plus, User } from "lucide-react";

import { AccountMenu } from "@/components/app-shell/account-menu";
import { NavLink } from "@/components/app-shell/nav-link";
import { tabItemClass } from "@/components/app-shell/nav-styles";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import type { CurrentUser } from "@/lib/auth/session";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-chrome px-5 lg:hidden">
      <Link href="/dashboard" aria-label="Wishlist home" className="rounded-[6px]">
        <BrandMark />
      </Link>
    </header>
  );
}

export function TabBar({ user }: { user: CurrentUser }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 items-center gap-2 border-t bg-chrome px-5 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] lg:hidden"
    >
      <NavLink href="/dashboard" className={tabItemClass}>
        <List aria-hidden />
        Wishlist
      </NavLink>
      <Button asChild variant="primary" className="h-11">
        <Link href="/wish/new">
          <Plus />
          Add wish
        </Link>
      </Button>
      <AccountMenu user={user} side="top" align="end">
        <button type="button" className={tabItemClass}>
          <User aria-hidden />
          Account
        </button>
      </AccountMenu>
    </nav>
  );
}
