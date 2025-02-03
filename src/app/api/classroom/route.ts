import { prisma } from "../../../../prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name } = await request.json();

  try {
    const classroom = await prisma.classroom.findUnique({ where: { name } });
    if (classroom) {
      return NextResponse.json(
        { message: "Classroom by this name already exists!" },
        { status: 400 }
      );
    }

    const response = await prisma.classroom.create({
      data: {
        name,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to crete classroom", message: error?.message || error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await prisma.classroom.findMany({});

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch classrooms", error: error?.message || error },
      { status: 500 }
    );
  }
}
