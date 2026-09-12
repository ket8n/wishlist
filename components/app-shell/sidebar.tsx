import { AccountMenu } from "@/components/app-shell/account-menu";
import { NavLink } from "@/components/app-shell/nav-link";
import { navItemClass } from "@/components/app-shell/nav-styles";
import { BrandMark } from "@/components/brand-mark";
import type { CurrentUser } from "@/lib/auth/session";
import { logOut } from "@/lib/auth/actions";
import { countInWords, plural } from "@/lib/format";
import type { WishStats } from "@/lib/services/wishes";

export function firstNameOf(user: CurrentUser) {
  return user.name?.trim().split(/\s+/)[0] ?? null;
}

function initialsOf(user: CurrentUser) {
  const source = user.name ?? user.email ?? "?";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Sidebar({ user, stats }: { user: CurrentUser; stats: WishStats }) {
  const firstName = firstNameOf(user);

  return (
    <aside className="sticky top-0 hidden h-dvh w-[236px] shrink-0 flex-col overflow-y-auto border-r bg-chrome px-5 py-7 lg:flex">
      <BrandMark />
      {firstName && <p className="eyebrow mt-[9px] pl-8 text-ink-muted">{firstName}&apos;s</p>}

      <nav aria-label="Main" className="mt-[34px] flex flex-col gap-[3px]">
        <NavLink href="/dashboard" className={navItemClass}>
          <span aria-hidden className="size-[7px] shrink-0 rounded-[2px] bg-brand" />
          My Wishlist
          <span className="ml-auto font-mono text-[11px] font-medium text-ink-muted">{stats.total}</span>
        </NavLink>
        <NavLink href="/wish/new" className={navItemClass}>
          <span aria-hidden className="size-[7px] shrink-0 rounded-[2px] border border-control" />
          Add a wish
        </NavLink>
        <AccountMenu user={user} side="right" align="start">
          <button type="button" className={navItemClass}>
            <span aria-hidden className="size-[7px] shrink-0 rounded-full border border-control" />
            Account
          </button>
        </AccountMenu>
      </nav>

      <section aria-labelledby="stand-title" className="mt-8 border-t border-subtle pt-5">
        <h2 id="stand-title" className="eyebrow mb-3.5 text-ink-muted">
          Where things stand
        </h2>
        <dl className="flex flex-col gap-[11px] text-[12.5px] leading-[1.2]">
          {[
            ["Still thinking", stats.pending],
            ["Went for it", stats.bought + stats.completed],
            ["Let it go", stats.rejected],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <dt className="text-ink-secondary">{label}</dt>
              <dd className="font-mono text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        {stats.waitingOverMonth > 0 && (
          <p className="voice mt-[15px] text-[14px] leading-[1.45] text-ink-muted">
            {countInWords(stats.waitingOverMonth, true)}{" "}
            {plural(stats.waitingOverMonth, "wish has", "wishes have")} been waiting over a month.
          </p>
        )}
      </section>

      <div className="mt-auto flex items-center gap-[11px] border-t border-subtle pt-5">
        <span
          aria-hidden
          className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-brand-tint text-[11px] font-semibold text-brand-fg"
        >
          {initialsOf(user)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12.5px] leading-[1.2] font-medium text-ink">
            {user.name ?? user.email}
          </p>
          <form action={logOut}>
            <button
              type="submit"
              className="mt-[3px] rounded-[4px] text-[11.5px] leading-[1.3] text-ink-muted underline decoration-control underline-offset-2 hover:text-ink"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
