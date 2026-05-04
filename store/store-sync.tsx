"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useChatStore } from "@/store/chat-context";
import { useQueryClient } from "@tanstack/react-query";

export function StoreSync() {
  const pathname = usePathname();
  const resetChatInstance = useChatStore((s) => s.reset);
  const lastPath = useRef<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const isNavigating = lastPath.current !== null && lastPath.current !== pathname;
    const old_last_path = lastPath.current;
    lastPath.current = pathname;
    queryClient.invalidateQueries({ queryKey: ["threads"] });

    if (old_last_path == "/") {
      return;
    }

    if (isNavigating) {
      resetChatInstance();
      console.log("reset chat instance");
    }
  }, [pathname, resetChatInstance]);

  return null;
}
