import ChatViewArea from "@/components/chatscreen/chatviewarea";
import MessageInputCard from "@/components/chatscreen/messageinputcard";
import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

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
    return <div>Chat Unavailable , you cant message yourself</div>;
  }
  let room;
  let userdata;
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
        messages: true,
        id: true,
      },
    });
    if (!room) {
      room = await prisma.room.create({
        data: {
          type: "private",
          participants: { create: [{ userId: myId }, { userId: userid }] },
        },
        select: {
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
          messages: true,
          id: true,
        },
      });
    }
  } catch (error) {
    return <div>{`Unexpected Error occured: ${error}`}</div>;
  }

  return (
    <div className="flex-col   flex h-screen w-full relative">
      <div className=" h-14 text-white backdrop-blur-md  items-center bg-black/80 z-10 w-full absolute flex gap-9">
        <div className="border-2">
          {room?.participants
            .filter((user) => user.user.id !== User.id)
            .map((userinfo) => (
              <div key={userinfo.user.id}>{userinfo.user.name}</div>
            ))}
        </div>
      </div>
      <div className="h-full   w-full overflow-auto">
        <ChatViewArea Messages={room?.messages} RoomData={room} />
      </div>

      <div className="w-full h-14  z-10 absolute backdrop-blur-md bg-black/80  bottom-0 ">
        <MessageInputCard RoomData={room} />
      </div>
    </div>
  );
}
