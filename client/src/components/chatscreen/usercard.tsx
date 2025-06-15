"use client";
import { useShowChatStore } from "@/stores/showChatStore";
import type { MinimalUser } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
            <Image
              className={`rounded-full`}
              width={40}
              height={40}
              alt={user.image}
              loading="lazy"
              src={`${user?.image}`}
            />
          )}
          <div>{user.name}</div>
        </div>
      </Link>
    </motion.div>
  );
}
