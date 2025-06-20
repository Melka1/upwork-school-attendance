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
import {
  Button,
  Chip,
  Typography,
} from "@mui/material";
import Absent from "../assets/svg/Absent";
import {
  createAttendance,
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
      flex: 2,
      minWidth: 200,
      sortable: true,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Typography
            sx={{
              cursor: "pointer",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: "classroom",
      headerName: t("class"),
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
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
      minWidth: 150,
      renderCell: (params) => {
        const attendanceTranslation =
          params.value == "PRESENT"
            ? t("present").toUpperCase()
            : params.value == "ABSENT"
            ? t("absent").toUpperCase()
            : t("missing").toUpperCase();
        return RenderStatus({
          status: params.value as any,
          label: attendanceTranslation,
        });
      },
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
      minWidth: 300,
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
              dispatch(
                createAttendance({
                  studentId: params.id as string,
                  status: AttendanceStatus.ABSENT,
                  attendanceId: previousAttendance?.id || (params.id as string),
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
      localeText={{
        MuiTablePagination: {
          labelRowsPerPage: useTranslations("table")("rowsPerPage"),
        },
      }}
    />
  );
}

export function RenderStatus({
  status,
  label,
}: {
  status?: AttendanceStatus;
  label: string;
}) {
  const colors: { [index: string]: "success" | "warning" | "error" } = {
    PRESENT: "success",
    MISSING: "warning",
    ABSENT: "error",
  };

  return status ? (
    <Chip label={label} color={colors[status]} size="small" />
  ) : (
    "-"
  );
}
