"use client";

import { useAppSelector } from "../../lib/hooks";
import Loading from "../../components/Loading";
import { UserType } from "@prisma/client";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, queryStatus } = useAppSelector((state) => state.userSlice);

  if (queryStatus != "success" || user.userType != UserType.TEACHER) {
    return <Loading />;
  }

  return <>{children}</>;
}
