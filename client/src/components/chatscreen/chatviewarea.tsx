"use client";

import { MessageType, RoomType } from "@/types";
import { Session } from "next-auth";

export default function ChatViewArea({
  Session,
  Messages,
  RoomData,
}: {
  Session: Session | null;
  Messages: MessageType[] | null;
  RoomData: RoomType | null;
}) {
  return <div className="border-2 h-full w-full">
    
  </div>;
}
