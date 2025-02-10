"use client";

import { Box, Button, IconButton, Typography } from "@mui/material";
import React from "react";
import StudentListTable from "./StudentListTable";
import AddOrEditStudentFormModal from "@/app/components/AddOrEditStudentform";
import { useTranslations } from "next-intl";
import Card from "@/app/components/Card";
import SnackBar from "@/app/components/SnackBar";
import AddTeacherFormModal from "@/app/components/AddTeacherForm";
import { useAppDispatch } from "@/app/lib/hooks";
import {
  setIsAddStudentModalOpen,
  resetStudent,
} from "@/app/lib/feature/studentsSlice";
import { PersonAddAlt } from "@mui/icons-material";

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

            <OpenAddStudentButton label={t("addStudent")} />
          </div>

          <StudentListTable />
          <SnackBar />
        </Box>
      </Card>
      <AddOrEditStudentFormModal />
      <AddTeacherFormModal />
    </>
  );
}

export default StudentListPage;

const OpenAddStudentButton = ({ label }: { label: string }) => {
  const dispatch = useAppDispatch();
  return (
    <>
      <Button
        variant="outlined"
        sx={{
          display: {
            xs: "none",
            sm: "flex",
          },
        }}
        onClick={() => {
          resetStudent();
          dispatch(setIsAddStudentModalOpen(true));
        }}
      >
        {label}
      </Button>
      <IconButton
        onClick={() => {
          resetStudent();
          dispatch(setIsAddStudentModalOpen(true));
        }}
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },
        }}
      >
        <PersonAddAlt />
      </IconButton>
    </>
  );
};
