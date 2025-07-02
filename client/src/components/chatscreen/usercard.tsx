"use client";

import { useShowChatStore } from "@/stores/showChatStore";
import { useSocketStore } from "@/stores/SocketStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import CustomAvatar from "../ui/customavatar";
export default function UserCard({
  user,
  notifications,
}: {
  user: { id: string; name: string; image?: string | null };
  notifications: object[];
}) {
  const path = usePathname();
  const setShowChat = useShowChatStore((state) => state.setShowChat);
  const socket = useSocketStore((state) => state.socket);
  console.log("notifications.length", notifications);

  const [newMessageCount, setNewMessageCount] = useState(notifications?.length);
  useEffect(() => {
    const handleNotification = (data: { fromUser: { id: string } }) => {
      if (data.fromUser.id !== user.id) return;

      if (data.fromUser.id === user.id && path !== `/c/${user.id}`) {
        setNewMessageCount((prev: number) => prev + 1);
      }
    };
    socket?.on("notification", handleNotification);
    return () => {
      socket?.off("notification", handleNotification);
    };
  }, [user.id, socket, path]);

  return (
    <motion.div
      className={`w-full hover:bg-black/30 duration-500 ${
        path === `/c/${user.id}` ? "!bg-black text-white " : ""
      }`}
    >
      <Link
        className={`block`}
        onClick={() => {
          setShowChat(true);
          setNewMessageCount(0);
        }}
        href={`/c/${user.id}`}
      >
        <div className="w-full items-center gap-5 pr-7  h-20  flex px-4">
          {user.image && (
            <CustomAvatar
              className={`rounded-full`}
              width={55}
              height={55}
              alt={user.image}
              src={`${user?.image}`}
            />
          )}
          <div className={`text-3xl     font-sans`}>{user.name}</div>
          {newMessageCount > 0 && (
            <div className="ml-auto">
              <Badge
                className={`rounded-full h-10 w-10 text-2xl text-center`}
                variant="default"
              >
                {newMessageCount}
              </Badge>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
