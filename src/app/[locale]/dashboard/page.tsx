/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import TodaysStudentStatusTable from "./TodaysStudentStatusTable";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { fetchAttendances } from "../../lib/feature/attendanceSlice";
import { fetchStudents } from "../../lib/feature/studentsSlice";
import { getDate } from "@/app/lib/utils";

export default function Home() {
  const dispatch = useAppDispatch();
  const { mutationStatus, chosenDate, status } = useAppSelector(
    (state) => state.attendanceSlice
  );
  const startDate = useAppSelector(
    (state) => state.schoolSlice.semesterStartDate
  );

  useEffect(() => {
    const { date, month, year } = getDate();
    dispatch(fetchStudents({}));
    dispatch(fetchAttendances({ date, month, year, startDate }));
  }, []);

  useEffect(() => {
    const { date, month, year } = getDate(chosenDate);
    if (mutationStatus !== "success") return;
    dispatch(fetchAttendances({ date, month, year }));
  }, [mutationStatus]);

  useEffect(() => {
    console.log(chosenDate);
    const { date, month, year } = getDate(chosenDate);
    if (status == "initial") return;
    dispatch(fetchAttendances({ date, month, year }));
  }, [chosenDate]);

  return <TodaysStudentStatusTable />;
}
