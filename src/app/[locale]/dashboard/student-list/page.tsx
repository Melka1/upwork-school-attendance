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
import { setIsAddStudentModalOpen } from "@/app/lib/feature/studentsSlice";
import { PersonAddAlt } from "@mui/icons-material";

function StudentListPage() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  return (
    <>
      <Card className="min-w-full">
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
          <div className="flex justify-between items-center">
            <Typography component="h2" variant="h6">
              {t("studentList")}
            </Typography>

            <Button
              variant="outlined"
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },
              }}
              onClick={() => dispatch(setIsAddStudentModalOpen(true))}
            >
              {t("addNewStudent")}
            </Button>
            <IconButton
              onClick={() => dispatch(setIsAddStudentModalOpen(true))}
              sx={{
                display: {
                  xs: "flex",
                  sm: "none",
                },
              }}
            >
              <PersonAddAlt />
            </IconButton>
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
