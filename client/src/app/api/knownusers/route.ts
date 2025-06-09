import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/dal";

export async function GET(req: NextRequest) {
  const User = await getUser();
  if (!User) return NextResponse.json({ users: [] });

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

  return NextResponse.json({ users });
}
