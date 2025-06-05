import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MessageType } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { content, contentType, roomId, to }: MessageType = await req.json();

  console.log(content, contentType, roomId, to);

  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: `Not authenticated` }, { status: 401 });
  }
  let message;
  try {
    message = await prisma.message.create({
      data: {
        content,
        contentType,
        roomId,
        to,
        from: String(   session?.user?.id ?? ""),
      },
    });
    console.log(message);
  } catch (error) {
    return NextResponse.json({ message: `error:${error}` }, { status: 501 });
  }
  return NextResponse.json({ message });
}
