"use client";

import { v4 as uuidv4 } from "uuid";
import { useChat } from "@ai-sdk/react";
import { useParams, useRouter } from "next/navigation";
import { Plus, AudioLines, ArrowUp } from "lucide-react";

import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { useChatStore } from "@/store/chat-context";
import { SpeechInput } from "@/components/ai-elements/speech-input";

function InputContainer() {
  const chatInstance = useChatStore((s) => s.chatInstance);
  const { sendMessage } = useChat({ chat: chatInstance });
  const { input, setInput } = useChatStore((s) => s);
  const selectedModel = useChatStore((s) => s.model);

  const router = useRouter();
  const params = useParams();
  const urlThreadId = params?.thread_id as string;
  const finalThreadId = urlThreadId || uuidv4();

  return (
    <div className="flex flex-col items-center w-full max-w-200 mx-auto pb-6 bg-red">
      <PromptInput
        className="w-full bg-white rounded-full shadow-[0_4px_24px_rgba(94,80,200,0.10)] border border-[#E8E6F8]"
        onSubmit={(message) => {
          if (!message.text) {
            return;
          }
          if (!urlThreadId) router.push(`/chat/${finalThreadId}`);
          sendMessage(message, {
            body: { thread_id: finalThreadId, selectedModel: selectedModel },
          });
          setInput("");
        }}
      >
        <PromptInputBody className="flex items-end w-full px-2">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#9B93D8] hover:bg-[#F0EEFF] hover:text-[#5E50C8] transition-colors mb-0.5"
          >
            <Plus size={24} strokeWidth={1.5} />
          </button>

          <div className="flex-1 min-w-0 items-center justify-center w-full h-full mx-2">
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Ask UniBot anything..."
              className="w-full flex items-center justify-center bg-transparent border-none focus:ring-0 focus-visible:ring-0 py-3 text-[16px] text-[#2D2B4E] placeholder:text-[#9B93D8] resize-none min-h-11 max-h-50 leading-tight"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 mb-0.5">
            <SpeechInput
              className="shrink-0 h-10 w-10 bg-transparent text-[#9B93D8] hover:text-[#5E50C8] hover:bg-[#F0EEFF] rounded-full transition-colors"
              onTranscriptionChange={(text) => {
                setInput(input + text);
              }}
              size="icon-lg"
              variant="ghost"
            />

            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5E50C8] text-white hover:bg-[#4A3CB8] transition-all shadow-[0_4px_12px_rgba(94,80,200,0.35)]"
            >
              {input ? <ArrowUp size={20} /> : <AudioLines size={20} />}
            </button>
          </div>
        </PromptInputBody>
      </PromptInput>
    </div>
  );
}

export default InputContainer;