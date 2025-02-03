/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import Stack from "@mui/material/Stack";
import Header from "../../components/Header";
import MainGrid from "../../components/MainGrid";

import { useAuth } from "../../provider/AuthContext";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { fetchAttendances } from "../../lib/feature/attendanceSlice";
import { fetchStudents } from "../../lib/feature/studentsSlice";
import { fetchNotifications } from "@/app/lib/feature/notificationSlice";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutationStatus } = useAppSelector((state) => state.attendanceSlice);
  const startDate = useAppSelector(
    (state) => state.schoolSlice.semesterStartDate
  );
  const { id } = useAppSelector((state) => state.userSlice.user);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/authentication/sign-in");
    }
  }, [user]);

  const today = new Date();
  const date = today.getDate().toString();
  const month = today.getMonth().toString();
  const year = today.getFullYear().toString();

  useEffect(() => {
    dispatch(fetchAttendances({ date, month, year, startDate }));
    dispatch(fetchStudents({}));
    dispatch(fetchNotifications({ userId: id, isRead: false }));
  }, []);

  useEffect(() => {
    if (mutationStatus !== "success") return;
    dispatch(fetchAttendances({ date, month, year }));
  }, [mutationStatus]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: "center",
        mx: 3,
        py: 3,
        mt: { xs: 8, md: 0 },
      }}
    >
      <Header />
      <MainGrid />
    </Stack>
  );
}
