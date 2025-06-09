"use client";
import { animateScroll as scroll } from "react-scroll";
import Message from "./message";
import { AnimatePresence, easeOut, motion } from "motion/react";
import { useSocketStore } from "@/stores/SocketStore";
import { useEffect, useRef } from "react";
import { useMessagesStore } from "@/stores/MessagesStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function ChatViewArea({
  Messages,
  RoomData,
}: {
  Messages: any;
  RoomData: any;
}) {
  const { data: session } = useSession();

  const socket = useSocketStore((state) => state.socket);
  const messages = useMessagesStore((state) => state.messages);
  const addMessage = useMessagesStore((state) => state.addMessage);
  const setMessages = useMessagesStore((state) => state.setMessages);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(Messages?.filter(Boolean) ?? []);
  }, [Messages, setMessages]);

  useEffect(() => {
    if (!socket || !RoomData) return;
    socket?.emit("joinRoom", `${RoomData?.id}`);
    return () => {
      socket.emit("leaveRoom", `${RoomData?.id}`);
    };
  }, [socket, RoomData]);

  useEffect(() => {
    if (!socket) return;
    const handler = (data: any) => {
      if (data.message) {
        addMessage(data.message);
      }
    };
    socket.on("BroadToMembers", handler);
    return () => {
      socket.off("BroadToMembers", handler);
    };
  }, [socket, addMessage]);

  useEffect(() => {
    scroll.scrollToBottom({
      containerId: "chat-container",
      duration: 200,
      smooth: true,
    });
  }, [messages]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.7 }}
        className={`origin-left ${
          messages?.length === 0 ? "bg-green-500" : "bg-gray-200"
        } h-full w-full`}
      >
        <div
          id="chat-container"
          ref={chatContainerRef}
          className="flex flex-col py-20 lg:px-16 px-3  overflow-y-auto w-full gap-1.5 h-full"
        >
          {messages?.length === 0 && (
            <div className="text-5xl flex justify-center items-center">
              say hi, this will be your first message to this person lets go😎
            </div>
          )}
          <AnimatePresence>
            {messages?.map((message) => (
              <motion.div key={message.id}>
                <Message MessageData={message} MyId={session?.user?.id || ""} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
