/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { logOut } from "@/firebase/auth";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { AttendanceStatus, UserType } from "@prisma/client";
import Loading from "../components/Loading";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import {
  createAttendance,
  fetchAttendances,
  resetAttendanceState,
} from "../lib/feature/attendanceSlice";
import { useTranslations } from "next-intl";
import { createNotifications } from "../lib/feature/notificationSlice";
import { getDate } from "../lib/utils";

function StudentPage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { user, queryStatus } = useAppSelector((state) => state.userSlice);
  const { attendances, mutationStatus } = useAppSelector(
    (state) => state.attendanceSlice
  );

  useEffect(() => {
    if (mutationStatus == "success") {
      dispatch(resetAttendanceState());
    }
    if (!user?.student?.id || user.userType != UserType.STUDENT) return;

    const { date, month, year } = getDate();

    dispatch(
      fetchAttendances({
        studentId: user.student.id,
        date,
        month,
        year,
      })
    );
  }, [user]);

  const handleSickCall = () => {
    dispatch(
      createAttendance({
        studentId: user.student?.id,
        status: AttendanceStatus.ABSENT,
      })
    ).then(() => {
      dispatch(
        createNotifications({
          title: "Absent alert!",
          name: user?.student?.name,
        })
      );
    });
  };

  if (
    queryStatus == "loading" ||
    queryStatus == "initial" ||
    user?.userType != UserType.STUDENT
  ) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-500 p-4">
        <h1 className="text-2xl font-bold mb-4">
          {t("student.hey")} {user?.student?.name.split(" ")[0]}
        </h1>
        <Card className="w-full max-w-sm p-6 bg-white shadow-xl rounded-2xl">
          {user?.student?.id ? (
            <CardContent className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                {t("student.callInSick")}
              </h2>
              {mutationStatus == "success" ? (
                <div className="text-green-600 flex flex-col items-center">
                  <CheckCircle fontSize={"large"} />
                  <p className="mt-2">{t("student.callSickSubmitted")}</p>
                </div>
              ) : (
                <Button
                  fullWidth
                  size="small"
                  onClick={handleSickCall}
                  loading={mutationStatus == "saving"}
                  variant="contained"
                  disabled={attendances.length > 0}
                  color="error"
                >
                  {t("student.callInSick")}
                </Button>
              )}
            </CardContent>
          ) : (
            <Typography textAlign={"center"}>
              {t("student.contactYourTeacher")}
            </Typography>
          )}
        </Card>
        <button
          onClick={() => logOut()}
          className="mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
        >
          {t("auth.logOut")}
        </button>
      </div>
    </div>
  );
}

export default StudentPage;
