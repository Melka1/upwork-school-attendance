// app/api/initialize-attendance/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma";
import { AttendanceStatus } from "@prisma/client";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    const alreadyRecordedAttendance = await prisma.attendance.findMany({
      where: {
        date,
        month,
        year,
        OR: students.map((s) => ({ studentId: s.id })),
      },
    });

    const recordedStudentIds = alreadyRecordedAttendance.map(
      (a) => a.studentId
    );

    const studentNotRecorded = students.filter(
      (s) => !recordedStudentIds.includes(s.id)
    );

    const newAttendanceRecords = await prisma.attendance.createMany({
      data: studentNotRecorded.map((s) => ({
        studentId: s.id,
        status: AttendanceStatus.PRESENT,
        date,
        month,
        year,
      })),
    });
    console.log("Daily attendance initialized: ", newAttendanceRecords);

    return NextResponse.json(
      { message: "Daily attendance initialized successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to initialize daily attendance:", error);
    return NextResponse.json(
      { message: "Failed to initialize daily attendance." },
      { status: 500 }
    );
  }
}
