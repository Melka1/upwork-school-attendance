import React from "react";
import { useAppSelector } from "../lib/hooks";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useTranslations } from "next-intl";
import { SelectInputProps } from "@mui/material/Select/SelectInput";

interface ClassroomsDropdownProps {
  value: string;
  setValue: (value: any) => void;
  includeAllAsChoice?: boolean;
  fullWidth?: boolean;
}

function ClassroomsDropdown({
  value,
  setValue,
  includeAllAsChoice,
  fullWidth,
}: ClassroomsDropdownProps) {
  const t = useTranslations("dashboard");
  const classrooms = useAppSelector((state) => state.classroomSlice.classrooms);
  return (
    <FormControl
      sx={{
        minWidth: { xs: "100px", md: fullWidth ? "100%" : "200px" },
        maxWidth: fullWidth ? "100%" : "250px",
      }}
    >
      <Select
        value={value}
        onChange={setValue}
        inputProps={{ "aria-label": "Without label" }}
        label="Classroom"
        renderValue={
          !includeAllAsChoice
            ? (selected) => {
                if (selected?.length == 0) {
                  return <em>{t("selectClassroom")}</em>;
                }
                return selected;
              }
            : undefined
        }
        displayEmpty
      >
        {includeAllAsChoice && <MenuItem value="">{t("allClasses")}</MenuItem>}
        {[...classrooms]
          .sort((a, b) => {
            if (a.grade !== b.grade) return a.grade - b.grade;
            return a.section.localeCompare(b.section);
          })
          .map((c) => (
            <MenuItem key={c.id} value={c.name}>
              {t("class")} {c.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

export default ClassroomsDropdown;
