import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { graph } from "@/app/api/chat/graph";
import { getMessagesHistory } from "@/http/threads";
import { ChatInterfaceNew } from "@/components/chat-interface";

export default async function Page({
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const { thread_id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }
  const formattedMessages = await getMessagesHistory(
    graph,
    thread_id as string,
    session.user.id,
  );
  return (
    <main className="bg-white min-h-screen text-gray-900">

      <ChatInterfaceNew old_messages={formattedMessages} />

    </main>

  );
}
