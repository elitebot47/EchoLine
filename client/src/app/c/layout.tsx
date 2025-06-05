import { auth } from "@/auth";
import MyProfileCard from "@/components/chatscreen/myprofilecard";
import UserList from "@/components/chatscreen/userlist";
import React from "react";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen">
      <section className="flex-1 h-full  border-2">
        <MyProfileCard />
        <UserList />
      </section>
      <section className="flex-3 h-full border-2">{children}</section>
    </main>
  );
}
