import ChatScreenHeader from "@/components/chatscreen/ChatScreenHeader";
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
  console.log("c/page.tsx");

  console.log("userid", userid);

  const myId = User.id;
  console.log("myid", myId);
  if (userid === myId) {
    return <div>Chat Unavailable, you can&apos;t message yourself</div>;
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
        participants: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
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

          participants: {
            select: {
              id: true,
              userId: true,
              roomId: true,
              room: { select: { id: true } },
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
      });
    }
  } catch (error) {
    return <div>{`Unexpected Error occurred: ${error}`.replace("'", "&apos;")}</div>;
  }

  if (!room) {
    return <div>{"Room not found or could not be created.".replace("'", "&apos;")}</div>;
  }
  const thisUser = room.participants.find(
    (user) => user.user.id !== User.id
  )?.user;
  if (!thisUser) {
    return <div>Error while fecthing user&apos;s Profile</div>;
  }
  return (
    <div className="flex flex-col h-screen relative  w-full">
      <div className="h-16 text-white backdrop-blur-lg bg-black/30 z-10 w-full flex gap-9 absolute top-0">
        <ChatScreenHeader roomId={room.id} user={thisUser} />
      </div>
      <div className="flex-1 absolute   w-full   z-0 h-screen  overflow-auto">
        <ChatViewArea roomId={room.id} />
      </div>
      <div className="w-full lg:h-14 h-16 z-20   absolute bottom-0">
        <MessageInputCard id={room.id} participants={room.participants} />
      </div>
    </div>
  );
}
