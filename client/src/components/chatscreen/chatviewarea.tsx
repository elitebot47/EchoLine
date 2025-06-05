"use client";
import { MessageType, RoomType } from "@/types";
import { Session } from "next-auth";
import Message from "./message";
import { AnimatePresence, motion } from "motion/react";
import { useSocketStore } from "@/stores/SocketStore";
import { useEffect, useRef, useState } from "react";
import { useMessagesStore } from "@/stores/MessagesStore";

export default function ChatViewArea({
  Session,
  Messages,
  RoomData,
}: {
  Session: Session | null;
  Messages: MessageType[] | null;
  RoomData: RoomType | null;
}) {
  const socket = useSocketStore((state) => state.socket);
  const messages = useMessagesStore((state) => state.messages);
  const addMessage = useMessagesStore((state) => state.addMessage);
  const setMessages = useMessagesStore((state) => state.setMessages);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [Typingstatus, setTypingstatus] = useState(false);

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

  useEffect(() => {
    if (!socket) return;
    const handler = (data: any) => {
      console.log("data", data.message);
      if (data.message) {
        addMessage(data.message);
      }
    };

    socket.on("BroadToMembers", handler);

    return () => {
      console.log("cleanup after adding message");

      socket.off("BroadToMembers", handler);
    };
  }, [socket, addMessage]);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={`${
        messages?.length === 0 ? "bg-green-500 text-black" : "bg-gray-200"
      } h-full w-full `}
    >
      <div
        className="flex flex-col lg:px-16 px-3 py-3
          overflow-y-auto w-full gap-1.5 h-full"
        ref={chatContainerRef}
      >
        {messages?.length === 0 && (
          <div className="text-5xl flex justify-center items-center">
            say hi , this will be your first message to this person lets go😎
          </div>
        )}
        <AnimatePresence>
          {messages?.map((message) => (
            <motion.div key={message.id}>
              <Message MessageData={message} Session={Session} />
            </motion.div>
          ))}

          {Typingstatus && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-24 bg-gray-500   border-2 backdrop-blur-2xl px-5 py-1 rounded-3xl mr-auto `}
            >
              <span className="dot-flashing">typing</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
