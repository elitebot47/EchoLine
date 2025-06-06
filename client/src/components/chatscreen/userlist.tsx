import { UserType } from "@/types";
import UserCard from "./usercard";
import { auth } from "@/auth";

export default async function UserList({ users }: { users: UserType[] }) {
  const session = await auth();
  return (
    <div>
      {users
        .filter((user) => user.id !== session?.user?.id)
        .map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
    </div>
  );
}
