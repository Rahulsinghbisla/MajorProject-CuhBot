import {
  StateGraph,
  StateSchema,
  MessagesValue,
  START,
  END,
  GraphNode,
} from "@langchain/langgraph";

import { z } from "zod";
import { SystemMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, ToolMessage } from "@langchain/core/messages";

const MessagesState = new StateSchema({
  messages: MessagesValue,
  summary: z.string(),
});

import { getDynamicModel } from "./model";
import { getCheckpoint } from "@/lib/memory";
import { tools, UI_TOOL_NAMES } from "./tools";
import { BASE_SYSTEM_PROMPT_TEMPLATE } from "./prompts";

const checkpointer = await getCheckpoint();

const llmCall: GraphNode<typeof MessagesState.State> = async (
  state,
  runtime,
) => {
  const userId = runtime.context?.user_id;
  if (!userId) {
    console.error("userid required");
    return {};
  }

  const selectedModelId = runtime.context?.selectedModel || "gpt-5-mini";
  const modelx = await getDynamicModel(selectedModelId, userId);
  const modelWithTools = modelx.bindTools(tools);

  const summaryContext = state.summary
    ? `\n\nHere is a summary of the earlier conversation for context:\n${state.summary}`
    : "";

  const currentDate = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  const staticUserContext = `Current Date/Time: ${currentDate}\nUser ID: ${userId}`;

  const formattedSystemPrompt = await BASE_SYSTEM_PROMPT_TEMPLATE.format({
    user_details_content: staticUserContext,
    context_summary: summaryContext,
  });

  const dynamicSystemMessage = new SystemMessage({
    content: formattedSystemPrompt,
  });

  const response = await modelWithTools.invoke([
    dynamicSystemMessage,
    ...state.messages,
  ]);

  return {
    messages: [response],
  };
};

const shouldContinue = (state: typeof MessagesState.State) => {
  const lastMessage = state.messages.at(-1);

  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return END;
  }
  if (lastMessage.tool_calls?.length) {
    return "toolNode";
  }

  return END;
};

const routeAfterTool = (state: typeof MessagesState.State) => {
  const lastMessage = state.messages.at(-1);

  if (lastMessage instanceof ToolMessage) {
    console.log("Last message was a tool call:", lastMessage.name);
    if (UI_TOOL_NAMES.includes(lastMessage.name!)) {
      return END;
    }
  }

  return "llmCall";
};

const toolNode = new ToolNode(tools);

export const graph = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)

  .addEdge(START, "llmCall")

  // ✅ Fix 1: No static .addEdge("llmCall", END) — only conditional routing
  // ✅ Fix 2: Full mapping includes both possible return values of shouldContinue
  .addConditionalEdges("llmCall", shouldContinue, {
    toolNode: "toolNode",
    [END]: END,
  })

  // routeAfterTool already returns "llmCall" or END directly — no mapping needed
  .addConditionalEdges("toolNode", routeAfterTool)

  .compile({ checkpointer });