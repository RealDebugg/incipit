"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { PenLineIcon, Settings2Icon, LayoutDashboardIcon, TagsIcon } from "lucide-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
      isActive: true,
    },
    {
      title: "Posts",
      url: "/posts",
      icon: (
        <PenLineIcon
        />
      ),
      isActive: false,
    },
    {
      title: "Tags",
      url: "/tags",
      icon: (
        <TagsIcon
        />
      ),
      isActive: false,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: (
        <Settings2Icon
        />
      ),
      isActive: false,
    },
  ],
}

type AppSidebarUser = {
  name: string
  email: string
  avatar: string
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: AppSidebarUser }) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
