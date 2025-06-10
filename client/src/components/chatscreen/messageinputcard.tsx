"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MessageCreateInput } from "@/lib/schemas/message";
import { useMessagesStore } from "@/stores/MessagesStore";
import { useSocketStore } from "@/stores/SocketStore";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { find } from "linkifyjs";
import { LucidePaperclip, SendHorizontalIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
type MinimalParticipant = { user: { id: string; name: string } };

type MessageInputCardProps = {
  id: string;
  participants: MinimalParticipant[];
};
export default function MessageInputCard({
  id,
  participants,
}: MessageInputCardProps) {
  const { data: session } = useSession();

  const socket = useSocketStore((state) => state.socket);
  const queryClient = useQueryClient();

  const addMessage = useMessagesStore((state) => state.addMessage);
  const [chattext, setchattext] = useState("");
  const [Typingstatus, setTypingstatus] = useState(false);
  // const [contentType, setContentType] = useState("");
  useEffect(() => {
    if (!socket || !id) return;

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
  }, [socket, id]);

  async function HandleSend() {
    setTypingstatus(false);
    if (!chattext) {
      return;
    }

    const links = find(chattext.trim());

    const detectedContentType =
      links.length > 0 &&
      links[0].type === "url" &&
      links[0].value == chattext.trim()
        ? "link"
        : "text";

    try {
      const recipient = participants.find(
        (user) => user.user.id !== session?.user?.id
      );
      if (!recipient) {
        toast.error("Error:Connection error ,please try again later");
        return;
      }
      const res = await axios.post("/api/message/add", {
        content: String(chattext),
        contentType: String(detectedContentType),
        roomId: String(id),
        toId: String(recipient.user.id),
      } as MessageCreateInput);

      if (res.data.message) {
        addMessage(res.data);
      }
      if (res.data.isFirstMessage) {
        queryClient.invalidateQueries({
          queryKey: ["known-users"],

          refetchType: "active",
        });
      }

      socket?.emit("Chat_client", res.data);
      setchattext("");
    } catch (error) {
      toast.error(`error:Failed to send message`);
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
        className=" rounded-full lg:rounded-lg  h-full w-full lg:!text-xl !text-2xl
         focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 focus:outline-none hover:ring-0 ring-0 border-0  text-white"
        value={chattext}
        onChange={(e) => {
          setchattext(e.target.value);
          if (e.target.value) {
            socket?.emit("UserTyping", { roomId: id });
          }
        }}
        onKeyDown={(e) => e.key === "Enter" && HandleSend()}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"icon"}
            className="lg:w-16 lg:h-10 w-14 h-12  cursor-pointer"
          >
            <LucidePaperclip />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mb-1">
          <DropdownMenuItem>Images</DropdownMenuItem>
          <DropdownMenuItem>Document</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        className={`w-14 lg:w-16 lg:h-10 h-12  cursor-pointer`}
        disabled={chattext.length === 0}
        onClick={HandleSend}
      >
        <SendHorizontalIcon />
      </Button>
    </div>
  );
}
