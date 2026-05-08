"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import { useChat } from "@ai-sdk/react";
import InputContainer from "./input-container";
import { useChatStore } from "@/store/chat-context";
import { StoredMessage } from "@langchain/core/messages";
import { convertLangChainToUI } from "@/lib/converters";

import {
  GeneratingSpinner,
  MessageRenderer,
} from "@/components/message-renderer";

export const ChatInterfaceNew = ({
  old_messages,
}: {
  old_messages: StoredMessage[];
}) => {
  const oldMessagesConverted = convertLangChainToUI(old_messages);

  const chatInstance = useChatStore((s) => s.chatInstance);
  const { messages, status, regenerate } = useChat({
    chat: chatInstance,
  });

  const lastOldMsg = oldMessagesConverted[oldMessagesConverted.length - 1];
  const firstNewMsg = messages[0];

  const displayOldMessages =
    lastOldMsg && firstNewMsg && lastOldMsg.id === firstNewMsg.id
      ? oldMessagesConverted.slice(0, -1)
      : oldMessagesConverted;

  if (messages.length == 0 && old_messages.length == 0) {
    return (
      <>
        {/* Empty State View */}
        <div className="flex flex-col flex-1 h-full w-full min-h-0 overflow-y-scroll">
          <main className="h-full flex flex-col items-center justify-end md:justify-center max-w-4xl mx-auto w-full px-4 -mt-20">
            {/* ChatBot branded empty state heading */}
            <h1 className="text-3xl font-semibold mb-2 tracking-tight">
              Hello! 👋
            </h1>
            <p className="text-base mb-8">
              I'm ChatBot — ask me anything about admissions, exams, or campus life.
            </p>
            <InputContainer />
          </main>
        </div>
      </>
    );
  } else {
    return (
      <>
        {/* Active Chat View */}
        <div className="flex flex-col h-full w-full min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 w-full relative">
            <Conversation className="h-full w-full">
              <ConversationContent className="max-w-200 mx-auto w-full px-4 pt-4">
                <MessageRenderer
                  messages={displayOldMessages}
                  regenerate={() => {}}
                />
                <MessageRenderer messages={messages} regenerate={regenerate} />
                {status === "submitted" && <GeneratingSpinner />}
              </ConversationContent>

              <ConversationScrollButton />
            </Conversation>
          </div>

          {/* Fade from ChatBot page background upward, so InputContainer floats cleanly */}
          <div className="w-full  to-transparent shrink-0">
            <div className="max-w-5xl mx-auto w-full px-4 pb-6 pt-6">
              <InputContainer />
            </div>
          </div>
        </div>
      </>
    );
  }
};