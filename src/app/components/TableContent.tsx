import {
  Table as T,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";
import { ColumnDef, flexRender, Table } from "@tanstack/react-table";
import React from "react";
import { cn } from "../lib/utils";
import { useTranslations } from "next-intl";

function TableContent({
  table,
  columnDef,
  status,
}: {
  table: Table<any>;
  columnDef: ColumnDef<any>[];
  status: any;
}) {
  const t = useTranslations();
  return (
    <T>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="parent-table">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className={cn("max-h-10 hover:bg-primary/30 ")}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : status == "loading" && table.getRowModel().rows?.length == 0 ? (
          <TableRow className="min-h-[200px]">
            <TableCell
              colSpan={columnDef.length}
              className="h-24 text-base sm:text-xl last:text-left"
            >
              {t("common.loading")}
            </TableCell>
          </TableRow>
        ) : status == "error" ? (
          <TableRow>
            <TableCell
              colSpan={columnDef.length}
              className="h-24 text-base sm:text-xl last:text-left"
            >
              {t("dashboard.somethingWentWrong")}
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell
              colSpan={columnDef.length}
              className="h-24 text-base sm:text-xl last:text-left"
            >
              {t("table.noResults")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </T>
  );
}

export default TableContent;
