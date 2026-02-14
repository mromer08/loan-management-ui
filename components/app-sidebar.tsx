"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Clientes",
      url: "/dashboard/customers",
      icon: (
        <User
        />
      ),
      isActive: true,
      items: [
        {
          title: "Registrar cliente",
          url: "/dashboard/customers/new",
        },
        {
          title: "Listado de clientes",
          url: "/dashboard/customers",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <Image src="/icons/chn.png" alt="CHN Logo" width={30} height={30} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">BANCO CHN</span>
                  <span className="truncate text-xs">Manejo de prestamos</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <p className="text-sm">
          CHN | Examen practico
        </p>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
