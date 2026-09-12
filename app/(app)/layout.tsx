import { MobileHeader, TabBar } from "@/components/app-shell/mobile-nav";
import { Sidebar } from "@/components/app-shell/sidebar";
import { requireUser } from "@/lib/auth/session";
import { getWishStats } from "@/lib/services/wishes";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  const stats = await getWishStats(user.id);

  return (
    <div className="flex flex-1">
      <Sidebar user={user} stats={stats} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 px-5 pt-6 pb-[calc(96px+env(safe-area-inset-bottom))] lg:px-10 lg:pt-[34px] lg:pb-12">
          {children}
        </main>
      </div>
      <TabBar user={user} />
    </div>
  );
}
