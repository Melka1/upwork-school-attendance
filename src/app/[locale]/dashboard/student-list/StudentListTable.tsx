/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import {
  OpenInFull,
  SaveOutlined,
  UnfoldMoreOutlined,
} from "@mui/icons-material";
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
import {
  fetchStudent,
  fetchStudents,
  setIsAddStudentModalOpen,
  setIsEditing,
  Student,
  updateStudents,
} from "@/app/lib/feature/studentsSlice";
import {
  createAttendance,
  fetchAttendances,
} from "@/app/lib/feature/attendanceSlice";
import { fetchClassrooms } from "@/app/lib/feature/classroomSlice";
import Delete from "@/app/assets/svg/Delete";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import Search from "@/app/components/Search";
import TableContent from "@/app/components/TableContent";
import StatusCard from "@/app/components/StatusCard";
import Pagination from "@/app/components/Pagination";

interface EditStudentInput {
  id: string;
  name: string;
  classroomName: string;
  status: AttendanceStatus;
}

function StudentListTable() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const { students, mutationStatus, isEditing, status } = useAppSelector(
    (state) => state.studentSlice
  );
  const {
    attendances,
    mutationStatus: attendanceMutationStatus,
    status: attendanceStatus,
  } = useAppSelector((state) => state.attendanceSlice);
  const { classrooms, status: classroomStatus } = useAppSelector(
    (state) => state.classroomSlice
  );

  const [studentToEdit, setStudentToEdit] = useState<EditStudentInput | null>(
    null
  );

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

  console.log(attendances, students, classrooms);

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
        const { id, name } = row.original;
        if (isEditing && studentToEdit?.id == id) {
          return (
            <div className="flex h-full items-center">
              <TextField
                id="name"
                variant="outlined"
                fullWidth
                size="small"
                defaultValue={studentToEdit?.name || ""}
                onBlur={(e) => {
                  setStudentToEdit((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
              />
            </div>
          );
        }
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
        const id = row.original.id;
        if (isEditing && studentToEdit?.id == id) {
          return (
            <div className="flex h-full w-full min-w-full items-center">
              <ClassroomsDropdown
                fullWidth
                value={studentToEdit?.classroomName || ""}
                setValue={({ target }) =>
                  setStudentToEdit((prev) => ({
                    ...prev,
                    classroomName: target.value,
                  }))
                }
              />
            </div>
          );
        }
        return (
          <div className="whitespace-nowrap text-center">
            {row.getValue("classroom") || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <p className="text-muted-foreground">{t("status")}</p>,
      cell: ({ row }) => {
        const id = row.original.id;
        const status = attendances.find((a) => a.studentId == id)
          ?.status as string;

        if (isEditing && studentToEdit?.id == id) {
          return (
            <div className="flex h-full min-w-full items-center">
              <FormControl sx={{ minWidth: "100%" }}>
                <Select
                  value={studentToEdit?.status || AttendanceStatus.PRESENT}
                  onChange={({ target }) =>
                    setStudentToEdit((prev) => ({
                      ...prev,
                      status: target.value as AttendanceStatus,
                    }))
                  }
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value={"PRESENT"}>{t("present")}</MenuItem>
                  <MenuItem value={"ABSENT"}>{t("absent")}</MenuItem>
                  <MenuItem value={"MISSING"}>{t("missing")}</MenuItem>
                </Select>
              </FormControl>
            </div>
          );
        }

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
        const { id, name, classroom } = row.original;
        const status = attendances.find((a) => a.studentId == id)?.status;

        return (
          <div className="flex gap-2 items-center justify-center h-full px-4">
            {isEditing && studentToEdit?.id == id ? (
              <>
                <Button
                  variant="contained"
                  size="small"
                  color="darker"
                  sx={{
                    fontWeight: "bold",
                  }}
                  startIcon={<SaveOutlined />}
                  loadingPosition="start"
                  loading={
                    (mutationStatus == "saving" ||
                      attendanceMutationStatus == "saving") &&
                    id == studentToEdit?.id
                  }
                  disabled={
                    studentToEdit?.name == name &&
                    studentToEdit?.status == status &&
                    studentToEdit?.classroomName == classroom.name
                  }
                  onClick={() => {
                    const {
                      name: nameFromInput,
                      classroomName,
                      status: statusFromEdit,
                    } = studentToEdit;

                    let promises = [];

                    if (
                      nameFromInput != name ||
                      classroomName != classroom.name
                    ) {
                      promises.push(
                        dispatch(
                          updateStudents({
                            id,
                            classroomId: classrooms.find(
                              (c) => c.name == classroomName
                            )?.id,
                            name: nameFromInput,
                          })
                        )
                      );
                    }

                    if (statusFromEdit != status) {
                      const previousAttendance = attendances.find(
                        (a) => a.studentId == id
                      );
                      promises.push(
                        dispatch(
                          createAttendance({
                            studentId: id as string,
                            status: statusFromEdit,
                            attendanceId:
                              previousAttendance?.id || (id as string),
                          })
                        )
                      );
                    }

                    Promise.all(promises).then(() => {
                      setIsEditing(false);
                      setStudentToEdit(null);
                    });
                  }}
                >
                  {t("save")}
                </Button>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => {
                    dispatch(fetchStudent({ id: id as string }));
                    dispatch(setIsAddStudentModalOpen(true));
                  }}
                  sx={{ minWidth: "unset" }}
                >
                  <OpenInFull color="inherit" fontSize="small" />
                </IconButton>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => {
                    setStudentToEdit(null);
                    dispatch(setIsEditing(false));
                  }}
                  sx={{ minWidth: "unset" }}
                >
                  <Delete color="white" fontSize={16} />
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ fontWeight: "bold" }}
                onClick={() => {
                  setStudentToEdit({
                    id: id as string,
                    name,
                    classroomName: classroom.name,
                    status,
                  });
                  dispatch(setIsEditing(true));
                }}
              >
                {t("edit")}
              </Button>
            )}
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

  useEffect(() => {
    const { date, month, year } = getDate();
    dispatch(fetchStudents({}));
    dispatch(fetchAttendances({ date, month, year }));
    dispatch(fetchClassrooms({}));
  }, [dispatch]);

  useEffect(() => {
    if (mutationStatus != "success") return;
    dispatch(fetchStudents({}));
  }, [mutationStatus]);

  useEffect(() => {
    const { date, month, year } = getDate();
    if (attendanceMutationStatus != "success") return;
    dispatch(fetchAttendances({ date, month, year }));
  }, [attendanceMutationStatus]);

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

export default StudentListTable;
