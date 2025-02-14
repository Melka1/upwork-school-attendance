"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { AttendanceStatus } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";
import Card from "@/app/components/Card";
import Search from "@/app/components/Search";
import { formatDateForCalendarRange, formatDateTime } from "@/app/lib/utils";
import StudentDetailModal from "@/app/components/StudentDetailModal";
import SnackBar from "@/app/components/SnackBar";
import TableContent from "@/app/components/TableContent";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  fetchStudent,
  setIsStudentDetailModalOpen,
  Student,
} from "@/app/lib/feature/studentsSlice";
import { CalendarMonth, UnfoldMoreOutlined } from "@mui/icons-material";
import StatusCard from "@/app/components/StatusCard";
import Absent from "@/app/assets/svg/Absent";
import {
  createAttendance,
  setChosenDate,
} from "@/app/lib/feature/attendanceSlice";
import Pagination from "@/app/components/Pagination";
import Present from "@/app/assets/svg/Present";

export default function TodaysStudentStatusTable() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const locale = useLocale();

  const semesterStartDate = useAppSelector(
    (state) => state.schoolSlice.semesterStartDate
  );
  const { students, status } = useAppSelector((state) => state.studentSlice);
  const { attendances, mutationStatus, chosenDate } = useAppSelector(
    (state) => state.attendanceSlice
  );
  const [updatedStudentId, setUpdatedStudentId] = React.useState("");

  const [sorting, setSorting] = useState<SortingState>([
    {
      desc: false,
      id: "name",
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });

  const columnDef: ColumnDef<Student>[] = [
    {
      accessorKey: "id",
      header: "",
      cell: "",
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            fullWidth
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            size={"small"}
            color="darker"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minWidth: "150px",
            }}
          >
            <span className="text-md font-bold">{t("student")}</span>
            <UnfoldMoreOutlined className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <Button
            sx={{ display: "flex", justifyContent: "start" }}
            fullWidth
            onClick={() => {
              dispatch(fetchStudent({ id }));
              dispatch(setIsStudentDetailModalOpen(true));
            }}
          >
            {row.getValue("name") || "-"}
          </Button>
        );
      },
    },
    {
      accessorKey: "classroom",
      accessorFn: (row) => row.classroom.name,
      header: () => <p className="text-muted-foreground">{t("class")}</p>,
      cell: ({ row }) => {
        return (
          <div className="whitespace-nowrap text-center">
            {row.getValue("classroom") || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <p className="text-muted-foreground min-w-[100px]">{t("status")}</p>
      ),
      cell: ({ row }) => {
        const id = row.original.id;
        const status = attendances.find((a) => a.studentId == id)
          ?.status as string;
        const attendanceTranslation =
          status == "PRESENT"
            ? t("present").toUpperCase()
            : status == "ABSENT"
            ? t("absent").toUpperCase()
            : t("missing").toUpperCase();
        return (
          <div className="flex justify-center">
            {StatusCard({
              status: status as AttendanceStatus,
              label: attendanceTranslation,
            })}
          </div>
        );
      },
      filterFn: (row, _, filterValue) => {
        const id = row.original.id;
        const status =
          (attendances.find((a) => a.studentId == id)?.status as string) ||
          null;

        console.log("Filter value:", filterValue, status);
        return filterValue == null ? true : status == filterValue;
      },
    },
    {
      accessorKey: "action",
      header: () => <p className="text-muted-foreground">{t("action")}</p>,
      cell: ({ row }) => {
        const id = row.original.id;
        const status = attendances.find((a) => a.studentId == id)
          ?.status as string;
        return (
          <div className="flex justify-center px-8">
            <Button
              variant="contained"
              color={status == "ABSENT" ? "success" : "error"}
              startIcon={status != "ABSENT" ? <Absent /> : <Present />}
              loadingPosition="start"
              loading={mutationStatus == "saving" && id == updatedStudentId}
              sx={{ minWidth: "max-content" }}
              onClick={() => {
                setUpdatedStudentId(id as string);
                const previousAttendance = attendances.find(
                  (a) => a.studentId == id
                );
                console.log(status);
                dispatch(
                  createAttendance({
                    studentId: id as string,
                    status:
                      status == "ABSENT"
                        ? AttendanceStatus.PRESENT
                        : AttendanceStatus.ABSENT,
                    attendanceId: previousAttendance?.id || (id as string),
                    date: chosenDate,
                  })
                );
              }}
            >
              {status == "ABSENT" ? t("setPresent") : t("setAbsent")}
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: students,
    columns: columnDef,
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <>
      <Card className="min-w-full">
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
          {/* cards */}
          <div className="flex items-start md:justify-between md:items-center flex-col md:flex-row">
            <Typography component="h2" variant="h6">
              {chosenDate != formatDateForCalendarRange(new Date())
                ? t("studentAttendanceStatus")
                : t("todaysStudentStatus")}
            </Typography>

            <Typography component="p" suppressHydrationWarning>
              {formatDateTime(
                new Date(chosenDate || Date.now()).toUTCString(),
                locale
              )}
            </Typography>
          </div>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            marginY={{ xs: 1, sm: 2 }}
            gap={{ xs: 1, sm: 2 }}
          >
            <Search
              handleChange={(e) => {
                table.getColumn("name")?.setFilterValue(e);
              }}
            />
            <Stack direction={"row"} gap={{ xs: 1, sm: 2 }}>
              <FormControl sx={{ minWidth: { xs: 80, md: 200 } }} size="small">
                <Select
                  value={
                    (table.getColumn("status").getFilterValue() as string) || ""
                  }
                  onChange={({ target }) =>
                    table
                      .getColumn("status")
                      ?.setFilterValue(target.value == "" ? null : target.value)
                  }
                  displayEmpty
                  inputProps={{
                    "aria-label": "filter students by attendance status",
                  }}
                >
                  <MenuItem value="">{t("allStatus")}</MenuItem>
                  <MenuItem value={"PRESENT"}>{t("present")}</MenuItem>
                  <MenuItem value={"ABSENT"}>{t("absent")}</MenuItem>
                  <MenuItem value={"MISSING"}>{t("missing")}</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small">
                <TextField
                  type="date"
                  size="small"
                  value={chosenDate}
                  aria-label="Select date to fetch attendance records"
                  onChange={({ target }) => {
                    let date = "";
                    if (target.value == "") {
                      date = formatDateForCalendarRange(new Date());
                    } else {
                      date = target.value;
                    }
                    dispatch(setChosenDate(date));
                  }}
                  slotProps={{
                    htmlInput: {
                      min: formatDateForCalendarRange(
                        new Date(semesterStartDate)
                      ),
                      max: formatDateForCalendarRange(new Date()),
                    },
                    inputLabel: {
                      shrink: true,
                    },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </FormControl>
            </Stack>
          </Stack>

          <div className="flex gap-4 flex-col">
            <div className="rounded-md border border-gray-500/20 flex gap-4 flex-col">
              <TableContent
                columnDef={columnDef}
                table={table}
                status={status}
              />
            </div>
            <Pagination table={table} />
          </div>
        </Box>

        <SnackBar />
      </Card>
      <StudentDetailModal />
    </>
  );
}
