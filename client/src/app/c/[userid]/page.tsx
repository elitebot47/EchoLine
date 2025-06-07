import { auth } from "@/auth";
import ChatViewArea from "@/components/chatscreen/chatviewarea";
import MessageInputCard from "@/components/chatscreen/messageinputcard";
import { prisma } from "@/lib/prisma";

export default async function ChatViewPage({
  params,
}: {
  params: Promise<{ userid: string }>;
}) {
  const session = await auth();
  const { userid } = await params;
  const myId = session?.user?.id;
  if (userid === myId) {
    return <div>Chat Unavailable , you cant message yourself</div>;
  }
  let room;
  let userdata;
  try {
    userdata = await prisma.user.findUnique({
      where: {
        id: userid,
      },
      select: {
        name: true,
      },
    });
    if (!userdata) {
      return <div>User doesnt exists!!</div>;
    }
    room = await prisma.room.findFirst({
      where: {
        participants: {
          hasEvery: [`${userid}`, `${myId}`],
        },
      },
    });
    if (!room) {
      room = await prisma.room.create({
        data: {
          type: "private",
          participants: [`${userid}`, `${myId}`],
        },
      });
    }
  } catch (error) {}
  const messages = room
    ? await prisma.message.findMany({
        where: { roomId: room.id },
      })
    : [];
  return (
    <div className="flex-col   flex h-screen w-full relative">
      <div className=" h-14 text-white backdrop-blur-md bg-black/80 z-10 w-full absolute flex gap-9">
        <div>{userid}</div>
        <div className="border-2">{userdata?.name}</div>
      </div>
      <div className="h-full   w-full overflow-auto">
        <ChatViewArea
          Session={session}
          Messages={messages}
          RoomData={room || null}
        />
      </div>

      <div className="w-full h-14  z-10 absolute backdrop-blur-md bg-black/80  bottom-0 ">
        <MessageInputCard
          Session={session}
          Messages={messages}
          RoomData={room || null}
        />
      </div>
    </div>
  );
}
