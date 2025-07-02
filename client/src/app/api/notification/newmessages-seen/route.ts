import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { roomId, recipientId } = await req.json();

  try {
    const User = await getUser();

    if (!User?.id) {
      return NextResponse.json(
        { message: "Unauthorized - Please login" },
        { status: 401 },
      );
    }
    const data = await prisma.notification.updateMany({
      where: { roomId, recipientId, seen: false },
      data: { seen: true },
    });
    console.log("notifications from newmessage route-", data);

    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
