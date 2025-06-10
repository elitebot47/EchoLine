"use client";
import { useShowChatStore } from "@/stores/showChatStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function UserCard({ user }: any) {
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
        <div className="w-full items-center h-16 flex px-4">
          <div>{user.name}</div>
        </div>
      </Link>
    </motion.div>
  );
}
