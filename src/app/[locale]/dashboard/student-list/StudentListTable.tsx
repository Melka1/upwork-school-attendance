/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
"use client";
import React, { useEffect, useState } from "react";
import Search from "../../../components/Search";
import {
  Button,
  FormControl,
  Grid2 as Grid,
  IconButton,
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
import {
  fetchStudent,
  fetchStudents,
  setIsAddStudentModalOpen,
  setIsEditing,
  updateStudents,
} from "../../../lib/feature/studentsSlice";
import Delete from "../../../assets/svg/Delete";
import { RenderStatus } from "../../../components/CustomizedDataGrid";
import { OpenInFull, SaveOutlined } from "@mui/icons-material";
import {
  createAttendance,
  fetchAttendances,
} from "../../../lib/feature/attendanceSlice";
import { fetchClassrooms } from "../../../lib/feature/classroomSlice";
import { AttendanceStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { getDate } from "@/app/lib/utils";
import ClassroomsDropdown from "@/app/components/ClassroomsDropdown";

interface EditStudentInput {
  id: string;
  name: string;
  classroomName: string;
  status: AttendanceStatus;
}

function StudentListTable() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const { students, mutationStatus, isEditing } = useAppSelector(
    (state) => state.studentSlice
  );
  const { attendances, mutationStatus: attendanceMutationStatus } =
    useAppSelector((state) => state.attendanceSlice);
  const { classrooms } = useAppSelector((state) => state.classroomSlice);
  const [classroomFilter, setClassroomFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const [studentToEdit, setStudentToEdit] = useState<EditStudentInput | null>(
    null
  );

  console.log(studentToEdit);

  useEffect(() => {
    const { date, month, year } = getDate();
    dispatch(fetchStudents({}));
    dispatch(fetchAttendances({ date, month, year }));
    dispatch(fetchClassrooms({}));
  }, []);

  useEffect(() => {
    if (mutationStatus != "success") return;
    dispatch(fetchStudents({}));
  }, [mutationStatus]);

  useEffect(() => {
    const { date, month, year } = getDate();
    if (attendanceMutationStatus != "success") return;
    dispatch(fetchAttendances({ date, month, year }));
  }, [attendanceMutationStatus]);

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
    status: attendances.find((a) => a.studentId == s.id)?.status as string,
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
        if (isEditing && studentToEdit?.id == params.id) {
          return (
            <div className="flex h-full items-center">
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                value={studentToEdit?.name}
                onKeyDown={(event) => {
                  if (event.key === " ") {
                    event.stopPropagation();
                  }
                }}
                onChange={(e) => {
                  setStudentToEdit((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
              />
            </div>
          );
        }
        return params.row["name"];
      },
    },
    {
      field: "classroom",
      headerName: t("class"),
      flex: 1,
      minWidth: 150,
      sortable: false,
      filterable: true,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (isEditing && studentToEdit?.id == params.id) {
          return (
            <div className="flex h-full min-w-full items-center">
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
        return params.row["classroom"];
      },
    },
    {
      field: "status",
      headerName: t("status"),
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      sortable: false,
      filterable: true,
      renderCell: (params) => {
        if (isEditing && studentToEdit?.id == params.id) {
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
          params.value == "PRESENT"
            ? t("present").toUpperCase()
            : params.value == "ABSENT"
            ? t("absent").toUpperCase()
            : t("missing").toUpperCase();

        return RenderStatus({
          status: params.value as AttendanceStatus,
          label: attendanceTranslation,
        });
      },
    },
    {
      field: "action",
      headerName: t("action"),
      headerAlign: "center",
      align: "center",
      flex: 2,
      minWidth: 250,
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex gap-2 items-center justify-center h-full">
            {isEditing && studentToEdit?.id == params.id ? (
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
                    params.id == studentToEdit?.id
                  }
                  disabled={
                    studentToEdit?.name == params.row["name"] &&
                    studentToEdit?.status == params.row["status"] &&
                    studentToEdit?.classroomName == params.row["classroom"]
                  }
                  onClick={() => {
                    const { id, name, classroomName, status } = studentToEdit;

                    let promises = [];

                    if (
                      name != params.row["name"] ||
                      classroomName != params.row["classroom"]
                    ) {
                      promises.push(
                        dispatch(
                          updateStudents({
                            id,
                            classroomId: classrooms.find(
                              (c) => c.name == classroomName
                            )?.id,
                            name,
                          })
                        )
                      );
                    }

                    if (status != params.row["status"]) {
                      const previousAttendance = attendances.find(
                        (a) => a.studentId == params.id
                      );
                      promises.push(
                        dispatch(
                          createAttendance({
                            studentId: params.id as string,
                            status,
                            attendanceId:
                              previousAttendance?.id || (params.id as string),
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
                    dispatch(fetchStudent({ id: params.id as string }));
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
                    setIsEditing(false);
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
                    id: params.id as string,
                    name: params.row["name"],
                    classroomName: params.row["classroom"],
                    status: params.row["status"],
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

  return (
    <div>
      <div className="flex py-4 gap-4">
        <Search handleChange={setSearchFilter} />
        <ClassroomsDropdown
          value={classroomFilter || ""}
          setValue={({ target }) => setClassroomFilter(target.value)}
          includeAllAsChoice
        />
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
            onCellKeyDown={(_, e) => {
              if (e.key == " ") {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            localeText={{
              MuiTablePagination: {
                labelRowsPerPage: useTranslations("table")("rowsPerPage"),
              },
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default StudentListTable;
