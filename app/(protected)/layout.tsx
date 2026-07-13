import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { AppShellProvider } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAuthSession, toSidebarUser } from "@/lib/session";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAuthSession();
  const sidebarUser = toSidebarUser(session);

  if (!sidebarUser) {
    redirect("/");
  }

  return (
    <AppShellProvider>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar user={sidebarUser} />
            <SidebarInset>{children}</SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AppShellProvider>
  );
}
