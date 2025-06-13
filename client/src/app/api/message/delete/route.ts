import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import type { ContentType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { id, type }: { id: string; type: ContentType } = await req.json();
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const deletedMessage = await prisma.message.delete({ where: { id } });

    const response = NextResponse.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );

    if (type === "image") {
      cloudinary.uploader
        .destroy(deletedMessage.content, { invalidate: true })
        .catch((error) => console.error("Cloudinary cleanup failed:", error));
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete message",
      },
      { status: 500 }
    );
  }
}
