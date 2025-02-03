/* eslint-disable prefer-const */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma";
import { AttendanceStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const studentId = searchParams.get("studentId");
  const status = searchParams.get("status") as AttendanceStatus;
  const date = searchParams.get("date");
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const startDate = searchParams.get("startDate");

  let filter = {};
  if (studentId) filter["studentId"] = studentId;
  if (status) filter["status"] = status;
  if (date) filter["date"] = Number(date);
  if (month) filter["month"] = Number(month);
  if (year) filter["year"] = Number(year);
  if (startDate)
    filter["createdAt"] = {
      gte: new Date(startDate).toISOString(),
    };

  try {
    const response = await prisma.attendance.findMany({
      where: filter,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch attendances",
        error: error?.message || error,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { studentId, status, dateTime } = await request.json();

  if (!studentId || !status) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const today = dateTime ? new Date(dateTime) : new Date();
  const date = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  try {
    const response = await prisma.attendance.create({
      data: {
        studentId,
        status: status as AttendanceStatus,
        date,
        month,
        year,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch attendances",
        error: error?.message || error,
      },
      { status: 500 }
    );
  }
}
