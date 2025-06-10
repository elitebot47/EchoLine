import type { RoomParticipantType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Spinner from "../ui/spinner";
import UserCard from "./usercard";

export default function UserList() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Not authenticated</div>;
  }
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<RoomParticipantType[]>({
    queryKey: ["known-users"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/knownusers");
        return res.data.users || [];
      } catch (error) {
        toast.error("Error occured:unable to retreive users!");
        return [];
      }
    },
    enabled: !!session,
    staleTime: 5 * 60 * 1000,
  });
  if (isLoading) {
    <div className="flex w-full h-screen justify-center items-center">
      <Spinner size="lg" className="text-red-600" />
    </div>;
  }
  if (error) {
    return <div>"Unexpected error occured !"</div>;
  }
  return (
    <div className="w-full ">
      {users?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
