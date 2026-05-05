"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Pencil, Share, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";
import { deleteThread, fetchThreads } from "@/http/threads";
import { usePathname, useRouter } from "next/navigation";

type Thread = {
  title:string;
  id:string;
}

export function ThreadsLists() {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  const {
    data: threads = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["threads"],
    queryFn: fetchThreads,
  });

const mutation = useMutation({
    mutationFn: async (threadid: string) => {
      await deleteThread(threadid);
    },
    // 1. Intercept the mutation before it fires to update the UI instantly
    onMutate: async (deletedThreadId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["threads"] });

      // Snapshot the previous value in case we need to roll back
      const previousThreads = queryClient.getQueryData<Thread[]>(["threads"]);

      // Optimistically update the cache by removing the deleted thread
      queryClient.setQueryData<Thread[]>(["threads"], (old) => {
        return old ? old.filter((thread) => thread.id !== deletedThreadId) : [];
      });

      // Optimistically redirect if they are currently viewing the deleted thread
      if (pathname === `/chat/${deletedThreadId}`) {
        router.push("/");
      }

      // Return a context object containing the snapshotted value
      return { previousThreads };
    },
    // 2. If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, deletedThreadId, context) => {
      if (context?.previousThreads) {
        queryClient.setQueryData(["threads"], context.previousThreads);
      }
    },
    // 3. Always refetch after error or success to ensure data is in sync with the server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });

  let threadMenuContent;

  if (isLoading) {
    threadMenuContent = (
      <>
        {[1, 2, 3, 4, 5].map((item) => {
          return (
            <SidebarMenuItem
              key={item}
              className="group/item relative pointer-events-none"
            >
              <SidebarMenuButton
                className={cn(
                  "h-9 rounded-lg transition-all px-3 pr-10 cursor-pointer",
                  "hover:bg-transparent",
                )}
              >
                <Skeleton className="w-full h-full bg-[#212121]" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </>
    );
  } else if (isError) {
    threadMenuContent = (
      <SidebarMenuItem>
        <SidebarMenuButton>
          <span>Error loading threads: {(error as Error).message}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  } else if (threads.length === 0) {
    threadMenuContent = (
      <SidebarMenuItem>
        <SidebarMenuButton>
          <span>No old chat</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  } else {
    threadMenuContent = threads.map((thread) => (
      <SidebarMenuItem key={thread.id} className="group/item relative">
        <Link href={`/chat/${thread.id}`}>
          <SidebarMenuButton
            isActive={thread.id == "active"}
            className={cn(
              "h-9 rounded-lg transition-all px-3 pr-10 cursor-pointer",
              thread.id == "active"
                ? "bg-[#212121] text-white"
                : "hover:bg-[#212121] text-[#ececec] hover:text-white",
            )}
          >
            {mutation.isPending && mutation.variables == thread.id && (
              <Spinner />
            )}
            <span
              className={cn(
                "text-[13.5px] truncate font-normal",
                mutation.isPending && mutation.variables == thread.id
                  ? "line-through opacity-40"
                  : "",
              )}
            >
              {thread.title}
            </span>
          </SidebarMenuButton>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction
              className={cn(
                "opacity-0 group-hover/item:opacity-100 focus:opacity-100 data-[state=open]:opacity-100 transition-opacity mr-1",
                thread.id == "active" && "opacity-100",
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            className="min-w-50 rounded-xl p-1.5 shadow-xl shadow-black/50"
          >
            <DropdownMenuItem
              className="gap-3 px-3 py-2.5 rounded-md focus:bg-[#424242] focus:text-white cursor-pointer transition-colors"
              onClick={() =>
                navigator.clipboard.writeText(`/threads/${thread.id}`)
              }
            >
              <Share className="h-4 w-4 opacity-70" />{" "}
              <span className="text-sm">Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-3 px-3 py-2.5 rounded-md focus:bg-[#424242] focus:text-white cursor-pointer transition-colors"
              onClick={() => window.open(`/threads/${thread.id}`, "_blank")}
            >
              <Pencil className="h-4 w-4 opacity-70" />{" "}
              <span className="text-sm">Open In New Tav</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#424242] my-1" />
            <DropdownMenuItem
              className="gap-3 px-3 py-2.5 rounded-md focus:bg-[#f33f3f]/10 focus:text-[#f33f3f] text-[#f33f3f] cursor-pointer transition-colors"
              onClick={() => {
                console.log("hii", thread.id);
                mutation.mutate(thread.id);
              }}
            >
              <Trash2 className="h-4 w-4" />{" "}
              <span className="text-sm">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    ));
  }

  return (
    <>
      <SidebarGroup className="p-0 group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="text-[12px] font-medium text-[#b4b4b4] px-3 mb-1 mt-4">
          Recent
        </SidebarGroupLabel>
        <SidebarMenu className="gap-0.5">{threadMenuContent}</SidebarMenu>
      </SidebarGroup>
    </>
  );
}

export default ThreadsLists;
