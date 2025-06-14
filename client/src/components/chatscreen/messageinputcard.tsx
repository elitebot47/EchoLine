"use client";

import type { MessageCreateInput } from "@/lib/schemas/message";
import { useMessagesStore } from "@/stores/MessagesStore";
import { useSocketStore } from "@/stores/SocketStore";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { find } from "linkifyjs";
import { LucidePaperclip, Plus, SendHorizontalIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import MyDropzone from "../MyDropzone";
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
  const [uploading, setUploading] = useState<boolean>(false);

  const addMessage = useMessagesStore((state) => state.addMessage);
  const [chattext, setchattext] = useState("");

  const [uploadbox, setUploadbox] = useState(false);

  const recipient = participants.find(
    (user) => user.user.id !== session?.user?.id
  );
  async function HandleSend() {
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
    <div className="flex w-full bg-gray-400  gap-2 justify-center items-center relative p-2 h-full">
      <Input
        disabled={uploadbox}
        className=" rounded-full lg:rounded-none  h-full w-full lg:!text-xl !text-2xl
         focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 focus:outline-none hover:ring-0 ring-0 border-0  text-black"
        value={chattext}
        onChange={(e) => {
          setchattext(e.target.value);
          if (e.target.value) {
            socket?.emit("UserTyping", { roomId: id });
          }
        }}
        onKeyDown={(e) => e.key === "Enter" && HandleSend()}
      />
      <AnimatePresence>
        <motion.div key={"attach-button"}>
          <Button
            key={"attach-button"}
            disabled={uploading}
            onClick={() => setUploadbox(true)}
            size={"icon"}
            title="Attach"
            className="hover:scale-105 lg:w-16 lg:h-10 w-14 h-12  cursor-pointer"
          >
            <LucidePaperclip />
          </Button>
        </motion.div>
        {uploadbox ||
          (chattext.length !== 0 && (
            <motion.div
              className=" origin-right"
              key="send-button-container"
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{
                opacity: 1,
                scaleX: 1,
                transition: {},
              }}
              transition={{ duration: 0.2 }}
            >
              <Button
                className="w-14 hover:scale-105 lg:w-16 lg:h-10 h-12 cursor-pointer"
                onClick={HandleSend}
                title="send"
              >
                <SendHorizontalIcon />
              </Button>
            </motion.div>
          ))}
        {uploadbox && (
          <motion.div
            key="upload-box"
            layout
            initial={{ y: 50, x: 80, opacity: 0, height: 0 }}
            animate={{ y: 0, x: 0, opacity: 1, height: "auto" }}
            exit={{ y: 50, x: 80, opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`isolate origin-bottom-right overflow-hidden  absolute  flex flex-col  gap-2 bottom-full shadow-2xl z-50 shadow-black/50 bg-black/50 backdrop-blur-xl  p-2 rounded-2xl`}
          >
            <div className="flex justify-end ">
              <Button
                onClick={() => {
                  setUploadbox(false);
                }}
                className="rounded-2xl hover:scale-105 bg-black/50 backdrop-blur-lg cursor-pointer w-12 h-9"
              >
                <Plus className="rotate-45 size-6" />
              </Button>
            </div>
            <div>
              <MyDropzone
                uploading={uploading}
                setUploading={setUploading}
                roomId={String(id)}
                toId={String(recipient?.user.id)}
                setUploadbox={setUploadbox}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
