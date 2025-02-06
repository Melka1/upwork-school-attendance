import * as React from "react";
import { useColorScheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectProps } from "@mui/material/Select";
import { useTranslations } from "next-intl";

export default function ColorModeSelect(props: SelectProps) {
  const t = useTranslations("dashboard");
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  return (
    <Select
      fullWidth
      sx={{ maxWidth: "150px" }}
      size="small"
      value={mode}
      onChange={(event) =>
        setMode(event.target.value as "system" | "light" | "dark")
      }
      SelectDisplayProps={{
        // @ts-expect-error it is needed
        "data-screenshot": "toggle-mode",
      }}
      {...props}
    >
      <MenuItem value="system">{t("system")}</MenuItem>
      <MenuItem value="light">{t("light")}</MenuItem>
      <MenuItem value="dark">{t("dark")}</MenuItem>
    </Select>
  );
}
