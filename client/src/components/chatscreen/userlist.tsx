import { useSocketStore } from "@/stores/SocketStore";
import type { MinimalUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Spinner from "../ui/spinner";
import UserCard from "./usercard";

export default function UserList() {
  const { data: session } = useSession();
  const socket = useSocketStore((state) => state.socket);

  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery<MinimalUser[]>({
    queryKey: ["known-users"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/knownusers");
        return res.data.users || [];
      } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
      }
    },
    enabled: !!session,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  useEffect(() => {
    if (socket && session?.user?.id) {
      socket.emit("join_personal_room", session.user.id);
    }
  }, [socket, session?.user?.id]);

  if (!session) {
    return <div>Not authenticated</div>;
  }

  if (isLoading) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Spinner size="lg" className="text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full p-4">
        <div className="text-red-500 text-center mb-4">
          Unexpected error occurred!
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full ">
      {users?.map((user) => (
        <UserCard
          key={user.id}
          user={{
            id: user.id,
            name: user.name,
            image: user.image,
          }}
          notifications={user.notificationsSent}
        />
      ))}
    </div>
  );
}
