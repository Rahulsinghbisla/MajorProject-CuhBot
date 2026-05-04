"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { getCheckpoint } from "@/lib/memory";
import { threads } from "@/db/schema/chatbot-schema";

import {
  BaseMessage,
  mapChatMessagesToStoredMessages,
} from "@langchain/core/messages";

export async function fetchThreads() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }
  const userThreads = await db
    .select({
      id: threads.id,
      title: threads.title,
      createdAt: threads.createdAt,
    })
    .from(threads)
    .where(eq(threads.userId, session.user.id))
    .orderBy(desc(threads.createdAt));

  return userThreads;
}

export async function deleteThread(threadId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  if (!threadId) {
    throw Error("no thread_Id passwed");
  }
  try {
    const checkpointerMemory = await getCheckpoint();
    const existingThreads = await db
      .select()
      .from(threads)
      .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)))
      .limit(1);

    const threadToDelete = existingThreads[0];

    if (!threadToDelete) {
      throw new Error("Unauthorized: Thread not found or ownership mismatch.");
    }

    await db.delete(threads).where(eq(threads.id, threadId));
    await checkpointerMemory.deleteThread(threadId);
    return {
      message: `Checkpoints for thread "${threadId}" deleted successfully.`,
    };

  } catch (error) {
    throw Error("Error deleting checkpoints");
  }
}

export async function getMessagesHistory(
  cgraph: any,
  thread_id: string,
  user_id: string,
) {
  const existingThreads = await db
    .select()
    .from(threads)
    .where(and(eq(threads.id, thread_id), eq(threads.userId, user_id)))
    .limit(1);

  const isOwner = existingThreads.length > 0;

  if (!isOwner) {
    return [];
  }

  const state = await cgraph.getState({ configurable: { thread_id } });
  const rawMessages = (state.values.messages as BaseMessage[]) ?? [];

  const serialized = mapChatMessagesToStoredMessages(rawMessages);
  return serialized;
}