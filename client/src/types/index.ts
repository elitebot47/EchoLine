import type { Room, User } from "@prisma/client";

export type RoomType = {
  id: string;
  createdAt: Date;
  type: "private" | "group";
  updatedAt: Date;
  participants: RoomParticipantType[];
  messages: MessageType[];
};
export type MinimalUser = Pick<
  UserType,
  "id" | "name" | "image" | "notificationsSent"
>;
export type MinimalMessage = {
  id: string;
  roomId: string;
  fromId: string;
  toId: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  contentType: string;
  fileName?: string | null;
  fileSize?: number | null;
  fileType?: string | null;
  clientId: string;
  optimistic?: boolean;
};
export type StatusType = "SENDING" | "SENT" | "DELIVERED" | "READ";

export type MessageType = {
  id: string;
  from: string;
  to: string;
  toId: string;
  fileName?: string | null;
  fileSize?: number | null;
  fileType?: string | null;
  fromId: string;
  room: RoomType;
  createdAt: Date;
  content: string;
  contentType: "text" | "image" | "video" | "link" | "document";
  updatedAt: Date;
  roomId: string;
  status: StatusType;
};
export type NotificationType = {
  id: string;
  recipientId: string;
  recipient: UserType;
  senderId?: string;
  sender?: User;
  messageId?: string;
  message?: string;
  type: "NEW_MESSAGE" | "MENTION" | "ROOM_INVITE";
  seen: boolean;
  createdAt: Date;
  roomId: string;
  room: Room;
};
export type Filetype = "image" | "document";
export type RoomParticipantType = {
  id: string;
  userId: string;
  roomId: string;
  room: RoomType;
  user: UserType;
};
export type UserType = {
  image?: string | null;
  id: string;
  name: string;
  rooms: RoomParticipantType[];
  email: string;
  messageFrom: MessageType[];
  messagesTo: MessageType[];
  notificationsSent: NotificationType[];
};
