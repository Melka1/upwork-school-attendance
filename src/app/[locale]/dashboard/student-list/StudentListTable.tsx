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
import {
  fetchStudent,
  fetchStudents,
  setIsStudentDetailModalOpen,
  updateStudents,
} from "../../../lib/feature/studentsSlice";
import Delete from "../../../assets/svg/Delete";
import { renderStatus } from "../../../components/CustomizedDataGrid";
import { SaveOutlined } from "@mui/icons-material";
import {
  createAttendance,
  fetchAttendances,
  updateAttendances,
} from "../../../lib/feature/attendanceSlice";
import { fetchClassrooms } from "../../../lib/feature/classroomSlice";
import { AttendanceStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { getDate } from "@/app/lib/utils";

interface EditStudentInput {
  id: string;
  name: string;
  classroom: string;
  status: AttendanceStatus;
}

function StudentListTable() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const { students, mutationStatus } = useAppSelector(
    (state) => state.studentSlice
  );
  const { attendances, mutationStatus: attendanceMutationStatus } =
    useAppSelector((state) => state.attendanceSlice);
  const { classrooms } = useAppSelector((state) => state.classroomSlice);
  const [classroomFilter, setClassroomFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<EditStudentInput | null>(
    null
  );

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
    status: attendances.find((a) => a.studentId == s.id)?.status,
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
        if (isEditing && studentToEdit.id == params.id) {
          return (
            <div className="flex h-full items-center">
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                value={studentToEdit.name}
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
        if (isEditing && studentToEdit.id == params.id) {
          return (
            <div className="flex h-full min-w-full items-center">
              <FormControl sx={{ minWidth: "100%", maxWidth: "250px" }}>
                <Select
                  value={studentToEdit?.classroom || ""}
                  onChange={({ target }) =>
                    setStudentToEdit((prev) => ({
                      ...prev,
                      classroom: target.value,
                    }))
                  }
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {classrooms.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {t("class")} {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
        if (isEditing && studentToEdit.id == params.id) {
          return (
            <div className="flex h-full min-w-full items-center">
              <FormControl sx={{ minWidth: "100%" }}>
                <Select
                  value={studentToEdit?.status || ""}
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
        return renderStatus(params.value as any);
      },
    },
    {
      field: "action",
      headerName: t("action"),
      headerAlign: "center",
      align: "center",
      flex: 2,
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div className="flex gap-2 items-center justify-center h-full">
            {isEditing && studentToEdit.id == params.id ? (
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
                  params.id == studentToEdit.id
                }
                disabled={
                  studentToEdit?.name == params.row["name"] &&
                  studentToEdit?.status == params.row["status"] &&
                  studentToEdit?.classroom ==
                    classrooms.find((c) => c.name == params.row["classroom"]).id
                }
                onClick={() => {
                  const { id, name, classroom, status } = studentToEdit;

                  let promises = [];

                  if (
                    studentToEdit?.name != params.row["name"] ||
                    studentToEdit?.classroom !=
                      classrooms.find((c) => c.name == params.row["classroom"])
                        .id
                  ) {
                    promises.push(
                      dispatch(
                        updateStudents({
                          id,
                          classroomId: classroom,
                          name,
                        })
                      )
                    );
                  }

                  if (status != params.row["status"]) {
                    const previousAttendance = attendances.find(
                      (a) => a.studentId == params.id
                    );
                    if (previousAttendance) {
                      promises.push(
                        dispatch(
                          updateAttendances({
                            id: previousAttendance.id,
                            status,
                          })
                        )
                      );
                    } else {
                      promises.push(
                        dispatch(
                          createAttendance({
                            studentId: params.id as string,
                            status,
                          })
                        )
                      );
                    }
                  }

                  Promise.all(promises).then(() => {
                    setIsEditing(false);
                    setStudentToEdit(null);
                  });
                }}
              >
                {t("save")}
              </Button>
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
                    classroom: classrooms.find(
                      (c) => c.name == params.row["classroom"]
                    ).id,
                    status: params.row["status"],
                  });
                  setIsEditing(true);
                }}
              >
                {t("edit")}
              </Button>
            )}

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
          </div>
        );
      },
      filterable: false,
      sortable: false,
    },
  ];

  return (
    <div>
      <div className="flex py-4 gap-4">
        <Search handleChange={setSearchFilter} />
        <FormControl sx={{ minWidth: "100px", maxWidth: "250px" }}>
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
            onCellKeyDown={(_, e) => {
              if (e.key == " ") {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default StudentListTable;
