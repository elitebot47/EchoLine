import { HashPassword } from "@/lib/hash";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password || !name) {
    return NextResponse.json(
      {
        message: "All 3 fields are required!",
      },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser)
      return NextResponse.json(
        { message: "User already exists!,try logging in." },
        { status: 409 }
      );
    const hashedPassword = await HashPassword(password);
    await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name,
        image:
          "https://i.pinimg.com/236x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg",
      },
    });

    return NextResponse.json({ message: "Registration successfull✅" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log(error.code);

        return NextResponse.json(
          {
            error: "AccountConflict",
            message: "User already exists!,try logging in.",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Registration failed. Please try again later.",
        error: "InternalError",
      },
      { status: 500 }
    );
  }
}
