import UserCard from "./usercard";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/dal";

export default async function UserList() {
  const User = await getUser();
  if (!User) {
    return;
  }
  const users = await prisma.roomParticipant.findMany({
    where: {
      room: {
        participants: {
          some: {
            userId: User.id,
          },
        },
      },
    },
    select: {
      roomId: true,
      user: {
        select: { id: true, name: true },
      },
    },
  });

  return (
    <div>
      {users
        .filter((user) => user.user.id !== User.id)
        .map((user) => (
          <UserCard
            key={user.user.id}
            user={user.user}
            currentUserId={User.id}
          />
        ))}
    </div>
  );
}
