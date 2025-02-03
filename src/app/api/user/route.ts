import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma";

export async function POST(request: Request) {
  const { email, userType } = await request.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return NextResponse.json(
        { message: "User by this email already exists!" },
        { status: 400 }
      );
    }

    const response = await prisma.user.create({
      data: {
        email,
        userType,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to crete user", message: error?.message || error },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { id, userType } = await request.json();

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    const response = await prisma.user.update({
      where: {
        id,
      },
      data: {
        userType,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user", message: error?.message || error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user", message: error?.message || error },
      { status: 500 }
    );
  }
}
