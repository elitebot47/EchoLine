export type RoomType = {
  id: string;
  createdAt: Date;
  type: "private" | "group";
  updatedAt: Date;
  participants: RoomParticipantType[];
  messages: MessageType[];
};
export type MinimalUser = Pick<UserType, "id" | "name" | "image">;
export type MinimalMessage = Pick<
  MessageType,
  | "id"
  | "roomId"
  | "fromId"
  | "toId"
  | "createdAt"
  | "content"
  | "contentType"
  | "updatedAt"
>;
export type StatusType = "SENDING" | "SENT" | "DELIVERED" | "READ";

export type MessageType = {
  id: string;
  from: string;
  to: string;
  toId: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fromId: string;
  room: RoomType;
  createdAt: Date;
  content: string;
  contentType: "text" | "image" | "video" | "link" | "document";
  updatedAt: Date;
  roomId: string;
  status: StatusType;
};

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
};
