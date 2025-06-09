import { auth } from "@/auth";
import AccessibilityCard from "@/components/chatscreen/accessibilitycard";
import UserList from "@/components/chatscreen/userlist";
import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const User = await getUser();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const currentUser = {
    id: User?.id,
    name: User?.name,
  };
  return (
    <main className="flex h-screen">
      <section className="flex-1 h-full border-r-2  ">
        <AccessibilityCard users={users} user={currentUser} />
        <UserList />
      </section>
      <section
        className="flex-3 h-full 
       "
      >
        {children}
      </section>
    </main>
  );
}
