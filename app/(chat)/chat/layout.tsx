import { ChatProvider } from "@/store/chat-context";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SessionUser } from "@/types";
import { redirect } from "next/navigation";

import { StoreSync } from "@/store/store-sync";
import Navbar from "@/components/navbar";


export default async function ChatPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  const user = session?.user as unknown as SessionUser;

  return (
    <ChatProvider user={user}>
      <StoreSync />
      <SidebarProvider>
        {/* <AppSidebar /> */}
        <SidebarInset>
          <div className="flex flex-col h-80%  text-[#ececec]">
            <Navbar />
            {/* <header className="flex items-center justify-between px-4 py-3 h-15 shrink-0">
              <div className="flex md:hidden">
                <SidebarTrigger />
              </div>
              <div className="items-center hidden md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-[18px] font-semibold hover:bg-[#2f2f2f] text-[#b4b4b4] px-2 py-1 h-auto flex items-center gap-1 focus-visible:ring-0"
                    >
                      CodersGPT <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#2f2f2f] border-[#424242] text-white rounded-xl p-2 min-w-50">
                    <DropdownMenuItem className="rounded-lg focus:bg-[#424242]">
                      CodersGPT Plus
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg focus:bg-[#424242]">
                      CodersGPT
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <UpgradeComponent />

              <div className="flex items-center">
                <ModelSelectorComponent />
              </div>
            </header> */}

            <main className="flex-1 min-h-0 relative flex flex-col">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ChatProvider>
  );
}