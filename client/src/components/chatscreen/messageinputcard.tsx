"use client";

import { SendHorizontalIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSocketStore } from "@/stores/SocketStore";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { MessageType, RoomType } from "@/types";
import { useMessagesStore } from "@/stores/MessagesStore";
import axios from "axios";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

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
  const [Typingstatus, setTypingstatus] = useState(false);

  useEffect(() => {
    if (!socket || !RoomData) return;

    let typingTimeout: NodeJS.Timeout | undefined;

    const handler = () => {
      setTypingstatus(true);
      if (typingTimeout) clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => setTypingstatus(false), 1000);
    };

    socket.on("UserTypingStatus", handler);

    return () => {
      socket.off("UserTypingStatus", handler);
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingstatus(false);
    };
  }, [socket, RoomData]);
  async function HandleSend() {
    setTypingstatus(false);
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
    <div className="flex w-full justify-center items-center relative  h-full">
      <AnimatePresence>
        {Typingstatus && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-full origin-bottom 
          
          w-full bg-gray-500/30    backdrop-blur-md px-5   mr-auto `}
          >
            <span className="animate-pulse text-black">typing</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-9 ">
        <Input
          value={chattext}
          onChange={(e) => {
            setchattext(e.target.value);
            if (e.target.value) {
              socket?.emit("UserTyping", { roomId: RoomData?.id });
            }
          }}
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
