import { useEffect, useState } from "react";
import UserCard from "./usercard";
import { useSession } from "next-auth/react";
import axios from "axios";
import { RoomParticipantType } from "@/types";

export default function UserList() {
  const [users, setUsers] = useState<RoomParticipantType[]>([]);
  const { data: session } = useSession();
  if (!session) {
    return <div>Not authenticated</div>;
  }

  useEffect(() => {
    async function Getusers() {
      const res = await axios.get(`/api/knownusers`);
      setUsers(res.data.users);
    }
    Getusers();
  }, []);

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} currentUserId={session?.user?.id} />
      ))}
    </div>
  );
}
