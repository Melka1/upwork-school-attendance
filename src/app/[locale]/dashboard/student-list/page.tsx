"use client";

import { Box, Typography } from "@mui/material";
import React from "react";
import StudentListTable from "./StudentListTable";
import AddStudentFormModal from "@/app/components/AddStudentform";
import { useTranslations } from "next-intl";
import Card from "@/app/components/Card";
import SnackBar from "@/app/components/SnackBar";
import AddTeacherFormModal from "@/app/components/AddTeacherForm";

function StudentListPage() {
  const t = useTranslations("dashboard");
  return (
    <>
      <Card className="min-w-full">
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
          <div className="flex justify-between items-center">
            <Typography component="h2" variant="h6">
              {t("studentList")}
            </Typography>
          </div>

          <StudentListTable />
          <SnackBar />
        </Box>
      </Card>
      <AddStudentFormModal />
      <AddTeacherFormModal />
    </>
  );
}

export default StudentListPage;
