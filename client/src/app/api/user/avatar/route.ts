import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const uploadPreset = formData.get("upload_preset");
    const cloudinaryFormdata = new FormData();
    if (!file || typeof uploadPreset !== "string") {
      return NextResponse.json(
        { error: "Missing file or upload preset" },
        { status: 400 },
      );
    }
    if (file.size > 1024 * 1024 * 4) {
      return NextResponse.json(
        { error: "File bigger than 4mb is not allowed" },
        { status: 400 },
      );
    }
    cloudinaryFormdata.append("file", file, file.name);
    cloudinaryFormdata.append("upload_preset", uploadPreset);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      cloudinaryFormdata,
    );

    const cloudinaryResponse = await res.data;

    await prisma.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        image: cloudinaryResponse.secure_url,
      },
    });
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (typeof error === "object" && error && "message" in error) {
      message = String((error as { message?: string }).message);
    }
    return NextResponse.json({
      message: "error:" + message,
    });
  }
}
export async function DELETE(req: NextRequest) {
  const { Id } = await req.json();
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  try {
    await prisma.user.update({
      where: {
        id: Id,
      },
      data: {
        image:
          "https://i.pinimg.com/236x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg",
      },
    });
    return NextResponse.json(
      { message: "successfully removed profile picture" },
      { status: 200 },
    );
  } catch (error: unknown) {
    let message = "Unknown error";
    if (typeof error === "object" && error && "message" in error) {
      message = String((error as { message?: string }).message);
    }
    return NextResponse.json({
      message: "error:" + message,
    });
  }
}
