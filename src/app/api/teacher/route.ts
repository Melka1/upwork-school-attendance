import { UserType } from "@prisma/client";
import { prisma } from "../../../../prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, phoneNumber, imageUrl } = await request.json();
  const data = {
    name,
    email,
    phoneNumber,
    imageUrl,
  };

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        userType: UserType.TEACHER,
      },
      create: {
        email,
        userType: UserType.TEACHER,
      },
    });

    const response = await prisma.teacher.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create teacher", error: error?.message || error },
      { status: 500 }
    );
  }
}
