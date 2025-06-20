import { logger } from "@/app/lib/logger";
import { prisma } from "../../../../../prisma";
import { NextResponse } from "next/server";

export async function GET(_, { params }: { params: Promise<{ id: string }> }) {
  const studentId = (await params).id;
  logger.info("Student id: ", studentId);
  try {
    const response = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        classroom: true,
        attendance: true,
        parent: {
          select: {
            name: true,
            phoneNumber: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (response == null) {
      return NextResponse.json(
        { message: `Student with ${studentId} is not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const studentId = (await params).id;
  const {
    name,
    imageUrl,
    email,
    phoneNumber,
    classroomId,
    location,
    medicalInfo,
    emergencyContact,
  } = await request.json();

  if (
    !name &&
    !imageUrl &&
    !classroomId &&
    !email &&
    !phoneNumber &&
    !location &&
    !medicalInfo &&
    !emergencyContact
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // eslint-disable-next-line prefer-const
  let data = {};
  if (name) data["name"] = name;
  if (imageUrl) data["imageUrl"] = imageUrl;
  if (classroomId) data["classroomId"] = classroomId;
  if (email) data["email"] = email;
  if (phoneNumber) data["phoneNumber"] = phoneNumber;
  if (location) data["location"] = location;
  if (medicalInfo) data["medicalInfo"] = medicalInfo;
  if (emergencyContact) data["emergencyContact"] = emergencyContact;

  console.log(data);

  try {
    const response = await prisma.student.update({
      where: {
        id: studentId,
      },
      data,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to edit student", error: error?.message || error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _,
  { params }: { params: Promise<{ id: string }> }
) {
  const studentId = (await params).id;

  try {
    const response = await prisma.student.delete({
      where: {
        id: studentId,
      },
    });

    return NextResponse.json(
      { id: response.id, name: response.name },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete student", error: error?.message || error },
      { status: 500 }
    );
  }
}
