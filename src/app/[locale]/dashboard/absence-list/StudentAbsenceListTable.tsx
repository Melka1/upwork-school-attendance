/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
"use client";
import React, { useEffect, useState } from "react";
import Search from "../../../components/Search";
import {
  Button,
  FormControl,
  Grid2 as Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridLogicOperator,
  GridRowsProp,
} from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks";
import { fetchStudents } from "../../../lib/feature/studentsSlice";
import { fetchAttendances } from "../../../lib/feature/attendanceSlice";
import { fetchClassrooms } from "../../../lib/feature/classroomSlice";
import { AttendanceStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { getDate } from "@/app/lib/utils";

function StudentAbsenceListTable() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const { students } = useAppSelector((state) => state.studentSlice);
  const startDate = useAppSelector(
    (state) => state.schoolSlice.semesterStartDate
  );
  const { attendances, mutationStatus: attendanceMutationStatus } =
    useAppSelector((state) => state.attendanceSlice);
  const { classrooms } = useAppSelector((state) => state.classroomSlice);
  const [classroomFilter, setClassroomFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    const { date, month, year } = getDate();
    dispatch(fetchStudents({}));
    dispatch(fetchAttendances({ startDate, status: AttendanceStatus.ABSENT }));
    dispatch(fetchClassrooms({}));
  }, []);

  let filterItems: GridFilterItem[] = [];
  if (searchFilter)
    filterItems.push({
      id: 1,
      field: "name",
      operator: "contains",
      value: searchFilter,
    });
  if (classroomFilter)
    filterItems.push({
      id: 2,
      field: "classroom",
      operator: "equals",
      value: classroomFilter,
    });

  const filterModel: GridFilterModel = {
    items: filterItems,
    logicOperator: GridLogicOperator.And,
  };

  const rows: GridRowsProp = students.map((s) => ({
    id: s.id,
    name: s.name,
    classroom: s.classroom.name,
    absentCount: attendances.filter((a) => a.studentId == s.id)?.length || 0,
  }));

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("student"),
      flex: 2,
      minWidth: 200,
      sortable: true,
      filterable: false,
      renderCell: (params) => {
        return params.row["name"];
      },
    },
    {
      field: "classroom",
      headerName: t("class"),
      flex: 1,
      minWidth: 100,
      sortable: false,
      filterable: true,
      disableColumnMenu: true,
      renderCell: (params) => {
        return params.row["classroom"];
      },
    },
    {
      field: "absentCount",
      headerName: t("absentCount"),
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => {
        return params.value;
      },
    },
  ];

  return (
    <div>
      <div className="flex py-4 gap-4">
        <Search handleChange={setSearchFilter} />
        <FormControl
          sx={{ minWidth: { xs: "100px", md: "200px" }, maxWidth: "250px" }}
        >
          <Select
            value={classroomFilter || ""}
            onChange={({ target }) => setClassroomFilter(target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="">{t("allClasses")}</MenuItem>
            {classrooms.map((c) => (
              <MenuItem key={c.id} value={c.name}>
                {t("class")} {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <DataGrid
            sx={{
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
            }}
            rows={rows}
            columns={columns}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            sortModel={[{ field: "name", sort: "asc" }]}
            pageSizeOptions={[10, 20, 50]}
            disableColumnResize
            density="standard"
            filterModel={filterModel}
            disableColumnMenu
            disableRowSelectionOnClick
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default StudentAbsenceListTable;
