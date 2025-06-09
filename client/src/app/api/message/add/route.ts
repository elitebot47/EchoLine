import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { content, contentType, roomId, toId }: any = await req.json();

  console.log(content, contentType, roomId, toId);
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ message: `Not authenticated` }, { status: 401 });
  }
  let message;
  try {
    message = await prisma.message.create({
      data: {
        content,
        contentType,
        room: {
          connect: { id: roomId },
        },
        to: { connect: { id: toId } },
        from: { connect: { id: user.id } },
      },
    });
    console.log(message);
  } catch (error) {
    return NextResponse.json({ message: `error:${error}` }, { status: 501 });
  }
  return NextResponse.json({ message });
}
