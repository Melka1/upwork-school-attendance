"use client";

import { useAppSelector } from "../../lib/hooks";
import Loading from "../../components/Loading";
import { UserType } from "@prisma/client";
import { Stack } from "@mui/material";
import Error from "@/app/components/Error";
import { useTranslations } from "next-intl";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations("dashboard");
  const { user, queryStatus } = useAppSelector((state) => state.userSlice);

  if (queryStatus == "error") {
    return <Error errorText={t("somethingWentWrong")} />;
  }

  if (queryStatus != "success" || user.userType != UserType.TEACHER) {
    return <Loading />;
  }

  return (
    <Stack
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
