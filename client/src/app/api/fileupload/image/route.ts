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
    cloudinaryFormdata.append("file", file, file.name);
    cloudinaryFormdata.append("upload_preset", uploadPreset);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      cloudinaryFormdata
    );

    const cloudinaryResponse = await res.data;
    return NextResponse.json(cloudinaryResponse, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({
      message: "error:" + error.message,
    });
  }
}
