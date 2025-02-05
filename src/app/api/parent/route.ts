import { UserType } from "@prisma/client";
import { prisma } from "../../../../prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, phoneNumber } = await request.json();
  const data = {
    name,
    email,
    phoneNumber,
  };

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        userType: UserType.PARENT,
      },
      create: {
        email,
        userType: UserType.PARENT,
      },
    });

    const response = await prisma.parent.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create parent", error: error?.message || error },
      { status: 500 }
    );
  }
}
