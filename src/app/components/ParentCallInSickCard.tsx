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
import { Attendance, AttendanceStatus, NotificationType } from "@prisma/client";
import { EMutationStatus } from "../lib/enums";
import { createAttendance } from "../lib/feature/attendanceSlice";
import { createNotifications } from "../lib/feature/notificationSlice";
import { CheckCircle } from "@mui/icons-material";

interface ParentCardProps {
  parent: TUser["parent"];
  attendances: Attendance[];
  status: EMutationStatus;
}

const ParentCallInSickCard = ({
  parent,
  attendances,
  status,
}: ParentCardProps) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [chosenStudent, setChosenStudent] = useState(parent?.students[0]);

  const chosenStudentAttendance = attendances.find(
    (a) => a.studentId == chosenStudent?.id
  );

  const handleCallSick = ({ id }: { id: string }) => {
    dispatch(
      createAttendance({
        studentId: id,
        status: AttendanceStatus.ABSENT,
        attendanceId: chosenStudentAttendance?.id || id,
      })
    ).then(() => {
      dispatch(
        createNotifications({
          title: "absentAlert",
          content: "hasCalledSick",
          fromId: id,
          type: NotificationType.INFO,
        })
      );
    });
  };

  const [selectedTab, setSelectedTab] = useState(0);
  const isDisabled = chosenStudentAttendance?.status == "ABSENT";
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
        {t("student.hey")} {parent?.name.split(" ")[0]}
      </Typography>

      {/* Tabs for Student Selection */}
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        variant="fullWidth"
        sx={{
          bgcolor: "#2d2d2d",
          "& .MuiTab-root": { color: "gray", transition: "0.3s" },
          "& .Mui-selected": { color: "white", fontWeight: "bold" },
          "& .Mui-disabled": {
            color: "#757575",
            opacity: 0.5,
          },
        }}
      >
        {parent?.students.map((student, index) => (
          <Tab
            onClick={() => setChosenStudent(student)}
            key={index}
            label={student.name.split(" ")[0]}
            disabled={status == "saving"}
            sx={{ fontSize: { xs: "0.8rem", sm: "unset" } }}
          />
        ))}
      </Tabs>

      <CardContent className="flex flex-col items-center justify-center mt-4 min-h-[100px]">
        {status == "success" ? (
          <div className="text-green-600 flex flex-col items-center">
            <CheckCircle fontSize={"large"} />
            <p className="mt-2">{t("student.callSickSubmitted")}</p>
          </div>
        ) : (
          <Button
            variant="contained"
            onClick={() => handleCallSick(chosenStudent)}
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

export default ParentCallInSickCard;
