"use client";

import { LogOut } from "lucide-react";

import { ThemeControl } from "@/components/theme/theme-control";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { logOut } from "@/lib/auth/actions";
import type { CurrentUser } from "@/lib/auth/session";

export function AccountMenu({
  user,
  side,
  align,
  children,
}: {
  user: CurrentUser;
  side: "top" | "right";
  align: "start" | "end";
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side={side} align={align} sideOffset={8} className="w-[280px] p-0">
        <div className="border-b border-subtle px-4 py-3.5">
          <p className="truncate text-[13px] font-semibold text-ink">{user.name ?? "Your account"}</p>
          {user.email && <p className="mt-0.5 truncate text-[12px] text-ink-muted">{user.email}</p>}
        </div>
        <div className="px-4 py-3.5">
          <p className="eyebrow mb-2.5 text-ink-muted">Theme</p>
          <ThemeControl />
        </div>
        <form action={logOut} className="border-t border-subtle p-1.5">
          <button
            type="submit"
            className="flex h-11 w-full items-center gap-2 rounded-[7px] px-2.5 text-[12.5px] text-ink transition-colors duration-150 hover:bg-btn-quiet lg:h-9"
          >
            <LogOut className="size-4 text-ink-muted" />
            Log out
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
