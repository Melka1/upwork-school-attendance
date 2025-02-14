"use client";

import { Box, Typography } from "@mui/material";
import React from "react";
import { useTranslations } from "next-intl";
import Card from "@/app/components/Card";
import StudentAbsenceListTable from "./StudentAbsenceListTable";

function AbsenceListPage() {
  const t = useTranslations("dashboard");
  return (
    <Card className="min-w-full">
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <div className="flex justify-between items-center">
          <Typography component="h2" variant="h6">
            {t("studentsAbsenceList")}
          </Typography>
        </div>

        <StudentAbsenceListTable />
      </Box>
    </Card>
  );
}

export default AbsenceListPage;
