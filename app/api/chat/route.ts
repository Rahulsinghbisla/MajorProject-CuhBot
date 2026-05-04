import { createUIMessageStreamResponse, UIMessage } from "ai";
import { toUIMessageStream } from "@ai-sdk/langchain";

import { graph } from "./graph";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { threads } from "@/db/schema/chatbot-schema";
import { HumanMessage } from "@langchain/core/messages";

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const {
    messageId,
    messageContent,
    thread_id,
    selectedModel,
  }: {
    thread_id: string;
    selectedModel: string;
    messageContent: string;
    messageId: string;
  } = await req.json();

  const existingThreads = await db
    .select()
    .from(threads)
    .where(eq(threads.id, thread_id))
    .limit(1);

  const existingThread = existingThreads[0];
  if (existingThread && existingThread.userId !== session.user.id) {
    return new Response("Forbidden: You do not have access to this thread", {
      status: 403,
    });
  }

  if (!existingThread) {
    console.log("new thread");
    const truncatedTitle = messageContent.trim().slice(0, 60) || "New Chat";
    await db.insert(threads).values({
      id: thread_id,
      userId: session.user.id,
      title: truncatedTitle,
    });
  }

  const userInputMessage = new HumanMessage({
    content: messageContent,
    id: messageId,
  });

  const stream = await graph.streamEvents(
    { messages: [userInputMessage] },
    {
      configurable: {
        thread_id: thread_id,
        selectedModel: selectedModel,
        user_id: session.user.id,
      },
      context: {
        user_id: session.user.id,
        selectedModel: selectedModel,
      },
      //https://docs.langchain.com/oss/javascript/langgraph/add-memory#add-long-term-memory
      metadata: {
        user_id: session.user.id,
      },
      version: "v2",
    },
  );

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
