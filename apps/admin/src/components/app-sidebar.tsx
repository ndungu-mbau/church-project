import * as React from "react"
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  Home,
  Church,
  Users,
  UserCog,
  BookOpen,
  Video
} from "lucide-react"
import { Link, useLocation } from "@tanstack/react-router"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Menu sections.
const sections = [
  {
    label: "General",
    items: [
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Todos",
        url: "/todos",
        icon: ListTodo,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
  {
    label: "User Management",
    items: [
      {
        title: "Staff",
        url: "/staff",
        icon: UserCog,
      },
      {
        title: "Members",
        url: "/members",
        icon: Users,
      },
    ],
  },
  {
    label: "Data Management",
    items: [
      {
        title: "Devotions",
        url: "/devotions",
        icon: BookOpen,
      },
      {
        title: "Sermons",
        url: "/sermons",
        icon: Video,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/50">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl overflow-hidden truncate">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Church className="size-5" />
          </div>
          <span className="group-data-[collapsible=icon]:hidden">Imani Manager</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={location.pathname === item.url}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
