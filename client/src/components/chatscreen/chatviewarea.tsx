"use client";
import { MessageType, RoomType } from "@/types";
import { Session } from "next-auth";
import Message from "./message";
import { useSocketStore } from "@/stores/SocketStore";
import { useEffect, useRef } from "react";
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

  console.log(messages);

  console.log(messages?.map((m) => m.id));

  return (
    <div className="border-2 h-full w-full">
      <div
        className="flex flex-col overflow-y-auto w-full h-full" // Set a fixed height!
        ref={chatContainerRef}
      >
        {messages?.map((message) => (
          <div key={message.id}>
            <Message MessageData={message} Session={Session} />
          </div>
        ))}
      </div>
    </div>
  );
}
