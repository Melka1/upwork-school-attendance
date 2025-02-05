import { logger } from "@/app/lib/logger";
import { prisma } from "../../../../../prisma";
import { NextResponse } from "next/server";

export async function GET(_, { params }: { params: Promise<{ id: string }> }) {
  const parentId = (await params).id;

  try {
    const response = await prisma.parent.findUnique({
      where: {
        id: parentId,
      },
    });

    logger.info("response: ", response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger.error("Error fetching parents:", error);
    return NextResponse.json(
      { error: "Failed to fetch parent" },
      { status: 500 }
    );
  }
}
