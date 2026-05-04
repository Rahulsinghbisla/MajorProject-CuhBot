import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { haveSubscription } from "@/http/polar";

export const model = new ChatOpenAI({
  model: "gpt-5-nano",
});

export const getDynamicModel = async (modelId: string, user_id?: string) => {
  // initChatModel not working
  // if (["gpt-5-mini", "gpt-5-nano", "gemini-2.0-flash-exp"].includes(modelId)) {
  //   console.log("using", modelId);
  //   return await initChatModel("gpt-5-nano", { modelProvider: "openai" });
  // }

  if (["gpt-5-mini", "gpt-5-nano"].includes(modelId)) {
    // console.log("using", modelId);
    return new ChatOpenAI({
      model: modelId,
      streamUsage:true
    });
  }

  if (
    ["gemini-3.1-pro-preview"].includes(modelId) &&
    user_id &&
    (await haveSubscription(user_id))
  ) {
    // can be improve here using cachin not check every time
    return new ChatGoogleGenerativeAI({
      model: modelId,
      streamUsage:true
    });
  } else {
    return new ChatOpenAI({
      model: "gpt-5-nano",
      streamUsage:true
    });
  }

  // if (modelId.includes("claude")) {
  //   return new ChatAnthropic({
  //     model: modelId,
  //     temperature: 0, // Adjust based on your preference
  //   });
  // }
};

// 1. Move the description of what a "Memory" is inside the child schema
const MemoryItemSchema = z.object({
  text: z.string().describe("Atomic user memory as a short sentence"),
  is_new: z.boolean().describe("True if this memory is NEW. False if duplicate.")
}).describe("An individual memory item"); // Description is safe here

const MemoryDecisionSchema = z.object({
  should_write: z.boolean().describe("Whether to store any memories"),
  // 2. REMOVE .describe() and .default() from here
  // OpenAI Strict mode requires arrays of objects to be "clean" references
  memories: z.array(MemoryItemSchema) 
});

export const memoryExtractor = model.withStructuredOutput(MemoryDecisionSchema, {
  name: "memory_extractor",
  // If you are using OpenAI, you can try setting strict: false 
  // if you absolutely need defaults, but cleaning the schema is better.
  strict: true,
});