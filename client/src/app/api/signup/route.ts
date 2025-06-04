import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  if (!email || !password || !name) {
    return NextResponse.json(
      {
        message: "All 3 fields are required!",
      },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: email });
    if (existingUser)
      return NextResponse.json(
        { message: "User already exists!" },
        { status: 409 }
      );

    await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
    return NextResponse.json({ message: "Registration successfull✅" });
  } catch (error) {
    console.log(`error:${error}`);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
