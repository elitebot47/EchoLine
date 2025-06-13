"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useShowChatStore } from "@/stores/showChatStore";
import type { MinimalUser } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
export default function ChatScreenHeader({ users }: { users: MinimalUser[] }) {
  const { data: session } = useSession();
  const Chat = useShowChatStore((state) => state.showChat);
  const setChat = useShowChatStore((state) => state.setShowChat);
  console.log(users);

  return (
    <div className="text-2xl px-4 h-full bg-black/20  items-center flex w-full ">
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
              <div key={userinfo.id} className="items-center flex gap-3.5">
                <div>
                  {userinfo.image && (
                    <Avatar className="border-2 border-white/25 size-11">
                      <AvatarImage loading="lazy" src={`${userinfo?.image}`} />
                    </Avatar>
                  )}
                </div>
                <div>{userinfo.name}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
