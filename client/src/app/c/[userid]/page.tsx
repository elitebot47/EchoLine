import ChatScreenHeader from "@/components/chatscreen/ChatScreenHeader";
import ChatViewArea from "@/components/chatscreen/chatviewarea";
import MessageInputCard from "@/components/chatscreen/messageinputcard";
import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { MinimalMessage } from "@/types";

export default async function ChatViewPage({
  params,
}: {
  params: Promise<{ userid: string }>;
}) {
  const { userid } = await params;
  const User = await getUser();
  if (!User?.id) {
    return <div>Not authorised, Login first</div>;
  }
  const myId = User.id;
  if (userid === myId) {
    return <div>Chat Unavailable, you can't message yourself</div>;
  }
  let room;
  try {
    room = await prisma.room.findFirst({
      where: {
        type: "private",
        participants: {
          every: {
            userId: { in: [myId, userid] },
          },
        },
      },
      select: {
        id: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        messages: {
          select: {
            id: true,
            roomId: true,
            fromId: true,
            toId: true,
            createdAt: true,
            content: true,
            contentType: true,
            updatedAt: true,
          },
        },
      },
    });
    if (!room) {
      room = await prisma.room.create({
        data: {
          type: "private",
          participants: { create: [{ userId: myId }, { userId: userid }] },
        },
        select: {
          id: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          participants: {
            select: {
              id: true,
              userId: true,
              roomId: true,
              room: { select: { id: true } },
              user: { select: { id: true, name: true } },
            },
          },
          messages: {
            select: {
              id: true,
              roomId: true,
              fromId: true,
              toId: true,
              createdAt: true,
              content: true,
              contentType: true,
              updatedAt: true,
            },
          },
        },
      });
    }
  } catch (error) {
    return <div>{`Unexpected Error occurred: ${error}`}</div>;
  }

  if (!room) {
    return <div>Room not found or could not be created.</div>;
  }

  return (
    <div className="flex flex-col h-screen  w-full">
      <div className="h-14 text-white backdrop-blur-md items-center bg-black/70 z-10 w-full flex gap-9">
        <ChatScreenHeader users={room.participants.map((p) => p.user)} />
      </div>
      <div className="flex-1 w-full overflow-auto">
        <ChatViewArea
          Messages={
            room?.messages.filter(
              (msg) => msg.toId !== null
            ) as MinimalMessage[]
          }
          roomId={room.id}
        />
      </div>
      <div className="w-full lg:h-14 h-16 z-10 backdrop-blur-md bg-black/70">
        <MessageInputCard id={room.id} participants={room.participants} />
      </div>
    </div>
  );
}
