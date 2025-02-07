"use client";

import { useAppSelector } from "../../lib/hooks";
import Loading from "../../components/Loading";
import { UserType } from "@prisma/client";
import { Stack } from "@mui/material";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, queryStatus } = useAppSelector((state) => state.userSlice);

  if (queryStatus != "success" || user.userType != UserType.TEACHER) {
    return <Loading />;
  }

  return (
    <Stack
      spacing={2}
      sx={{
        maxWidth: { sm: "100%", md: "80%" },
        alignItems: "center",
        mx: { xs: "0.75rem", md: "auto" },
        pt: "5rem",
        pb: "3rem",
      }}
    >
      {children}
    </Stack>
  );
}
