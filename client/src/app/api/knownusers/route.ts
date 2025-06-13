import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import type { MinimalUser } from "@/types";
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
          },
        },
      },
    });

    const users = participants.map((p) => ({
      id: p.user.id,
      name: p.user.name,
      roomId: p.roomId,
      image: p.user.image,
    })) as MinimalUser[];

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
