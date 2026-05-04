"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/store/chat-context";
import { Skeleton } from "../ui/skeleton";
import { useLogout } from "@/hooks/use-logout";
import { Spinner } from "../ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { isUserHaveSubscription } from "@/http/polar";
import { authClient } from "@/lib/auth-client";

export function SidebarFooterComponent() {
  const { isMobile } = useSidebar();
  const { mutate, isPending } = useLogout();

  const user = useChatStore((state) => state.user);

  const { data, isSuccess } = useQuery({
    queryKey: ["customer_state"],
    queryFn: async () => {
      return isUserHaveSubscription();
    },
  });
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {isPending ? (
                  <div className="h-8! w-8! text-muted-foreground flex justify-center items-center">
                    <Spinner />
                  </div>
                ) : (
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                      <Skeleton className="h-full w-full rounded-full" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                      <Skeleton className="h-full w-full rounded-full" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {isSuccess && (
                  <>
                    {data ? (
                      <>
                        <DropdownMenuItem className="bg-[#373669] border-[#3e3e4a] text-white !hover:bg-[#373669]/60 text-[12px] font-medium">
                          <Sparkles />
                          Pro Member
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem
                          onClick={async () => {
                            await authClient.checkout({
                              slug: "pro",
                            });
                          }}
                        >
                          <Sparkles />
                          Upgrade to Pro
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  mutate();
                }}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
