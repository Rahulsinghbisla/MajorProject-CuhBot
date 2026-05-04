import { ChatInterfaceNew } from "@/components/chat-interface";

export default function HomePage() {
  return (
      <main className="bg-white min-h-screen text-gray-900">
  <ChatInterfaceNew old_messages={[]} />
</main>
  );
}
