import React from "react";
import { Table } from "@tanstack/react-table";
import { IconButton, MenuItem, Select, Stack, Typography } from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";

interface DataTablePaginationProps {
  table: Table<any>;
}

function Pagination({ table }: DataTablePaginationProps) {
  const t = useTranslations("table");
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      gap={3}
      alignItems={"center"}
    >
      <Stack direction={"row"} alignItems={"center"} gap={1}>
        <Typography display={{ xs: "none", sm: "block" }}>
          {t("rowsPerPage")}
        </Typography>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onChange={({ target }) => {
            table.setPageSize(Number(target.value));
          }}
        >
          {[5, 10, 25, 50].map((pageSize) => (
            <MenuItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Typography display={{ xs: "none", sm: "block" }}>
        {t("page")} {table.getState().pagination.pageIndex + 1}
      </Typography>

      <Stack direction={"row"} alignItems={"center"} gap={{ xs: 2, sm: 1 }}>
        <IconButton
          size="small"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          <KeyboardDoubleArrowLeft className="h-4 w-4 rtl:rotate-180" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </IconButton>
        <Typography display={{ xs: "block", sm: "none" }}>
          {table.getState().pagination.pageIndex + 1}
        </Typography>
        <IconButton
          size="small"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          <KeyboardDoubleArrowRight className="h-4 w-4 rtl:rotate-180" />
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default Pagination;
