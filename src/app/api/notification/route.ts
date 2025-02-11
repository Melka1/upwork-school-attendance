import { logger } from "@/app/lib/logger";
import { prisma } from "../../../../prisma";
import { NextResponse } from "next/server";
import { UserType } from "@prisma/client";

export async function POST(request: Request) {
  const { title, content, fromId, type } = await request.json();

  try {
    const users = await prisma.user.findMany({
      where: { userType: UserType.TEACHER },
    });

    const response = await prisma.notification.create({
      data: {
        title,
        message: content,
        date: new Date(),
        fromId,
        type,
        users: {
          create: [
            ...users.map((u) => ({
              userId: u.id,
              email: u.email,
              userType: u.userType,
            })),
          ],
        },
      },
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger.error("Error creating notifications:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { recipientId, isRead } = await request.json();
  try {
    const response = await prisma.recipient.update({
      where: { id: recipientId },
      data: { isRead },
    });

    logger.info("updated notification: ", response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log("the error");
    logger.error("Error editing notification:", error);
    return NextResponse.json(
      { error: "Failed to edit notification" },
      { status: 500 }
    );
  }
}
