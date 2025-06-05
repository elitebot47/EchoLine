"use client";

import { SendHorizontalIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSocketStore } from "@/stores/SocketStore";
import { useState } from "react";
import { Session } from "next-auth";
import { MessageType, RoomType } from "@/types";

export default function MessageInputCard({
  Session,
  Messages,
  RoomData,
}: {
  Session: Session | null;
  Messages: MessageType[] | null;
  RoomData: RoomType | null;
}) {
  const socket = useSocketStore((state) => state.socket);
  const [chattext, setchattext] = useState("");
  function HandleSend() {
    const msg = {
      message: chattext,
      type: "text",
      user: Session?.user?.id,
    };
    socket?.emit("message_client", msg);
  }

  return (
    <div className="flex w-full justify-center items-center border-2 h-full">
      <div className="flex-9 ">
        <Input value={chattext} onChange={(e) => setchattext(e.target.value)} />
      </div>

      <div className="flex-1  ">
        <Button onClick={HandleSend}>
          <SendHorizontalIcon />
        </Button>
      </div>
    </div>
  );
}
