import { auth } from "@/auth";
import AccessibilityCard from "@/components/chatscreen/accessibilitycard";
import UserList from "@/components/chatscreen/userlist";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      rooms: true,
    },
  });
  return (
    <main className="flex h-screen">
      <section className="flex-1 h-full  ">
        <AccessibilityCard Session={session} />
        <UserList users={users} />
      </section>
      <section className="flex-3 h-full ">{children}</section>
    </main>
  );
}
