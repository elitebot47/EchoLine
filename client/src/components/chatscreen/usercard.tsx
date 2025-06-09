"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserCard({ user, currentUserId }: any) {
  const pathname = usePathname();

  return (
    <Link className="w-full" href={`/c/${user.id}`}>
      <div
        className={` ${
          pathname == `/c/${user.id}` && "text-white bg-black/80"
        } w-full gap-3 h-16 border-2 flex`}
      >
        <div>
          {user.name}
          {currentUserId === user.id && "(you)"}
        </div>
      </div>
    </Link>
  );
}
