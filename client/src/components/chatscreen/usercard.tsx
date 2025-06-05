import { auth } from "@/auth";
import { UserType } from "@/types";
import Link from "next/link";

export default async function UserCard({ user }: { user: UserType }) {
  const session = await auth();
  return (
    <Link className="w-full" href={`/c/${user.id}`}>
      <div className="w-full gap-3 h-16 border-2 flex">
        <div> 
          {user.name}
          {session?.user?.id === user.id && "(you)"}
        </div>
      </div>
    </Link>
  );
}
