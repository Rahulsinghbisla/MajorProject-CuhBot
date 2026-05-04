import { useChat } from "@ai-sdk/react";
import { useChatStore } from "@/store/chat-context";
import { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { UIDataTypes, UIMessage } from "ai";
import { MyUITools } from "@/app/api/chat/tools";

type MyUIMessage = UIMessage<never, UIDataTypes, MyUITools>;


export function useChatLogic() {
  const { model, webSearch, setInput } = useChatStore((s) => s);
  
  const chatApi = useChat<MyUIMessage>({
    // You can add onFinish or other callbacks here for logging/analytics
  });

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);
    
    if (!(hasText || hasAttachments)) return;

    chatApi.sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: { model, webSearch },
      }
    );
    setInput("");
  };

  const handleSuggestionClick = (actionText: string) => {
    chatApi.sendMessage(
      { text: actionText },
      { body: { model, webSearch } }
    );
  };

  return {
    ...chatApi,
    handleSubmit,
    handleSuggestionClick,
  };
}