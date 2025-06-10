"use client";

import AccessibilityCard from "@/components/chatscreen/accessibilitycard";
import UserList from "@/components/chatscreen/userlist";
import { useShowChatStore } from "@/stores/showChatStore";
import type { MinimalUser } from "@/types";

export default function ResponsiveChatLayout({
  users,
  children,
}: {
  users: MinimalUser[];
  children: React.ReactNode;
}) {
  const showChat = useShowChatStore((state) => state.showChat);

  return (
    <main className="flex flex-col lg:flex-row h-screen">
      <section
        className={` border-r-2
          ${showChat ? "hidden" : "block"} 
          lg:block w-full lg:w-1/3 h-full  
        `}
      >
        <AccessibilityCard users={users} />
        <UserList />
      </section>
      <section
        className={`
          ${showChat ? "block" : "hidden"} 
          lg:block w-full lg:w-2/3 h-full
        `}
      >
        {children}
      </section>
    </main>
  );
}
