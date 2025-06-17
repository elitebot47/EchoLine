"use client";
import { useMessagesStore } from "@/stores/MessagesStore";
import { useSocketStore } from "@/stores/SocketStore";
import type { MinimalMessage } from "@/types";
import { AnimatePresence, motion } from "motion/react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { animateScroll as scroll } from "react-scroll";
import Message from "./message";

export default function ChatViewArea({
  Messages,
  roomId,
}: {
  Messages: MinimalMessage[];
  roomId: string;
}) {
  const { data: session } = useSession();
  const socket = useSocketStore((state) => state.socket);
  const messages = useMessagesStore((state) => state.messages);
  const addMessage = useMessagesStore((state) => state.addMessage);
  const setMessages = useMessagesStore((state) => state.setMessages);
  const deleteMessage = useMessagesStore((state) => state.deleteMessage);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMessages(Messages?.filter(Boolean) ?? []);
  }, [Messages, setMessages]);

  useEffect(() => {
    if (!socket || !roomId) return;
    socket?.emit("joinRoom", `${roomId}`);
    return () => {
      socket.emit("leaveRoom", `${roomId}`);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;
    const handler = (data: any) => {
      if (data) {
        addMessage(data);
      }
    };
    socket.on("BroadToMembers", handler);
    return () => {
      socket.off("BroadToMembers", handler);
    };
  }, [socket, addMessage]);
  useEffect(() => {
    if (!socket) return;
    const handler = (data: { id: string; roomId: string }) => {
      if (data.id) {
        deleteMessage(data.id);
      }
    };
    socket.on("delete-message-action", handler);
    return () => {
      socket.off("delete-message-action", handler);
    };
  }, [socket, deleteMessage]);
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
        className="origin-left h-full w-full"
      >
        <div
          id="chat-container"
          ref={chatContainerRef}
          className="flex flex-col  lg:px-16 px-3 pb-16 pt-18  overflow-y-auto w-full scroll-smooth gap-1.5 h-full"
        >
          {messages?.length === 0 && (
            <div className="text-5xl flex justify-center items-center">
              say hi, this will be your first message to this person lets go😎
            </div>
          )}
          <AnimatePresence>
            {messages
              ?.filter((message) => message?.content?.trim())
              .map((message) => {
                return (
                  <motion.div key={message.id}>
                    <Message
                      MessageData={message}
                      MyId={session?.user?.id || ""}
                    />
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
