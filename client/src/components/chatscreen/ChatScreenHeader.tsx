"use client";

import { useShowChatStore } from "@/stores/showChatStore";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { MinimalUser } from "@/types";

export default function ChatScreenHeader({ users }: { users: MinimalUser[] }) {
  const { data: session } = useSession();
  const Chat = useShowChatStore((state) => state.showChat);
  const setChat = useShowChatStore((state) => state.setShowChat);

  return (
    <div className="text-2xl px-2 h-full  items-center flex w-full ">
      <div className="flex-1 block lg:hidden ">
        {Chat && (
          <Button onClick={() => setChat(false)}>
            <ArrowLeft />
          </Button>
        )}
      </div>
      <div className="flex-6 w-full ">
        <div className="m-auto">
          {users
            .filter((user) => user.id !== session?.user?.id)
            .map((userinfo) => (
              <div key={userinfo.id}>{userinfo.name}</div>
            ))}
        </div>
      </div>
    </div>
  );
}
