import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma";
import { logger } from "@/app/lib/logger";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const attendanceId = (await params).id;
  const { status } = await request.json();
  try {
    const response = await prisma.attendance.update({
      where: {
        id: attendanceId,
      },
      data: {
        status,
      },
    });
    logger.info("updated attendance: ", response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log("the error");
    logger.error("Error editing attendance:", error);
    return NextResponse.json(
      { error: "Failed to edit attendance" },
      { status: 500 }
    );
  }
}
