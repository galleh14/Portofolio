"use client";

import type { Message } from "@/lib/messages";
import { MessageItem } from "@/components/admin/message-item";

export function MessagesList({ messages }: { messages: Message[] }) {
  return <div className="space-y-5">{messages.map((message) => <MessageItem key={message.id} message={message} />)}</div>;
}
