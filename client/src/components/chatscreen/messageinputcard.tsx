"use client";

import { SendHorizontalIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSocketStore } from "@/stores/SocketStore";
import { useState } from "react";
import { Session } from "next-auth";
import { MessageType, RoomType } from "@/types";
import { useMessagesStore } from "@/stores/MessagesStore";
import axios from "axios";
import { toast } from "sonner";

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
  const addMessage = useMessagesStore((state) => state.addMessage);
  const [chattext, setchattext] = useState("");
  async function HandleSend() {
    if (!chattext) {
      return;
    }
    try {
      const res = await axios.post("/api/message/add", {
        content: chattext,
        contentType: "text",
        roomId: RoomData?.id,
        to: RoomData?.participants.filter(
          (user) => user !== Session?.user?.id
        )[0],
      });
      if (res.data.message) {
        addMessage(res.data);
      }

      socket?.emit("Chat_client", res.data);
      setchattext("");
    } catch (error) {
      toast.error(`error:${error}`);
    }
  }
  return (
    <div className="flex w-full justify-center items-center border-2 h-full">
      <div className="flex-9 ">
        <Input
          value={chattext}
          onChange={(e) => setchattext(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && HandleSend()}
        />
      </div>

      <div className="flex-1  ">
        <Button disabled={chattext.length === 0} onClick={HandleSend}>
          <SendHorizontalIcon />
        </Button>
      </div>
    </div>
  );
}
