// chat-context.tsx
"use client";

import { useStore } from "zustand";
import { createContext, useContext, useRef, ReactNode } from "react";
import { createChatStore, ChatStore, ChatState } from "./chat-store";
import { SessionUser } from "@/types";

export const ChatContext = createContext<ChatStore | null>(null);

interface ChatProviderProps {
  children: ReactNode;
  user: SessionUser; // Require user from server
}

export function ChatProvider({ children, user }: ChatProviderProps) {
  const storeRef = useRef<ChatStore>(null);
  
  if (!storeRef.current) {
    // Initialize store with the user data passed from Server Component
    storeRef.current = createChatStore({ user });
  }

  return (
    <ChatContext.Provider value={storeRef.current}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatStore<T>(selector: (state: ChatState) => T): T {
  const store = useContext(ChatContext);
  if (!store) throw new Error("useChatStore must be used within ChatProvider");
  return useStore(store, selector);
}