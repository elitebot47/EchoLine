import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (!roomId) {
    return NextResponse.json({ message: "Missing roomId" }, { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` }, { status: 500 });
  }
}
