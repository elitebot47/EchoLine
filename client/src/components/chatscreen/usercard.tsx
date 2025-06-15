"use client";
import { useShowChatStore } from "@/stores/showChatStore";
import type { MinimalUser } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CustomAvatar from "../ui/customavatar";
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
        <div className="w-full items-center gap-2   h-20  flex px-4">
          {user.image && (
            <CustomAvatar
              className={`rounded-full`}
              width={55}
              height={55}
              alt={user.image}
              src={`${user?.image}`}
            />
          )}
          <div className={`text-2xl font-semibold`}>{user.name}</div>
        </div>
      </Link>
    </motion.div>
  );
}
