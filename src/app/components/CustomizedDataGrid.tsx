import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridLogicOperator,
  GridRowsProp,
} from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  fetchStudent,
  setIsStudentDetailModalOpen,
} from "../lib/feature/studentsSlice";
import { Button, Chip, CircularProgress, TextField } from "@mui/material";
import Absent from "../assets/svg/Absent";
import { EAttendanceStatus } from "../lib/enums";
import {
  createAttendance,
  updateAttendances,
} from "../lib/feature/attendanceSlice";
import { AttendanceStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

interface CustomizedDataGridProps {
  searchFilter?: string;
  statusFilter?: string;
}

export default function CustomizedDataGrid({
  searchFilter,
  statusFilter,
}: CustomizedDataGridProps) {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const students = useAppSelector((state) => state.studentSlice.students);
  const { attendances, mutationStatus } = useAppSelector(
    (state) => state.attendanceSlice
  );
  const [updatedStudentId, setUpdatedStudentId] = React.useState("");
  // eslint-disable-next-line prefer-const
  let filterItems: GridFilterItem[] = [];
  if (searchFilter)
    filterItems.push({
      id: 1,
      field: "name",
      operator: "contains",
      value: searchFilter,
    });
  if (statusFilter)
    filterItems.push({
      id: 2,
      field: "status",
      operator: "equals",
      value: statusFilter,
    });

  const filterModel: GridFilterModel = {
    items: filterItems,
    logicOperator: GridLogicOperator.And,
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("student"),
      flex: 1.5,
      minWidth: 300,
      sortable: true,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: "classroom",
      headerName: t("class"),
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      sortable: false,
      filterable: true,
      disableColumnMenu: true,
    },
    {
      field: "status",
      headerName: t("status"),
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => renderStatus(params.value as any),
      sortable: false,
      filterable: true,
      disableColumnMenu: true,
    },
    {
      field: "action",
      headerName: t("action"),
      headerAlign: "center",
      align: "center",
      flex: 2,
      minWidth: 100,
      renderCell: (params) => (
        <div className="">
          <Button
            variant="contained"
            color="error"
            startIcon={<Absent />}
            loadingPosition="start"
            loading={
              mutationStatus == "saving" && params.id == updatedStudentId
            }
            disabled={
              attendances.find((a) => a.studentId == params.id)?.status ==
              AttendanceStatus.ABSENT
            }
            onClick={() => {
              setUpdatedStudentId(params.id as string);
              const previousAttendance = attendances.find(
                (a) => a.studentId == params.id
              );
              console.log(params.row["status"]);
              if (params.row["status"] == AttendanceStatus.ABSENT) return;
              if (previousAttendance) {
                dispatch(
                  updateAttendances({
                    id: previousAttendance.id,
                    status: AttendanceStatus.ABSENT,
                  })
                );
                return;
              }
              dispatch(
                createAttendance({
                  studentId: params.id as string,
                  status: AttendanceStatus.ABSENT,
                })
              );
            }}
          >
            {t("setAbsent")}
          </Button>
        </div>
      ),
      disableColumnMenu: true,
      filterable: false,
      sortable: false,
    },
  ];

  const rows: GridRowsProp = students.map((s) => {
    return {
      id: s.id,
      name: s.name,
      classroom: s.classroom.name,
      status: attendances.find((a) => a.studentId == s.id)?.status,
    };
  });

  return (
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
      onCellClick={(params) => {
        if (params.field !== "name") return;
        dispatch(fetchStudent({ id: params.id as string }));
        dispatch(setIsStudentDetailModalOpen(true));
      }}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="standard"
      filterModel={filterModel}
      sortModel={[{ field: "name", sort: "asc" }]}
      disableRowSelectionOnClick
    />
  );
}

export function renderStatus(status?: EAttendanceStatus) {
  const colors: { [index: string]: "success" | "warning" | "error" } = {
    PRESENT: "success",
    MISSING: "warning",
    ABSENT: "error",
  };

  return status ? (
    <Chip label={status} color={colors[status]} size="small" />
  ) : (
    "-"
  );
}
