"use client";

import { SendHorizontalIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSocketStore } from "@/stores/SocketStore";
import { useEffect, useState } from "react";
import { useMessagesStore } from "@/stores/MessagesStore";
import axios from "axios";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function MessageInputCard({ RoomData }: { RoomData: any }) {
  const { data: session } = useSession();
  console.log("RoomData", RoomData);

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
        content: String(chattext),
        contentType: "text",
        roomId: String(RoomData?.id),
        toId: RoomData?.participants.filter(
          (user) => user.user.id !== session?.user?.id
        )[0].user.id,
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
    <div className="flex w-full gap-2 justify-center items-center relative p-2 h-full">
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
      <Input
        className=" w-full !text-xl
         focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 focus:outline-none hover:ring-0 ring-0 border-0  text-white"
        value={chattext}
        onChange={(e) => {
          setchattext(e.target.value);
          if (e.target.value) {
            socket?.emit("UserTyping", { roomId: RoomData?.id });
          }
        }}
        onKeyDown={(e) => e.key === "Enter" && HandleSend()}
      />

      <Button disabled={chattext.length === 0} onClick={HandleSend}>
        <SendHorizontalIcon />
      </Button>
    </div>
  );
}
