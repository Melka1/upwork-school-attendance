/* eslint-disable prefer-const */
import { logger } from "@/app/lib/logger";
import { prisma } from "../../../../../prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = (await params).id;
  const searchParams = request.nextUrl.searchParams;
  const isRead = JSON.parse(searchParams.get("isRead")) as boolean;

  let filters = { userId };
  if (isRead) filters["isRead"] = false;

  try {
    const response = await prisma.recipient.findMany({
      where: {
        userId,
        isRead: false,
      },
      include: {
        notification: true,
      },
    });

    logger.info("response: ", response);

    let result = response.map((n) => ({
      recipientId: n.id,
      ...n.notification,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logger.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification" },
      { status: 500 }
    );
  }
}
