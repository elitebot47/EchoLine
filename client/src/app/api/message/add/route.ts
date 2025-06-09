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
      },
    });
    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ message: `error:${error}` }, { status: 501 });
  }
}
