import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const User = await getUser();

    if (!User?.id) {
      return NextResponse.json(
        { message: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const participants = await prisma.roomParticipant.findMany({
      where: {
        room: {
          participants: {
            some: {
              userId: User.id,
            },
          },
        },
        NOT: {
          userId: User.id,
        },
      },
      select: {
        roomId: true,
        user: {
          select: {
            image: true,
            id: true,
            name: true,
            notificationsSent: {
              where: { seen: false, recipientId: User.id },
            },
          },
        },
      },
    });
    console.log(
      "notifications data is know users route-",
      participants.map((p) => ({
        notifications: p.user.notificationsSent,
      }))
    );

    const users = participants.map((p) => ({
      id: p.user.id,
      name: p.user.name,
      roomId: p.roomId,
      image: p.user.image,
      notificationsSent: p.user.notificationsSent,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
