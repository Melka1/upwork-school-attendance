"use client";

import Logo from "@/app/assets/svg/Logo";
import { ArrowBack } from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

function Header() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  return (
    <Stack
      direction="row"
      sx={{
        display: "flex",
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <IconButton
        sx={{ display: { xs: "flex", md: "none" } }}
        onClick={() => router.push("/dashboard")}
      >
        <ArrowBack />
      </IconButton>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={() => router.push("/dashboard")}
        startIcon={<Logo />}
      >
        <p className="text-lg font-bold leading-1">{t("schoolSystem")}</p>
      </Button>
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<ArrowBack />}
          onClick={() => router.push("/dashboard")}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {t("backToDashboard")}
        </Button>
      </Stack>
    </Stack>
  );
}

export default Header;
