import {
  StateGraph,
  StateSchema,
  MessagesValue,
  START,
  END,
  GraphNode,
} from "@langchain/langgraph";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { waitUntil } from "@vercel/functions";

import { trimMessages } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import {
  AIMessage,
  ToolMessage,
  HumanMessage,
  RemoveMessage,
} from "@langchain/core/messages";

const MessagesState = new StateSchema({
  messages: MessagesValue,
  summary: z.string(),
});

import { getDynamicModel, memoryExtractor } from "./model";
import { getCheckpoint } from "@/lib/memory";
import { tools, UI_TOOL_NAMES } from "./tools";

import { getStore } from "@/lib/store";
import { callOpenAIModel } from "@/http/llm";
import { countTokensExact } from "@/lib/utils";
import { BASE_SYSTEM_PROMPT_TEMPLATE, REMEMBER_MEMORY_PROMPT } from "./prompts";
import { ingestEventToPolar } from "@/http/polar";

const MAX_TOKEN_THRESHOLD = 400;

const checkpointer = await getCheckpoint();
const store = await getStore();

const guardrailNode: GraphNode<typeof MessagesState.State> = async (
  state,
  runtime,
) => {
  const lastMessage = state.messages.at(-1);
  if (!lastMessage || lastMessage.type != "human") {
    return {};
  }
  const MAX_MESSAGE_LENGTH = 300;
  const content = lastMessage.content as string;

  if (content.length > MAX_MESSAGE_LENGTH) {
    const truncatedContent =
      content.slice(0, MAX_MESSAGE_LENGTH) + "... [TRUNCATED]";
    return {
      messages: [
        new HumanMessage({
          id: lastMessage.id,
          content: truncatedContent,
        }),
        new AIMessage({
          content: `⚠️ Your message was too long (${content.length} chars). Please keep your question under ${MAX_MESSAGE_LENGTH} characters.`,
        }),
      ],
    };
  } else {
    return {};
  }
};

const summarizeConversation: GraphNode<typeof MessagesState.State> = async (
  state,
  runtime,
) => {
  const existingSummary = state.summary;

  const promptText = existingSummary
    ? `Existing summary:\n${existingSummary}\n\nExtend the summary using the new conversation above.`
    : "Summarize the conversation above.";

  const messagesForSummary = [
    ...state.messages,
    new HumanMessage({ content: promptText }),
  ];

  const responseContent = await callOpenAIModel(messagesForSummary);
  if (typeof responseContent != "string") {
    return {};
  }

  const messagesToKeep = await trimMessages(state.messages, {
    maxTokens: MAX_TOKEN_THRESHOLD,
    tokenCounter: countTokensExact,
    strategy: "last",
    includeSystem: true,
    allowPartial: false,
    startOn: "human",
  });

  const keepIds = new Set(messagesToKeep.map((m) => m.id));
  const deleteInstructions = state.messages
    .filter((msg) => msg.id && !keepIds.has(msg.id))
    .map((msg) => new RemoveMessage({ id: msg.id as string }));

  return {
    summary: responseContent,
    messages: deleteInstructions,
  };
};

const memoryRememberNode: GraphNode<typeof MessagesState.State> = async (
  state,
  runtime,
) => {
  const userId = runtime.context?.user_id;
  if (!userId) {
    console.error("userid required");
    return {};
  }

  const namespace = [userId, "memories"];
  if (!runtime.store) {
    return {};
  }

  const existingItems = await store.search(namespace);
  const existingTexts = existingItems
    .map((it) => it.value.data)
    .filter(Boolean);

  const userDetailsContent =
    existingTexts.length > 0
      ? existingTexts.map((t) => `- ${t}`).join("\n")
      : "(empty)";

  const lastMessage = state.messages.at(-1)!;

  const sysMsg = await REMEMBER_MEMORY_PROMPT.format({
    user_details_content: userDetailsContent,
  });

  const sysmsg = new SystemMessage({ content: sysMsg });
  const usermsgs = [new HumanMessage(`USER MESSAGE:\n${lastMessage.content}`)];

  // this creating issue by also steaming this structured output in final output
  // const decision = await memoryExtractor.invoke(
  //   [
  //    sysmsg,
  //    usermsgs[0]
  //   ],
  //   {
  //     tags: ["langsmith:hidden", "nostream"],
  //   },
  // );

  const memoryDecisionOutput = await callOpenAIModel(usermsgs, sysmsg, true);
  if (!memoryDecisionOutput) {
    return {};
  }

  if (typeof memoryDecisionOutput == "string") {
    return {};
  }

  if (memoryDecisionOutput.should_write && memoryDecisionOutput.memories) {
    for (const mem of memoryDecisionOutput.memories) {
      if (mem.is_new) {
        await store.put(namespace, uuidv4(), { data: mem.text });
      }
    }
  }

  console.log(
    `memory updated for user ${userId} : ${JSON.stringify(memoryDecisionOutput)}`,
  );

  return {};
};

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

  console.log("response ", response.usage_metadata);

  return {
    messages: [response],
  };
};

const postLlmCallNode: GraphNode<typeof MessagesState.State> = async (
  state,
  runtime,
) => {
  const lastMessage = state.messages.at(-1);
  const userId = runtime.context?.user_id;
  const selectedModel = runtime.context?.selectedModel;

  if (!userId || !lastMessage || !AIMessage.isInstance(lastMessage)) {
    return {};
  }

  const usage = lastMessage.usage_metadata;

  if (usage) {
    // Non-blocking execution for serverless
    waitUntil(
      (async () => {
        try {
          console.log(
            `[Telemetry] User: ${userId} | In: ${usage.input_tokens} | Out: ${usage.output_tokens}`,
          );

          await ingestEventToPolar(
            userId,
            selectedModel,
            usage.input_tokens,
            usage.output_tokens,
            usage.total_tokens,
          );
          
        } catch (error) {
          console.error("[Telemetry Error] Failed to record usage:", error);
        }
      })(),
    );
  }

  return {}; // Does not alter state
};

const routeAfterTool = (state: typeof MessagesState.State) => {
  const lastMessage = state.messages.at(-1);
  if (lastMessage instanceof ToolMessage) {
    if (UI_TOOL_NAMES.includes(lastMessage.name!)) {
      return END;
    }
  }
  return "llmCall";
};

const routeAfterGuardNode = (state: typeof MessagesState.State) => {
  const lastMessage = state.messages.at(-1);
  if (lastMessage && lastMessage.type === "ai") return END;
  const currentTokenCount = countTokensExact(state.messages);
  // console.log("currentTokenCount", currentTokenCount);
  if (currentTokenCount > MAX_TOKEN_THRESHOLD) {
    // Run summarization AND memory extraction in parallel
    return ["summarizeConversation", "memoryRememberNode"];
  } else {
    // Run the main LLM call AND the memory extraction in parallel
    return ["llmCall", "memoryRememberNode"];
  }
};

const shouldContinue = (state: typeof MessagesState.State) => {
  const lastMessage = state.messages.at(-1);
  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return ["postLlmCallNode"];
  }
  if (lastMessage.tool_calls?.length) {
    return ["toolNode", "postLlmCallNode"];
  }

  return ["postLlmCallNode"];
};

const toolNode = new ToolNode(tools);

export const graph = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)
  .addNode("guardrailNode", guardrailNode)
  .addNode("memoryRememberNode", memoryRememberNode)
  .addNode("summarizeConversation", summarizeConversation)
  .addNode("postLlmCallNode", postLlmCallNode)

  .addEdge(START, "guardrailNode")

  .addConditionalEdges("guardrailNode", routeAfterGuardNode, {
    summarizeConversation: "summarizeConversation",
    llmCall: "llmCall",
    memoryRememberNode: "memoryRememberNode",
    [END]: END,
  })
  .addEdge("memoryRememberNode", END)
  .addEdge("summarizeConversation", "llmCall")

  // .addConditionalEdges("llmCall", shouldContinue, {
  //   toolNode: "toolNode",
  //   [END]: END,
  // })
  .addConditionalEdges("llmCall", shouldContinue, {
    toolNode: "toolNode",
    postLlmCallNode: "postLlmCallNode",
  })
  .addEdge("postLlmCallNode", END)
  .addConditionalEdges("toolNode", routeAfterTool, ["llmCall", END])
  .compile({ checkpointer: checkpointer, store: store });
