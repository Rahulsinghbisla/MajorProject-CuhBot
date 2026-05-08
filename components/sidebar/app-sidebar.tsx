import { Home, LayoutGrid, Plus, User2Icon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { SidebarFooterComponent } from "./sidebar-footer";

import Link from "next/link";
import ThreadsLists from "./threads-list";
import { v4 as uuidv4 } from "uuid";


export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const threadId = uuidv4()
  return (
    <Sidebar
      collapsible="icon"
      className="border-none transition-all duration-300 ease-in-out"
      {...props}
    >
      <SidebarHeader className="px-2 pt-3.5">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Logo"
              width={30}
              height={30}
              className="rounded-lg shrink-0"
              priority
            />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <SidebarTrigger className="h-8 w-8 transition-colors" />
          </div>
        </div>
      </SidebarHeader>

      {/* REMOVED group-data-[collapsible=icon]:hidden from SidebarContent */}
      <SidebarContent className="px-1 mt-2">
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-0">
            {[
              { title: "Home", icon: Home, href: "/" },
              { title: "New chat", icon: Plus, href: `/chat/${threadId}` },
              // { title: "Memories", icon: LayoutGrid, href: "/memories" },
            ].map((item) => (
              <SidebarMenuItem
                key={item.title}
                className="flex justify-cente relative"
              >
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    "h-9 transition-colors",
                    // Centering logic for collapsed state
                    "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
                  )}
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="ml-3  text-[14px] font-normal group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                  <Link
                    href={item.href}
                    className="absolute inset-0 cursor-pointer"
                  ></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <ThreadsLists />
      </SidebarContent>

      <SidebarFooter>
        <SidebarFooterComponent />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
