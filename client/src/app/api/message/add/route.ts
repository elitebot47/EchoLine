import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MessageCreateSchema } from "@/lib/schemas/message";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  const result = MessageCreateSchema.safeParse(await req.json());
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  try {
    const existingMesages = await prisma.message.count({
      where: {
        roomId: result.data.roomId,
      },
    });
    const isFirstMessage = existingMesages === 0;

    const message = await prisma.message.create({
      data: {
        ...result.data,
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
        fileName: true,
        fileSize: true,
        fileType: true,
      },
    });
    await prisma.notification.create({
      data: {
        senderId: session.user.id,
        recipientId: message.toId,
        type: "NEW_MESSAGE",
        roomId: message.roomId,
      },
    });

    return NextResponse.json({
      message,
      isFirstMessage,
      user: {
        id: session.user.id,
        roomId: result.data.roomId,
        name: session.user.name,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: `error:${error}` }, { status: 501 });
  }
}
