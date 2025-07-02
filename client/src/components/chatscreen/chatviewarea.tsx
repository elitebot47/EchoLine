"use client";
import { useSocketStore } from "@/stores/SocketStore";
import type { MinimalMessage } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { animateScroll as scroll } from "react-scroll";
import { useMessages, useMessageMutations } from "@/lib/hooks/useMessages";
import { dedupeMessages } from "@/lib/utils/messageUtils";
import { minimalToMessageType } from "@/lib/utils/messageAdapter";
import Message from "./message";

export default function ChatViewArea({ roomId }: { roomId: string }) {
  const { data: session } = useSession();
  const socket = useSocketStore((state) => state.socket);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { removeMessage } = useMessageMutations();

  const {
    data: messages = [],
    isLoading,
    error,
    isFetching,
  } = useMessages(roomId);

  useEffect(() => {
    const markNotificationSeen = async () => {
      try {
        await axios.put("/api/notification/newmessages-seen", {
          roomId,
          recipientId: session?.user.id,
        });
        socket?.emit(`noti_seen_recipient`);
      } catch (error) {
        console.error("Failed to mark notifications as seen:", error);
      }
    };

    if (roomId && session?.user?.id) {
      markNotificationSeen();
    }
  }, [roomId, session?.user?.id, socket]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("joinRoom", `${roomId}`);
    return () => {
      socket.emit("leaveRoom", `${roomId}`);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    const handler = (data: MinimalMessage) => {
      try {
        queryClient.setQueryData(["messages", roomId], (old = []) => {
          const oldMessages = old as MinimalMessage[];

          const optimisticIndex = oldMessages.findIndex(
            (msg) =>
              msg.optimistic &&
              msg.content === data.content &&
              msg.fromId === data.fromId &&
              Math.abs(
                new Date(msg.createdAt).getTime() -
                  new Date(data.createdAt).getTime(),
              ) < 2000,
          );

          if (optimisticIndex !== -1) {
            const clientId = oldMessages[optimisticIndex].clientId;
            const newMessages = [...oldMessages];
            newMessages[optimisticIndex] = {
              ...data,
              clientId,
              optimistic: false,
            };
            return newMessages;
          } else {
            return [
              ...oldMessages,
              { ...data, clientId: data.clientId || data.id },
            ];
          }
        });
      } catch (error) {
        console.error("Error updating messages from socket:", error);
      }
    };

    socket.on("BroadToMembers", handler);
    return () => {
      socket.off("BroadToMembers", handler);
    };
  }, [socket, roomId, queryClient]);

  useEffect(() => {
    if (!socket) return;

    const handler = (data: { id: string; roomId: string }) => {
      try {
        if (data.id) {
          removeMessage(roomId, data.id);
        }
      } catch (error) {
        console.error("Error handling message deletion:", error);
      }
    };

    socket.on("delete-message-action", handler);
    return () => {
      socket.off("delete-message-action", handler);
    };
  }, [socket, roomId, removeMessage]);

  useEffect(() => {
    if (messages?.length > 0) {
      scroll.scrollToBottom({
        containerId: "chat-container",
        duration: 200,
        smooth: true,
      });
    }
  }, [messages]);

  if (!roomId) return null;

  const uniqueMessages = dedupeMessages(messages);

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500 text-center">
          <p>Failed to load messages</p>
          <button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["messages", roomId] })
            }
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          className="flex flex-col lg:px-16 px-3 lg:pb-16 pb-19 pt-18 overflow-y-auto w-full scroll-smooth gap-1.5 h-full"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-gray-500">Loading messages...</div>
            </div>
          ) : uniqueMessages.length === 0 ? (
            <div className="text-5xl flex justify-center items-center">
              say hi, this will be your first message to this person lets go😎
            </div>
          ) : (
            <AnimatePresence>
              {uniqueMessages
                .filter((message) => message?.content?.trim())
                .map((message) => (
                  <motion.div key={message.clientId || message.id}>
                    <Message
                      MessageData={minimalToMessageType(message)}
                      MyId={session?.user?.id || ""}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          )}
          {isFetching && !isLoading && (
            <div className="text-center text-gray-500 text-sm py-2">
              Updating...
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
