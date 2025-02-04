import { UserType } from "@prisma/client";
import { prisma } from "../../../../prisma";
import { NextResponse } from "next/server";
import User from "@/app/assets/svg/User";

export async function GET() {
  try {
    const response = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        classroom: true,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch students", error: error?.message || error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const {
    name,
    email,
    imageUrl,
    phoneNumber,
    classroomId,
    location,
    parent,
    medicalInfo,
    emergencyContact,
  } = await request.json();
  const data = {
    name,
    email,
    imageUrl,
    phoneNumber,
    classroomId,
    location,
    medicalInfo,
    emergencyContact,
    parent,
  };

  try {
    const user = await prisma.user.upsert({
      where: { email, userType: UserType.STUDENT },
      update: {},
      create: {
        email,
        userType: UserType.STUDENT,
      },
    });

    const response = await prisma.student.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create student", error: error?.message || error },
      { status: 500 }
    );
  }
}
