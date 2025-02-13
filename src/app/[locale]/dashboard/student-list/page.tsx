"use client";

import { Box, Button, IconButton, Typography } from "@mui/material";
import React from "react";
import AddOrEditStudentFormModal from "@/app/components/AddOrEditStudentform";
import { useTranslations } from "next-intl";
import Card from "@/app/components/Card";
import SnackBar from "@/app/components/SnackBar";
import AddTeacherFormModal from "@/app/components/AddTeacherForm";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  setIsAddStudentModalOpen,
  resetStudent,
  setIsEditing,
} from "@/app/lib/feature/studentsSlice";
import { PersonAddAlt } from "@mui/icons-material";
import StudentListTable from "./StudentListTable";

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

            <OpenAddStudentButton label={t("addNewStudent")} />
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
  const isEditing = useAppSelector((state) => state.studentSlice.isEditing);

  const handleOpenAddStudentModal = () => {
    isEditing == true && dispatch(setIsEditing(false));
    dispatch(resetStudent());
    dispatch(setIsAddStudentModalOpen(true));
  };

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
        onClick={() => handleOpenAddStudentModal()}
      >
        {label}
      </Button>
      <IconButton
        onClick={() => handleOpenAddStudentModal()}
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
