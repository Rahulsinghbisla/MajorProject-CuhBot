import { create } from "zustand";
import { Chat, UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport, UIDataTypes } from "ai";
import { MyUITools } from "@/app/api/chat/tools";
import { SessionUser } from "@/types";
import { v4 as uuidv4 } from "uuid";

export type MyUIMessage = UIMessage<never, UIDataTypes, MyUITools>;

export interface ChatState {
  user: SessionUser | null; // Added user field
  input: string;
  model: string;
  webSearch: boolean;
  chatInstance: Chat<UIMessage>;
  reset: () => void;
  setInput: (input: string) => void;
  setModel: (model: string) => void;
  setWebSearch: (enabled: boolean) => void;
}

export const createChatStore = (initProps?: Partial<ChatState>) =>
  create<ChatState>((set) => ({
    user: null,
    input: "",
    model: "gpt-5-mini",
    webSearch: false,
    ...initProps,
    chatInstance: new Chat<UIMessage>({
      transport: new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages, body }) => {
          const messageId = uuidv4();
          // console.log("last message from client :", messageId);

          const lastMessage = messages[messages.length - 1];
          let lastMessageText = "";
          if (lastMessage.parts[0].type == "text") {
            lastMessageText = lastMessage.parts[0].text;
          }

          return {
            body: {
              thread_id: body?.thread_id,
              messageId: messageId,
              selectedModel: body?.selectedModel,
              messageContent: lastMessageText,
            },
          };
        },
      }),
    }),
    setInput: (input) => set({ input }),
    setModel: (model) => set({ model }),
    setWebSearch: (webSearch) => set({ webSearch }),
    reset: () =>
      set(() => ({
        input: "",
        chatInstance: new Chat<UIMessage>({
          transport: new DefaultChatTransport({
            api: "/api/chat",
            prepareSendMessagesRequest: ({ messages, body }) => {
              const messageId = uuidv4();
              // console.log("last message from client :", messageId);

              const lastMessage = messages[messages.length - 1];
              let lastMessageText = "";
              if (lastMessage.parts[0].type == "text") {
                lastMessageText = lastMessage.parts[0].text;
              }

              return {
                body: {
                  thread_id: body?.thread_id,
                  messageId: messageId,
                  selectedModel: body?.selectedModel,
                  messageContent: lastMessageText,
                },
              };
            },
          }),
        }),
      })),
  }));

export type ChatStore = ReturnType<typeof createChatStore>;
