import { auth } from "@/auth";
import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { content, contentType, roomId, toId }: any = await req.json();

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  let message;
  try {
    message = await prisma.message.create({
      data: {
        content: String(content),
        contentType,
        roomId,
        toId,
        fromId: session.user.id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        fromId: true,
        toId: true,
        roomId: true,
        contentType: true,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: `error:${error}` }, { status: 501 });
  }
  return NextResponse.json({ message });
}
