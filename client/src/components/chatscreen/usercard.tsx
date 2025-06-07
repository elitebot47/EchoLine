"use client";
import { UserType } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function UserCard({ user }: { user: UserType }) {
  const { data: session } = useSession();
  const url = usePathname();
  console.log(url);

  return (
    <Link className="w-full" href={`/c/${user.id}`}>
      <div
        className={` ${
          url == `/c/${user.id}` && "text-white bg-black/80"
        } w-full gap-3 h-16 border-2 flex`}
      >
        <div>
          {user.name}
          {session?.user?.id === user.id && "(you)"}
        </div>
      </div>
    </Link>
  );
}
