"use client";
import { useShowChatStore } from "@/stores/showChatStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserCard({ user }: any) {
  const pathname = usePathname();
  const setShowChat = useShowChatStore((state) => state.setShowChat);

  return (
    <Link
      onClick={() => setShowChat(true)}
      className="w-full  "
      href={`/c/${user.id}`}
    >
      <div
        className={` ${
          pathname == `/c/${user.id}` && "text-white bg-black/80"
        } w-full  items-center h-16  flex`}
      >
        <div>{user.name}</div>
      </div>
    </Link>
  );
}
