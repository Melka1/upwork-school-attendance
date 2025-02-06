"use client";

import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "./CustomizedDataGrid";
import Card from "./Card";
import Search from "./Search";
import { FormControl, MenuItem, Select } from "@mui/material";
import StudentDetailModal from "./StudentDetailModal";
import SnackBar from "./SnackBar";
import { AttendanceStatus } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { formatDateTime } from "../lib/utils";

export default function MainGrid() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "">("");
  const [searchFilter, setSearchFilter] = useState("");

  return (
    <Card className="min-w-full">
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        {/* cards */}
        <div className="flex items-start md:justify-between md:items-center flex-col md:flex-row">
          <Typography component="h2" variant="h6">
            {t("todaysStudentStatus")}
          </Typography>

          <Typography component="p" suppressHydrationWarning>
            {/* {format(new Date(), "EEE MMM dd yyyy - h:mm a")} */}
            {formatDateTime(new Date().toUTCString(), locale)}
          </Typography>
        </div>

        <div className="flex py-4 gap-4">
          <Search handleChange={setSearchFilter} />
          <FormControl sx={{ minWidth: { xs: 80, md: 200 } }} size="small">
            <Select
              value={statusFilter}
              onChange={({ target }) =>
                setStatusFilter(target.value as AttendanceStatus)
              }
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">{t("allStatus")}</MenuItem>
              <MenuItem value={"PRESENT"}>{t("present")}</MenuItem>
              <MenuItem value={"ABSENT"}>{t("absent")}</MenuItem>
              <MenuItem value={"MISSING"}>{t("missing")}</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Grid container spacing={2} columns={12}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <CustomizedDataGrid
              statusFilter={statusFilter}
              searchFilter={searchFilter}
            />
          </Grid>
        </Grid>
      </Box>

      <StudentDetailModal />
      <SnackBar />
    </Card>
  );
}
