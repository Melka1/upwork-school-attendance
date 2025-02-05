import { AttendanceStatus, Parent, UserType } from "@prisma/client";
import { prisma } from "../../../../prisma";
import { NextResponse } from "next/server";
import { getDate } from "@/app/lib/utils";

export async function GET() {
  try {
    const response = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
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
    parentName,
    parentEmail,
    parentPhoneNumber,
    medicalInfo,
    emergencyContact,
  } = await request.json();
  const data = {
    name,
    imageUrl,
    phoneNumber,
    classroomId,
    location,
    medicalInfo,
    emergencyContact,
  };

  console.log(data, parentName, parentEmail, parentPhoneNumber);

  try {
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
    });

    if (!classroom) {
      return NextResponse.json(
        { message: "Classroom not found" },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.upsert({
        where: {
          email: classroom.grade <= 4 || !email ? parentEmail : email,
          userType:
            classroom.grade <= 4 || !email ? UserType.PARENT : UserType.STUDENT,
        },
        update: {},
        create: {
          email: classroom.grade <= 4 || !email ? parentEmail : email,
          userType:
            classroom.grade <= 4 || !email ? UserType.PARENT : UserType.STUDENT,
        },
      });

      console.log("User created/updated:", user);

      let parent: Parent;
      if (classroom.grade <= 4 || !email) {
        parent = await prisma.parent.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            name: parentName,
            phoneNumber: parentPhoneNumber,
            userId: user.id,
          },
        });
      } else {
        const parentsUser = await prisma.user.upsert({
          where: { email: parentEmail },
          update: {},
          create: {
            email: parentEmail,
            userType: UserType.PARENT,
            parent: {
              create: {
                name: parentName,
                phoneNumber: parentPhoneNumber,
              },
            },
          },
        });

        parent = await prisma.parent.findUnique({
          where: { userId: parentsUser.id },
        });
      }

      console.log("Parent created/updated:", parent);

      const student = await prisma.student.create({
        data: {
          ...data,
          ...(user.userType == "STUDENT" && { userId: user.id }),
          parentId: parent.id,
          attendance: {
            create: {
              date: Number(getDate().date),
              month: Number(getDate().month),
              year: Number(getDate().year),
              status: AttendanceStatus.PRESENT,
            },
          },
        },
      });

      return student;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create student", error: error?.message || error },
      { status: 500 }
    );
  }
}
