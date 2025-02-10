import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "../lib/hooks";
import { TUser } from "../lib/feature/userSlice";
import { Attendance, AttendanceStatus } from "@prisma/client";
import { EMutationStatus } from "../lib/enums";
import { createAttendance } from "../lib/feature/attendanceSlice";
import { createNotifications } from "../lib/feature/notificationSlice";
import { CheckCircle } from "@mui/icons-material";

interface ParentCardProps {
  student: TUser["student"];
  attendances: Attendance[];
  status: EMutationStatus;
}

const StudentCallInSickCard = ({
  student,
  attendances,
  status,
}: ParentCardProps) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const studentAttendance = attendances.find((a) => a.studentId == student?.id);

  const handleCallSick = ({ id, name }: { id: string; name: string }) => {
    dispatch(
      createAttendance({
        studentId: id,
        status: AttendanceStatus.ABSENT,
        attendanceId: studentAttendance?.id || id,
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

  const isDisabled = studentAttendance?.status == "ABSENT";
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Card
      sx={{
        width: 450,
        maxWidth: "90vw",
        bgcolor: "#1a1a1a",
        color: "white",
        p: 2,
        borderRadius: 3,
        boxShadow: 5,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        {t("student.hey")} {student?.name.split(" ")[0]}
      </Typography>

      {/* Tabs for Student Selection */}

      <CardContent className="flex flex-col items-center justify-center mt-4 min-h-[100px]">
        {status == "success" ? (
          <div className="text-green-600 flex flex-col items-center">
            <CheckCircle fontSize={"large"} />
            <p className="mt-2">{t("student.callSickSubmitted")}</p>
          </div>
        ) : (
          <Button
            variant="contained"
            onClick={() => handleCallSick(student)}
            loading={status == "saving"}
            disabled={isDisabled}
            sx={{
              bgcolor: isDisabled
                ? isDarkMode
                  ? theme.palette.grey[700]
                  : theme.palette.grey[300]
                : theme.palette.error.main,
              color: isDisabled
                ? isDarkMode
                  ? `${theme.palette.grey[300]} !important`
                  : `${theme.palette.grey[700]} !important`
                : "white",
              border: isDisabled
                ? `1px solid ${theme.palette.grey[500]}`
                : "none",
              "&:hover": {
                bgcolor: isDisabled ? undefined : theme.palette.error.dark,
              },
              fontWeight: "bold",
              borderRadius: 2,
              px: 4,
              py: 1,
              transition: "0.3s",
            }}
          >
            {t("student.callInSick")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentCallInSickCard;
