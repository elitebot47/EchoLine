import type { MinimalMessage, MessageType, RoomType } from "@/types";

export function minimalToMessageType(
  msg: MinimalMessage,
  room?: RoomType
): MessageType {
  return {
    ...msg,
    from: msg.fromId,
    to: msg.toId,
    room: room || ({} as RoomType),
    status: "SENT",
    contentType: msg.contentType as MessageType["contentType"],
    createdAt: new Date(msg.createdAt),
    updatedAt: new Date(msg.updatedAt),
  };
} 