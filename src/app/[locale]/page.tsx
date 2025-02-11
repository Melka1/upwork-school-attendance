/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { UserType } from "@prisma/client";
import Loading from "../components/Loading";
import {
  fetchAttendances,
  resetAttendanceState,
} from "../lib/feature/attendanceSlice";
import { useTranslations } from "next-intl";
import { getDate } from "../lib/utils";
import ParentCallInSickCard from "../components/ParentCallInSickCard";
import StudentCallInSickCard from "../components/StudentCallInSickCard";
import Error from "../components/Error";

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

  if (queryStatus == "error") {
    return <Error errorText={t("dashboard.somethingWentWrong")} />;
  }

  if (
    queryStatus == "loading" ||
    queryStatus == "initial" ||
    user?.userType == UserType.TEACHER
  ) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 p-4 flex-1">
      {user.userType == "PARENT" ? (
        <ParentCallInSickCard
          attendances={attendances}
          status={mutationStatus}
          parent={user?.parent}
        />
      ) : (
        <StudentCallInSickCard
          attendances={attendances}
          status={mutationStatus}
          student={user?.student}
        />
      )}
    </div>
  );
}

export default StudentPage;
