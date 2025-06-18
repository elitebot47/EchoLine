import type { Filetype } from "@/types";
import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const uploadPreset = formData.get("upload_preset");
    const cloudinaryFormdata = new FormData();
    if (!file || typeof uploadPreset !== "string") {
      return NextResponse.json(
        { error: "Missing file or upload preset" },
        { status: 400 }
      );
    }
    if (file.size > 1024 * 1024 * 5) {
      return NextResponse.json(
        { error: "File bigger than 5mb is not allowed" },
        { status: 400 }
      );
    }
    let filetype: Filetype;

    if (file.type.startsWith("image/")) {
      filetype = "image";
    } else if (
      file.type.startsWith("application/") ||
      file.type.startsWith("text/")
    ) {
      filetype = "document";
    } else {
      filetype = "image";
    }
    const cloudinaryUploadType = { image: "image", document: "auto" };
    cloudinaryFormdata.append("file", file, file.name);
    cloudinaryFormdata.append("upload_preset", uploadPreset);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${cloudinaryUploadType[filetype]}/upload`,
      cloudinaryFormdata
    );
    console.log("res.data from document route: ", res.data);

    const cloudinaryResponse = await res.data;
    return NextResponse.json(cloudinaryResponse, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({
      message: "error:" + error.message,
    });
  }
}
