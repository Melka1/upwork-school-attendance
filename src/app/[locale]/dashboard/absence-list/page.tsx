"use client";

import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import StudentListTable from "./StudentAbsenceListTable";
import AddStudentFormModal from "@/app/components/AddStudentform";
import { useTranslations } from "next-intl";
import Card from "@/app/components/Card";
import SnackBar from "@/app/components/SnackBar";
import AddTeacherFormModal from "@/app/components/AddTeacherForm";
import Header from "./Header";

function AbsenceListPage() {
  const t = useTranslations("dashboard");
  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: "center",
        mx: { xs: "0.75rem", md: 3 },
        py: { xs: 1, md: 3 },
      }}
    >
      <Header />

      <Card className="min-w-full">
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
          <div className="flex justify-between items-center">
            <Typography component="h2" variant="h6">
              {t("studentsAbsenceList")}
            </Typography>
          </div>

          <StudentListTable />
          <SnackBar />
        </Box>
      </Card>
      <AddStudentFormModal />
      <AddTeacherFormModal />
    </Stack>
  );
}

export default AbsenceListPage;
