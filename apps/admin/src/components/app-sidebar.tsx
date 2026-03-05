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
  Video,
  UsersRound,
  Bell,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Menu sections.
interface NavItem {
  title: string
  url: string
  icon: React.ElementType
  items?: {
    title: string
    url: string
  }[]
}

interface NavSection {
  label: string
  items: NavItem[]
}

const sections: NavSection[] = [
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
      {
        title: "Groups",
        url: "/groups",
        icon: UsersRound,
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
        items: [
          {
            title: "View All",
            url: "/devotions",
          },
          {
            title: "Add New",
            url: "/devotions/add",
          },
        ],
      },
      {
        title: "Sermons",
        url: "/sermons",
        icon: Video,
        items: [
          {
            title: "View All",
            url: "/sermons",
          },
          {
            title: "Add New",
            url: "/sermons/add",
          },
        ],
      },
      {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
        items: [
          {
            title: "View All",
            url: "/notifications",
          },
          {
            title: "Create",
            url: "/notifications/add",
          },
        ],
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
                    {item.items?.length ? (
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={location.pathname === subItem.url}
                            >
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
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
