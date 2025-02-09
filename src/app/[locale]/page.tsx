/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { UserType } from "@prisma/client";
import Loading from "../components/Loading";
import { Card, Stack } from "@mui/material";
import {
  fetchAttendances,
  resetAttendanceState,
} from "../lib/feature/attendanceSlice";
import { useTranslations } from "next-intl";
import { getDate } from "../lib/utils";
import CallInSickCard from "../components/CallAndSickCard";

function StudentPage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { user, queryStatus } = useAppSelector((state) => state.userSlice);
  const { attendances, mutationStatus } = useAppSelector(
    (state) => state.attendanceSlice
  );

  useEffect(() => {
    if (mutationStatus == "success") {
      setTimeout(() => {
        dispatch(resetAttendanceState());
      }, 1000);
    }
    if (user?.userType == UserType.TEACHER) return;

    const { date, month, year } = getDate();

    dispatch(
      fetchAttendances({
        studentId: user?.student?.id,
        studentIds: user?.parent?.students.map((s) => s.id),
        date,
        month,
        year,
      })
    );
  }, [user, mutationStatus]);

  if (
    queryStatus == "loading" ||
    queryStatus == "initial" ||
    user?.userType == UserType.TEACHER
  ) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-400 p-4 flex-1">
      <Card className="w-full max-w-sm p-6 bg-white shadow-xl rounded-2xl">
        <Stack
          direction={"row"}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: "1rem",
          }}
        >
          <h1 className="text-2xl font-bold">
            {t("student.hey")}{" "}
            {user?.student?.name.split(" ")[0] || user?.parent?.name}
          </h1>
        </Stack>
        <CallInSickCard
          user={user}
          attendances={attendances}
          status={mutationStatus}
        />
      </Card>
    </div>
  );
}

export default StudentPage;
