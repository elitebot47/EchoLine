import { UserType } from "@/types";
import UserCard from "./usercard";

export default function UserList({ users }: { users: UserType[] }) {
  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
