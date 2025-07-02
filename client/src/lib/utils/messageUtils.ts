import type { MinimalMessage } from "@/types";

export function dedupeMessages(messages: MinimalMessage[]): MinimalMessage[] {
  if (!messages?.length) return [];

  const seen = new Map<string, MinimalMessage>();

  for (const msg of messages) {
    const messageWithClientId = {
      ...msg,
      clientId: msg.clientId || msg.id,
    };

    const key = messageWithClientId.optimistic
      ? `${messageWithClientId.content}-${messageWithClientId.fromId}-${messageWithClientId.createdAt}`
      : messageWithClientId.id;

    if (seen.has(key)) {
      const existing = seen.get(key)!;
      if (existing.optimistic && !messageWithClientId.optimistic) {
        seen.set(key, messageWithClientId);
      }
    } else {
      seen.set(key, messageWithClientId);
    }
  }

  return Array.from(seen.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random()}`;
}

export function generateClientId(): string {
  return `client-${Date.now()}-${Math.random()}`;
}

export function createOptimisticMessage(
  messageData: Partial<MinimalMessage>,
  fromId: string,
): MinimalMessage {
  const now = new Date().toISOString();
  return {
    clientId: generateClientId(),
    id: generateTempId(),
    fromId,
    createdAt: messageData.createdAt || now,
    updatedAt: now,
    content: "",
    contentType: "text",
    roomId: "",
    toId: "",
    optimistic: true,
    ...messageData,
  } as MinimalMessage;
}

export function isOptimisticMessage(message: MinimalMessage): boolean {
  return message.optimistic === true && message.id.startsWith("temp-");
}

export function filterOptimisticMessages(
  messages: MinimalMessage[],
  realMessage: MinimalMessage,
): MinimalMessage[] {
  return messages.filter(
    (msg) =>
      !(
        msg.optimistic &&
        msg.content === realMessage.content &&
        Math.abs(
          new Date(msg.createdAt).getTime() -
            new Date(realMessage.createdAt).getTime(),
        ) < 2000
      ),
  );
}
