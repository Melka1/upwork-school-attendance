"use client";

import { useAppSelector } from "../../lib/hooks";
import Loading from "../../components/Loading";
import { UserType } from "@prisma/client";
import { Stack } from "@mui/material";
import ColorModeSelect from "@/app/theme/ColorModeSelect";

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
    <>
      <Stack
        spacing={2}
        sx={{
          maxWidth: { sm: "100%", md: "80%" },
          alignItems: "center",
          mx: { xs: "0.75rem", md: "auto" },
          py: { xs: 1, md: 3 },
        }}
      >
        {children}
      </Stack>
      <ColorModeSelect
        className="top-2 left-2"
        sx={{ position: "absolute", display: { xs: "none", md: "flex" } }}
      />
    </>
  );
}
