"use client";
import { useShowChatStore } from "@/stores/showChatStore";
import type { MinimalUser } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarImage } from "../ui/avatar";
export default function UserCard({ user }: { user: MinimalUser }) {
  const pathname = usePathname();
  const setShowChat = useShowChatStore((state) => state.setShowChat);

  return (
    <motion.div
      className={`w-full  ${
        pathname === `/c/${user.id}` ? "!bg-black text-white" : "bg-gray-500"
      }`}
    >
      <Link
        className={`block`}
        onClick={() => setShowChat(true)}
        href={`/c/${user.id}`}
      >
        <div className="w-full items-center   h-20  flex px-4">
          {user.image && (
            <Avatar className=" size-13">
              <AvatarImage loading="lazy" src={`${user?.image}`} />
            </Avatar>
          )}
          <div>{user.name}</div>
        </div>
      </Link>
    </motion.div>
  );
}
