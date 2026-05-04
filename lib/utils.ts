import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { getEncoding } from "js-tiktoken";
import { BaseMessage } from "@langchain/core/messages";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export const countTokensApproximately = (messages: BaseMessage[]): number => {
  let charCount = 0;
  for (const msg of messages) {
    // Handle standard string content
    if (typeof msg.content === "string") {
      charCount += msg.content.length;
    }
    // Handle complex content (like image URLs or tool arrays)
    else if (Array.isArray(msg.content) || typeof msg.content === "object") {
      charCount += JSON.stringify(msg.content).length;
    }
  }
  // Industry standard approximation: 1 token ≈ 4 characters
  return Math.ceil(charCount / 4);
};

const enc = getEncoding("o200k_base");

export const countTokensExact = (messages: BaseMessage[]): number => {
  let totalTokens = 0;

  for (const msg of messages) {
    // Every message has some overhead (role, name, etc.)
    // For OpenAI, this is typically ~3-4 tokens per message
    totalTokens += 4; 

    if (typeof msg.content === "string") {
      totalTokens += enc.encode(msg.content).length;
    } 
    else if (Array.isArray(msg.content)) {
      // For multimodal content, you'd need to handle images specifically.
      // For now, we stringify and encode for text-based objects.
      totalTokens += enc.encode(JSON.stringify(msg.content)).length;
    }

    // If the message has a name (common in tool/function calls), add +1
    if (msg.additional_kwargs?.name) {
      totalTokens += 1;
    }
  }

  // Every conversation ends with a "reply" overhead of ~3 tokens
  totalTokens += 3;

  return totalTokens;
};