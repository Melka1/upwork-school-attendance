import { Box, Button, Typography } from "@mui/material";
import { Attendance, AttendanceStatus } from "@prisma/client";
import React, { useState } from "react";
import { TUser } from "../lib/feature/userSlice";
import { useTranslations } from "next-intl";
import { EMutationStatus } from "../lib/enums";
import { CheckCircle } from "@mui/icons-material";
import { useAppDispatch } from "../lib/hooks";
import { createAttendance } from "../lib/feature/attendanceSlice";
import { createNotifications } from "../lib/feature/notificationSlice";

interface ParentCardProps {
  user: TUser;
  attendances: Attendance[];
  status: EMutationStatus;
}

function CallInSickCard({ user, attendances, status }: ParentCardProps) {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [chosenStudent, setChosenStudent] = useState(user?.parent?.students[0]);

  const chosenStudentAttendance = attendances.find(
    (a) => a.studentId == chosenStudent?.id
  );

  const studentAttendance = attendances.find(
    (a) => a.studentId == user?.student?.id
  );

  const handleCallSick = ({ id, name }: { id: string; name: string }) => {
    dispatch(
      createAttendance({
        studentId: id,
        status: AttendanceStatus.ABSENT,
        attendanceId:
          chosenStudentAttendance?.id || studentAttendance?.id || id,
      })
    ).then(() => {
      dispatch(
        createNotifications({
          title: "Absent alert!",
          content: name + " has called sick!",
        })
      );
    });
  };

  return (
    <>
      {user.userType == "PARENT" && (
        <Box className="border rounded-md rounded-b-none">
          <Box className="flex w-full border-b">
            {user?.parent?.students.map((student) => (
              <button
                key={student.id}
                className={`rounded-md rounded-b-none px-3 py-1 ${
                  student.id == chosenStudent?.id
                    ? "bg-gray-500 text-white"
                    : "bg-transparent"
                } `}
                disabled={status == "saving"}
                onClick={() => setChosenStudent(student)}
              >
                <Typography sx={{ textAlign: "center" }}>
                  {student.name}
                </Typography>
              </button>
            ))}
          </Box>
          <Box className="min-h-[150px] md:min-h-[100px] flex items-center justify-center">
            {status == "success" ? (
              <div className="text-green-600 flex flex-col items-center">
                <CheckCircle fontSize={"large"} />
                <p className="mt-2">{t("student.callSickSubmitted")}</p>
              </div>
            ) : (
              <Button
                size="small"
                onClick={() => handleCallSick(chosenStudent)}
                loading={status == "saving"}
                variant="contained"
                disabled={chosenStudentAttendance?.status == "ABSENT"}
                color="error"
              >
                {t("student.callInSick")}
              </Button>
            )}
          </Box>
        </Box>
      )}
      {user.userType == "STUDENT" && (
        <Box className="border rounded-md">
          <Box className="flex flex-col min-h-[150px] w-full items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">
              {t("student.callInSick")}
            </h2>
            {status == "success" ? (
              <div className="text-green-600 flex flex-col items-center">
                <CheckCircle fontSize={"large"} />
                <p className="mt-2">{t("student.callSickSubmitted")}</p>
              </div>
            ) : (
              <Button
                size="small"
                onClick={() => handleCallSick(user?.student)}
                loading={status == "saving"}
                variant="contained"
                disabled={
                  attendances.find((a) => a.studentId == user?.student?.id)
                    ?.status == "ABSENT"
                }
                color="error"
              >
                {t("student.callInSick")}
              </Button>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}

export default CallInSickCard;
