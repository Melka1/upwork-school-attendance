"use client";

import { useAuth } from "./provider/AuthContext";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { logOut } from "@/firebase/auth";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  console.log("User: ", user);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/authentication/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex border gap-4">
        <p>This is the dashboard</p>
        <button onClick={() => logOut()}>Sign Out</button>
      </div>
    </div>
  );
}
