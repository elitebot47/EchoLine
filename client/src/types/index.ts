export type RoomType = {
  id: string;
  participants: string[];
  createdAt: Date;
  type: "private" | "group";
  updatedAt: Date;
};

export type MessageType = {
  id: string;
  from: string;
  to: string;
  createdAt: Date;
  content: string;
  contentType: "text" | "image" | "video" | "link";
  updatedAt: Date;
  roomId: string;
};
