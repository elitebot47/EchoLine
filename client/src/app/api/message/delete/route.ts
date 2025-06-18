import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import type { ContentType } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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
    const deletedMessage = await prisma.message.delete({
      where: { id: id, fromId: session.user.id },
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Message deleted successfully",
        messageId: deletedMessage.id,
      },
      { status: 200 }
    );
    console.log("dleted content:", deletedMessage.content);

    if (type === "document") {
      try {
        await cloudinary.uploader.destroy(deletedMessage.content, {
          invalidate: true,
          resource_type: "raw",
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary cleanup failed:", cloudinaryError);
      }
    }
    if (type === "image") {
      try {
        await cloudinary.uploader.destroy(deletedMessage.content, {
          invalidate: true,
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary cleanup failed:", cloudinaryError);
      }
    }

    return response;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        console.warn(
          `Attempted to delete message ID ${id} by user ${session.user.id}, but it was not found or not owned by user.`
        );
        return new Response(
          JSON.stringify({
            message:
              "Message not found or you don't have permission to delete it.",
            success: false,
          }),
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete message",
      },
      { status: 500 }
    );
  }
}
