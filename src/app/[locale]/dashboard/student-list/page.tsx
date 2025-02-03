"use client";

import { Add, ArrowBack } from "@mui/icons-material";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import React from "react";
import Logo from "../../../assets/svg/Logo";
import StudentListTable from "./StudentListTable";
import { useRouter } from "next/navigation";
import AddStudentFormModal from "@/app/components/AddStudentform";
import { useAppDispatch } from "@/app/lib/hooks";
import { setIsAddStudentModalOpen } from "@/app/lib/feature/studentsSlice";
import { useTranslations } from "next-intl";

function StudentListPage() {
  const t = useTranslations('dashboard')
  const router = useRouter();
  const dispatch = useAppDispatch();
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
      {/* header */}
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
        <Button
          variant="text"
          className="flex items-center gap-4"
          onClick={() => router.push("/dashboard")}
        >
          <Logo />
          <p className="text-lg font-bold">{t("schoolSystem")}</p>
        </Button>
        <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBack />}
            onClick={() => router.push("/dashboard")}
          >
            {t("backToDashboard")}
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: "black", color: "white" }}
            startIcon={<Add />}
            onClick={() => {
              dispatch(setIsAddStudentModalOpen(true));
            }}
          >
            {t('addNewStudent')}
          </Button>
        </Stack>
      </Stack>

      <Card className="min-w-full">
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
          {/* wrapper */}
          <div className="flex justify-between items-center">
            <Typography component="h2" variant="h6">
            {t('studentList')}
            </Typography>
          </div>

          {/* table */}
          <StudentListTable />
        </Box>
      </Card>
      <AddStudentFormModal />
    </Stack>
  );
}

export default StudentListPage;
