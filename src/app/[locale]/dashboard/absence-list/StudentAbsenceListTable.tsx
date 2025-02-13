/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

import { UnfoldMoreOutlined } from "@mui/icons-material";
import { AttendanceStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { getDate } from "@/app/lib/utils";
import ClassroomsDropdown from "@/app/components/ClassroomsDropdown";
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
import TableContent from "@/app/components/TableContent";
import Search from "@/app/components/Search";
import { fetchStudents, Student } from "@/app/lib/feature/studentsSlice";
import { fetchAttendances } from "@/app/lib/feature/attendanceSlice";
import { fetchClassrooms } from "@/app/lib/feature/classroomSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import Pagination from "@/app/components/Pagination";

function StudentAbsenceListTable() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const { students, status } = useAppSelector((state) => state.studentSlice);
  const startDate = useAppSelector(
    (state) => state.schoolSlice.semesterStartDate
  );
  const { attendances } = useAppSelector((state) => state.attendanceSlice);

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
        return (
          <div className="whitespace-nowrap pl-4">
            {row.getValue("name") || "-"}
          </div>
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
      accessorKey: "absentCount",
      header: () => (
        <p className="text-muted-foreground min-w-max">{t("absentCount")}</p>
      ),
      cell: ({ row }) => {
        const studentId = row.original.id;
        const absentCount =
          attendances.filter((a) => a.studentId == studentId)?.length || 0;
        return (
          <div className="whitespace-nowrap text-center">{absentCount}</div>
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

  useEffect(() => {
    const { date, month, year } = getDate();
    dispatch(fetchStudents({}));
    dispatch(fetchAttendances({ startDate, status: AttendanceStatus.ABSENT }));
    dispatch(fetchClassrooms({}));
  }, []);

  return (
    <div>
      <div className="flex py-4 gap-4">
        <Search
          handleChange={(e) => {
            table.getColumn("name")?.setFilterValue(e);
          }}
        />
        <ClassroomsDropdown
          value={
            (table.getColumn("classroom").getFilterValue() as string) || ""
          }
          setValue={({ target }) => {
            table
              .getColumn("classroom")
              ?.setFilterValue(target.value == "" ? null : target.value);
          }}
          includeAllAsChoice
        />
      </div>

      <div className="flex gap-4 flex-col">
        <div className="rounded-md border border-gray-500/20 flex gap-4 flex-col">
          <TableContent columnDef={columnDef} table={table} status={status} />
        </div>
        <Pagination table={table} />
      </div>
    </div>
  );
}

export default StudentAbsenceListTable;
